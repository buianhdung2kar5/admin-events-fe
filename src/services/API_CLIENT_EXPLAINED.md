# Giải thích chi tiết từng dòng — `apiClient.ts`

File này tạo ra một **HTTP Client** tập trung cho toàn bộ ứng dụng, dựa trên thư viện **Axios**. Mọi request gọi đến API server đều đi qua đây.

---

## 🌟 Tổng quan thông qua ví dụ thực tế

Để hiểu rõ tại sao chúng ta cần `apiClient.ts` (đặc biệt là cơ chế Interceptors), hãy xem xét một kịch bản thực tế: **Lấy danh sách người dùng (`GET /api/users`)**.

### ❌ Nếu KHÔNG CÓ `apiClient.ts` (Dùng fetch thông thường)

Mỗi khi cần gọi API ở bất kỳ Component nào, bạn sẽ phải viết một đoạn code lặp đi lặp lại như sau:

```javascript
// Trong component A
const fetchUsers = async () => {
  try {
    // 1. Phải nhớ thủ công URL server
    const url = "http://localhost:3000/api/users";
    
    // 2. Phải tự đi tìm token trong localStorage
    const token = localStorage.getItem("admin_token");
    
    // 3. Phải tự setup headers cho MỖI request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "" // Quên dòng này là server từ chối ngay!
      }
    });

    // 4. Phải tự xử lý lỗi HTTP (fetch không tự văng lỗi nếu status là 4xx, 5xx)
    if (!response.ok) {
      // 5. Lại phải tự xử lý vụ hết hạn token (401) ở mọi nơi
      if (response.status === 401) {
         window.location.href = '/login';
         return;
      }
      throw new Error("Lỗi gọi API");
    }

    // 6. Phải tự parse JSON
    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error("Xử lý lỗi thủ công:", error);
  }
};
```

**Hậu quả:**
- Code bị **phình to và lặp lại** (WET - Write Everything Twice). Nếu app có 50 API, bạn phải viết lại đoạn setup token và bắt lỗi 50 lần.
- Rất dễ **quên** đính kèm token hoặc quên xử lý lỗi.
- Nếu ngày mai backend đổi cách xác thực (ví dụ đổi từ `Bearer` sang `Token`), bạn phải đi sửa ở 50 file khác nhau.

---

### ✅ KHI CÓ `apiClient.ts`

Với cấu trúc mà file `apiClient.ts` mang lại, đoạn code trên trong Component của bạn rút gọn chỉ còn:

```javascript
import apiClient from '../services/apiClient';

// Trong component A
const fetchUsers = async () => {
  try {
    // Chỉ cần quan tâm đến: Gọi API nào?
    const data = await apiClient.get("/api/users"); 
    console.log(data); // data đã được parse JSON sẵn!
  } catch (error) {
    // Lỗi đã được format chuẩn, chỉ việc hiển thị
    alert(error.message); 
  }
};
```

**Tại sao nó làm được như vậy?**
- `apiClient` giống như một **"Người vận chuyển (Shipper)" chuyên nghiệp**. 
- Thay vì bạn phải tự tay gói hàng (setup URL), tự dán tem (gắn Token), và tự lo lắng xem đi đường có rủi ro gì không (bắt lỗi HTTP), bạn chỉ cần giao "địa chỉ" (`/api/users`) cho người vận chuyển.
- **Request Interceptor** sẽ tự động dán tem (Token) vào gói hàng trước khi nó đi.
- **Response Interceptor** sẽ tự động kiểm tra xem hàng về có nguyên vẹn không, bóc sẵn hộp (parse JSON) và báo cáo rõ ràng nếu có sự cố (chuẩn hóa Error).

Đó là lý do `apiClient` là xương sống không thể thiếu của một frontend project chuyên nghiệp!

---

## Phần 1: Import thư viện

```typescript
import axios from "axios";
```
> **Dòng 1.** Import thư viện `axios` — thư viện HTTP client phổ biến nhất cho JavaScript. Nó giúp gửi các request GET, POST, PUT, DELETE... đến server.

```typescript
import { getStoredToken } from "./authService";
```
> **Dòng 2.** Import hàm `getStoredToken` từ file `authService.ts` cùng thư mục. Hàm này đọc JWT token đang được lưu trong `localStorage` của trình duyệt. Token này sẽ được dùng để xác thực danh tính với server ở mỗi request.

---

## Phần 2: Cấu hình địa chỉ server

```typescript
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
```
> **Dòng 4.** Xác định địa chỉ gốc (base URL) của API server.
> - `process.env.REACT_APP_API_URL`: Đọc từ biến môi trường trong file `.env`. Dùng khi deploy lên production (VD: `https://api.sevents.vn`).
> - `|| "http://localhost:3000"`: Nếu biến môi trường không tồn tại (khi chạy local), mặc định kết nối đến server đang chạy ở cổng `3000` trên máy lập trình viên.
>
> ✅ **Lợi ích:** Cùng một code chạy được ở cả local lẫn production mà không cần sửa thủ công.

---

## Phần 3: Tạo Axios Instance

```typescript
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```
> **Dòng 6–11.** Tạo một "bản sao" của Axios với cấu hình riêng, được đặt tên là `apiClient`. Thay vì dùng `axios` trực tiếp, ta dùng `apiClient` để mọi request đều tự động mang theo cấu hình này.
>
> - **`baseURL: BASE_URL`**: Mọi URL bạn truyền vào (VD: `/api/users`) sẽ tự được ghép thành URL đầy đủ (VD: `http://localhost:3000/api/users`). Bạn không cần gõ lại địa chỉ server mỗi lần gọi API.
> - **`"Content-Type": "application/json"`**: Báo cho server biết dữ liệu bạn gửi lên có định dạng JSON. Đây là chuẩn mặc định cho hầu hết các REST API hiện đại.

---

## Phần 4: Request Interceptor (Bộ chặn Request)

```typescript
apiClient.interceptors.request.use(
```
> **Dòng 13.** Đăng ký một "bộ chặn" cho tất cả các **request** gửi đi. Mọi request từ `apiClient` sẽ đi qua đây **trước khi** được gửi lên server. Đây là nơi lý tưởng để tự động gắn thêm thông tin xác thực.

```typescript
  (config) => {
    const token = getStoredToken();
```
> **Dòng 14–15.** `config` là object chứa toàn bộ thông tin của request chuẩn bị gửi (URL, method, headers, body...). Gọi `getStoredToken()` để lấy JWT token từ `localStorage`.

```typescript
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
```
> **Dòng 16–18.** Nếu token tồn tại (người dùng đang đăng nhập), gắn nó vào header `Authorization` theo chuẩn **Bearer Token**. Server sẽ đọc header này để xác minh danh tính.
>
> 💡 **Giải thích thêm: Tại sao gắn ở đây mà không phải ở `axios.create` phía trên?**
> - `axios.create` (Dòng 6-11) chỉ thiết lập cấu hình **mặc định (static)** một lần duy nhất khi ứng dụng vừa chạy. Lúc này, có thể người dùng chưa đăng nhập, nên ta không có token để truyền vào.
> - `interceptors.request.use` (Dòng 13) hoạt động như một "trạm kiểm soát" **động (dynamic)**. Nó sẽ kích hoạt *vào thời điểm chuẩn bị gửi mỗi request*. Nó lấy cấu hình từ `axios.create` (gọi là `config`), sau đó bạn có quyền chỉnh sửa/thêm bớt vào `config` này (ở đây là thêm header `Authorization`) ngay trước khi request thực sự bay lên server.
> - Nhờ vậy, ngay cả khi người dùng vừa mới đăng nhập xong và token mới được lưu vào `localStorage`, request tiếp theo sẽ tự động lấy được token mới nhất này.
>
> ✅ **Kết quả:** Mọi request sẽ tự động có header: `Authorization: Bearer eyJhbGci...` mà bạn không cần viết thủ công ở từng chỗ gọi API.

```typescript
    return config;
  },
```
> **Dòng 19–20.** **BẮT BUỘC phải có.** Trả về `config` sau khi đã chỉnh sửa. Nếu quên `return config`, request sẽ bị treo và không bao giờ được gửi đi.

```typescript
  (error) => {
    return Promise.reject(error);
  }
);
```
> **Dòng 21–24.** Xử lý trường hợp có lỗi xảy ra ngay trong quá trình chuẩn bị request (hiếm xảy ra). `Promise.reject(error)` truyền lỗi này xuống để component có thể bắt bằng `try-catch`.

---

## Phần 5: Response Interceptor (Bộ chặn Response)

```typescript
apiClient.interceptors.response.use(
```
> **Dòng 27.** Đăng ký một "bộ chặn" cho tất cả các **response** nhận về. Mọi phản hồi từ server sẽ đi qua đây **trước khi** đến tay component của bạn.

```typescript
  (response) => {
    return response.data;
  },
```
> **Dòng 28–30.** Hàm này chạy khi server phản hồi **thành công** (HTTP status 2xx).
>
> Axios trả về một object `response` có cấu trúc: `{ data, status, headers, config, ... }`. Thay vì phải viết `response.data` ở mọi nơi, ta trả về luôn `response.data` — tức là dữ liệu "thuần" từ server. Nhờ đó, trong component bạn chỉ cần `const data = await apiClient.get(...)` mà không cần `.data` thêm nữa.

```typescript
  (error) => {
    const status = error.response ? error.response.status : null;
```
> **Dòng 31–32.** Hàm này chạy khi có **lỗi**. Có 2 loại lỗi:
> - `error.response` có giá trị: Server đã phản hồi nhưng với mã lỗi (4xx, 5xx).
> - `error.response` là `null/undefined`: Không kết nối được đến server (mất mạng, server down).
>
> Dòng này an toàn lấy HTTP status code nếu có, ngược lại gán là `null`.

```typescript
    if (status === 401) {
      console.error("Phiên đăng nhập hết hạn.");
      // Tùy chọn: clearSession(); window.location.href = '/login';
    }
```
> **Dòng 34–37.** Xử lý riêng trường hợp lỗi **401 Unauthorized** — token đã hết hạn hoặc không hợp lệ. Hiện tại chỉ log ra console. Dòng comment gợi ý cách mở rộng: xóa session và tự động redirect người dùng về trang `/login`.

```typescript
    const message = error.response?.data?.message || error.message || "Đã có lỗi xảy ra";
```
> **Dòng 39.** Trích xuất thông báo lỗi theo thứ tự ưu tiên:
> 1. `error.response?.data?.message`: Thông báo lỗi do **server** trả về (VD: `"Email không tồn tại"`).
> 2. `error.message`: Thông báo lỗi từ **Axios/network** (VD: `"Network Error"`).
> 3. `"Đã có lỗi xảy ra"`: Thông báo fallback mặc định nếu không có gì khác.
>
> Toán tử `?.` (optional chaining) đảm bảo code không bị crash nếu `error.response` là `null`.

```typescript
    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);
```
> **Dòng 42–47.** Tạo và trả về một object lỗi có **cấu trúc thống nhất** cho toàn bộ ứng dụng:
> - `status`: HTTP status code (400, 401, 500, hoặc null nếu mất mạng).
> - `message`: Chuỗi thông báo lỗi đã được chuẩn hóa.
> - `data`: Toàn bộ body lỗi từ server (để debug chi tiết nếu cần).
>
> ✅ **Lợi ích:** Mọi component dùng `try-catch` đều nhận được cùng một định dạng lỗi, không cần xử lý riêng từng trường hợp.

---

## Phần 6: Export

```typescript
export default apiClient;
```
> **Dòng 50.** Export `apiClient` để sử dụng ở toàn bộ ứng dụng. Bất kỳ file nào cần gọi API đều `import apiClient from './apiClient'`.

---

## Sơ đồ luồng hoạt động

```
Component gọi: apiClient.get('/api/users')
        │
        ▼
┌─────────────────────────────┐
│   Request Interceptor        │
│   → Đọc token localStorage  │
│   → Gắn Authorization header│
└─────────────┬───────────────┘
              │ Gửi request đến server
              ▼
         [ SERVER ]
              │ Nhận phản hồi
              ▼
┌─────────────────────────────┐
│   Response Interceptor       │
│   Thành công → return .data  │
│   Thất bại   → reject object │
│     { status, message, data }│
└─────────────┬───────────────┘
              │
              ▼
     Component nhận kết quả
     (dữ liệu sạch hoặc lỗi đã chuẩn hóa)
```

---

*Tài liệu được tạo tự động để phục vụ mục đích học tập và onboarding.*
