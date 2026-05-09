# Phân tích Hệ thống Xác thực và Giao tiếp API

Tài liệu này phân tích chi tiết hai tệp lõi trong hệ thống quản lý admin: `authService.ts` và `apiClient.ts`. Hai tệp này phối hợp với nhau để tạo ra một luồng xác thực an toàn, tự động và bền bỉ.

---

## 1. `authService.ts`: Tầng Quản lý Xác thực (Firebase & Session)

Đây là nơi tập trung toàn bộ logic nghiệp vụ liên quan đến danh tính người dùng. Nó đóng vai trò là "nguồn sự thật duy nhất" (Source of Truth) cho trạng thái đăng nhập.

### Các Chức năng Chính

*   **Xác thực Firebase (`loginApi`)**:
    *   Sử dụng SDK Firebase để xác thực Email/Password.
    *   Sau khi Firebase xác nhận, nó gọi Backend (`/auth/verify`) để kiểm tra quyền hạn (`role === 'ADMIN'`). Điều này đảm bảo bảo mật hai lớp.
*   **Quản lý Vòng đời Token**:
    *   `isTokenExpired(token)`: Giải mã JWT (Base64) để kiểm tra thời gian hết hạn (`exp`). Nó sử dụng một "safe buffer" 5 phút để tránh trường hợp token hết hạn ngay khi vừa gửi request.
    *   `refreshToken()`: Ép buộc Firebase SDK cấp một `idToken` mới (`getIdToken(true)`). Đây là chìa khóa để duy trì phiên làm việc mà không cần bắt người dùng đăng nhập lại.
*   **Lưu trữ (`saveSession`, `getStoredToken`)**: Tương tác trực tiếp với `localStorage` để duy trì dữ liệu qua các lần tải lại trang (F5).
*   **Lắng nghe sự thay đổi (`onAuthChange`)**: Sử dụng `onAuthStateChanged` của Firebase để tự động khôi phục phiên làm việc khi người dùng mở ứng dụng.

---

## 2. `apiClient.ts`: Tầng Giao tiếp API (Axios Interceptors)

Tệp này cấu hình một thực thể Axios (`apiClient`) được tinh chỉnh để tự động hóa việc đính kèm danh tính và xử lý các lỗi mạng.

### Cơ chế Interceptors (Bộ đánh chặn)

#### A. Request Interceptor (Trước khi gửi đi)
Mọi request gửi từ ứng dụng đều đi qua bộ lọc này:
1.  Gọi `getValidToken()`.
2.  Nếu token hết hạn, nó sẽ đợi `authService` refresh thành công trước khi đi tiếp.
3.  Tự động gắn header: `Authorization: Bearer <token>`.

#### B. Response Interceptor (Sau khi nhận phản hồi)
Đây là nơi xử lý logic "tự phục hồi" khi gặp lỗi:
*   **Xử lý lỗi 401 (Unauthorized)**:
    1.  Nếu server trả về 401, nó không đẩy lỗi ra ngay.
    2.  Nó đánh dấu request này là `_retry = true`.
    3.  Gọi `refreshToken()` để lấy "vé thông hành" mới.
    4.  Nếu thành công, nó thực hiện lại chính request cũ với token mới. Người dùng hoàn toàn không nhận ra có lỗi xảy ra.
    5.  Nếu refresh thất bại (ví dụ: tài khoản bị khóa trên Firebase), nó sẽ gọi `logout()` để đảm bảo an toàn.

---

## 3. Sơ đồ phối hợp

1. **Gửi Request**: UI -> `apiClient` -> [Kiểm tra Token trong `authService`] -> Server.
2. **Hết hạn**: Server trả về 401 -> `apiClient` phát hiện -> Gọi `refreshToken` trong `authService` -> [Firebase cấp token mới] -> `apiClient` gửi lại request ban đầu.
3. **Kết quả**: UI nhận được dữ liệu, người dùng không hề biết đã có lỗi 401 vừa được xử lý ngầm.

---

## 4. Kết luận

Sự kết hợp này mang lại 3 lợi ích lớn:
1.  **Trải nghiệm người dùng mượt mà**: Không bao giờ bị văng ra trang Login khi đang thao tác chỉ vì token hết hạn (thường là sau 60 phút đối với Firebase).
2.  **Bảo mật**: Token chỉ được lưu ở nơi cần thiết và luôn được kiểm tra quyền Admin từ Backend.
3.  **Code gọn sạch**: Các developer khi viết logic nghiệp vụ không cần quan tâm đến việc gắn token hay xử lý lỗi 401.
