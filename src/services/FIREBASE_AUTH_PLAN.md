# Kế hoạch tích hợp Firebase Authentication

## Luồng xác thực mục tiêu

```
[Login Page]
    │ 1. signInWithEmailAndPassword(email, password)
    ▼
[Firebase]
    │ 2. Trả về userCredential (chứa idToken)
    ▼
[authService.ts]
    │ 3. POST /api/auth/verify  →  Header: Authorization: Bearer <idToken>
    ▼
[Backend]
    │ 4. Trả về UserDtoOut { role, status, userProfile, ... }
    ▼
[authService.ts]
    │ 5. Kiểm tra role === "ADMIN" → lưu session, cho vào Dashboard
    ▼
[Admin Dashboard]
```

---

## Bước 1: Cập nhật `.env.local`

### Tại sao cần làm?

File `.env.local` hiện chỉ có `API_URL`. Cần bổ sung các biến Firebase để file `firebase.ts`
có thể đọc cấu hình một cách an toàn thay vì hardcode trực tiếp vào source code.

> ⚠️ **TUYỆT ĐỐI KHÔNG** hardcode `apiKey`, `projectId`... trực tiếp trong file `.ts`.
> Nếu lỡ push lên GitHub, bất kỳ ai cũng đọc được và có thể lạm dụng Firebase project của bạn.
> File `.env.local` được Git tự động bỏ qua (nằm trong `.gitignore`).p

### Sẽ thêm vào `.env.local`:

```env
REACT_APP_API_URL=https://events-backend-tgrs.onrender.com/api

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## Bước 2: Cập nhật `src/firebase.ts`

### Tại sao cần làm?

File này bạn đã tạo nhưng đang **hardcode `databaseURL` trực tiếp** vào source code.
Cần dọn dẹp lại để tất cả cấu hình đều đọc từ biến môi trường.

### Sẽ thay đổi:

- Xóa dòng `databaseURL` hardcode → chuyển sang biến môi trường `REACT_APP_FIREBASE_DATABASE_URL`.
- Giữ nguyên `export const auth` vì đây là thứ `authService.ts` cần để gọi Firebase.

---

## Bước 3: Viết lại `src/services/authService.ts` ⭐ Quan trọng nhất

### Tại sao cần viết lại?

File hiện tại có 3 vấn đề:

1. Đang dùng **mock data** (`MOCK_ACCOUNTS`) — không dùng được với backend thật.
2. Dùng **key sai** để lưu token (`"admin_token"` → cần đổi thành `"id_token"`).
3. Gọi API login trực tiếp bằng `fetch` thay vì đi qua Firebase trước.

### 3a. `loginApi(email, password)` — Viết lại hoàn toàn

**Luồng mới:**

```
Cũ: fetch trực tiếp lên /api/admin/auth/login

Mới:
  Bước 1 → Gọi Firebase: signInWithEmailAndPassword(auth, email, password)
  Bước 2 → Lấy idToken: credential.user.getIdToken()
  Bước 3 → Gọi Backend: POST /api/auth/verify  (Bearer <idToken>)
  Bước 4 → Đọc response.object, kiểm tra role === "ADMIN"
  Bước 5 → Nếu KHÔNG phải ADMIN → throw Error "Không có quyền truy cập"
  Bước 6 → Nếu ĐÚNG → lưu idToken + user info vào localStorage → return user
```

**Tác dụng:** Đảm bảo chỉ tài khoản có role `ADMIN` mới vào được hệ thống.
Firebase lo việc kiểm tra email/password đúng chưa, Backend lo việc kiểm tra role.

---

### 3b. Thêm hàm `onAuthChange(callback)` — Mới hoàn toàn

**Luồng hoạt động:**

```
Khi mở tab mới hoặc người dùng nhấn F5:
  → Firebase tự kiểm tra: "User này có đang đăng nhập không?"
  → Có  → Lấy idToken mới → Gọi lại /api/auth/verify → callback(user)
  → Không → callback(null) → AuthProvider biết cần redirect về /login
```

**Tác dụng:**

- Tự động **phục hồi session** khi F5 mà không bắt người dùng đăng nhập lại.
- Firebase tự động **gia hạn token** (mỗi giờ), hàm này sẽ lấy token mới nhất.
- Không bao giờ bị "đăng nhập ảo" với token đã hết hạn.

---

### 3c. `logout()` — Cập nhật

```
Cũ: Chỉ xóa localStorage

Mới:
  Bước 1 → Gọi POST /api/auth/logout (báo backend invalidate session phía server)
  Bước 2 → Gọi signOut(auth) của Firebase (xóa session phía Firebase)
  Bước 3 → Xóa localStorage (xóa token + user khỏi trình duyệt)
```

**Tác dụng:** Đăng xuất sạch ở **cả 3 nơi**: Backend, Firebase, và trình duyệt.
Tránh trường hợp token còn sống trên Firebase nhưng user tưởng đã logout.

---

## Bước 4: Cập nhật `src/auth/AuthProvider.tsx`

### Tại sao cần làm?

Hiện tại `AuthProvider` chỉ **đọc localStorage một lần** khi app khởi động:

```typescript
// Cách cũ — Nguy hiểm!
useEffect(() => {
  const storedToken = getStoredToken(); // Đọc localStorage một lần
  const storedUser = getStoredUser();
  if (storedToken && storedUser) {
    setToken(storedToken); // Token này có thể đã hết hạn!
    setUser(storedUser);
  }
  setIsLoading(false);
}, []);
```

**2 vấn đề:**

1. Token trong localStorage **có thể đã hết hạn** → app vẫn nghĩ user đang đăng nhập (đăng nhập ảo).
2. Không bắt được sự kiện Firebase tự động gia hạn token.

### Sẽ thay đổi:

```typescript
// Cách mới — An toàn!
useEffect(() => {
  const unsubscribe = onAuthChange((user) => { // Lắng nghe Firebase
    setUser(user);
    setIsLoading(false);
  });
  return unsubscribe; // Cleanup khi component unmount
}, []);
```

**Tác dụng:**

- Firebase là **"nguồn sự thật"** duy nhất về trạng thái đăng nhập.
- Token tự động được gia hạn, session luôn hợp lệ.

---

## Bước 5: Cập nhật `src/services/apiClient.ts`

### Tại sao cần làm?

Response Interceptor hiện tại chỉ `console.error` khi gặp lỗi 401 nhưng không làm gì thêm.
Người dùng sẽ bị **treo màn hình** hoặc thấy lỗi loạn xạ mà không biết tại sao.

### Sẽ thêm vào handler lỗi 401:

```typescript
if (status === 401) {
  clearSession();                  // Xóa token cũ khỏi localStorage
  window.location.href = '/login'; // Đá ngay về trang Login
}
```

**Tác dụng:**
Khi token hết hạn giữa chừng (đang dùng app bình thường, đột nhiên token expire),
người dùng tự động được đưa về trang Login với giao diện sạch sẽ thay vì màn hình lỗi.

---

## Tóm tắt

| # | File                            | Loại  | Mô tả ngắn                                      |
| - | ------------------------------- | ------ | -------------------------------------------------- |
| 1 | `.env.local`                  | MODIFY | Thêm biến Firebase                               |
| 2 | `src/firebase.ts`             | MODIFY | Dọn dẹp `databaseURL` hardcode                 |
| 3 | `src/services/authService.ts` | MODIFY | Viết lại hoàn toàn — trọng tâm              |
| 4 | `src/auth/AuthProvider.tsx`   | MODIFY | Dùng `onAuthChange` thay vì đọc localStorage |
| 5 | `src/services/apiClient.ts`   | MODIFY | Xử lý 401 → redirect về `/login`             |

---

## Chi tiết từng File đã triển khai

---

### `src/services/authService.ts` — Tầng xử lý xác thực

> Đây là "bộ não" của toàn bộ hệ thống Auth. Mọi logic liên quan đến đăng nhập, đăng xuất, lưu session đều nằm ở đây. Component và Provider không được phép gọi Firebase trực tiếp — phải đi qua file này.

#### Sơ đồ luồng đầy đủ

```
loginApi(email, password)
         │
         ▼
[Firebase] signInWithEmailAndPassword(auth, email, password)
         │ Trả về: credential (chứa Firebase user)
         ▼
credential.user.getIdToken()
         │ Trả về: idToken (chuỗi JWT từ Firebase)
         ▼
fetch POST /auth/verify
     Header: Authorization: Bearer <idToken>
         │ Trả về: { errorCode, statusCode, object: UserDtoOut }
         ▼
Kiểm tra user.role === "ADMIN" ?
  ├── KHÔNG → signOut(auth) + throw Error "Không có quyền"
  └── CÓ  → Kiểm tra user.status === "DISABLED" ?
               ├── CÓ  → signOut(auth) + throw Error "Tài khoản bị khoá"
               └── KHÔNG → saveSession(idToken, user) → return AdminUser
```

#### Các hàm và chức năng

| Hàm | Kiểu | Chức năng |
|-----|------|-----------|
| `loginApi(email, password)` | `async` | Toàn bộ luồng đăng nhập: Firebase → Verify → check role |
| `onAuthChange(callback)` | listener | Lắng nghe Firebase auth state. Gọi callback mỗi khi trạng thái đăng nhập thay đổi |
| `logout()` | `async` | Đăng xuất sạch: gọi `/auth/logout` → `signOut(Firebase)` → `clearSession()` |
| `saveSession(token, user)` | sync | Lưu `id_token` và `admin_user` vào `localStorage` |
| `getStoredToken()` | sync | Đọc `id_token` từ `localStorage` — dùng bởi `apiClient` để gắn header |
| `getStoredUser()` | sync | Đọc `admin_user` từ `localStorage`, parse JSON an toàn |
| `clearSession()` | sync | Xóa `id_token` + `admin_user` khỏi `localStorage` |

#### Giải thích hàm `onAuthChange` chi tiết

```
Khi app khởi động / F5 / mở tab mới:
  Firebase SDK tự hỏi server: "Token của user này còn hợp lệ không?"
    ├── Nếu HẾT HẠN → Firebase trả về null → callback(null)
    └── Nếu CÒN HẠN → Firebase tự gia hạn → trả về firebaseUser
              │
              ▼
         getIdToken() → lấy token mới nhất
              │
              ▼
         POST /auth/verify → lấy thông tin user mới nhất từ Backend
              │
         Kiểm tra role === "ADMIN" ?
              ├── KHÔNG → callback(null)
              └── CÓ   → saveSession(newToken, user) → callback(user)
```

---

### `src/auth/AuthProvider.tsx` — Tầng quản lý React State

> `AuthProvider` là "cầu nối" giữa tầng xác thực (`authService`) và các component React. Nó bọc toàn bộ ứng dụng, giữ state `user` và `token`, và phân phối xuống thông qua React Context.

#### Sơ đồ vị trí trong cây component

```
<App>
  └── <AuthProvider>          ← Quản lý state: user, token, isLoading
        └── <AuthContext.Provider value={{ user, token, login, logout, ... }}>
              └── <Router>
                    ├── <ProtectedRoute>   ← Đọc context: isAuthenticated?
                    │     └── <Dashboard>  ← Đọc context: user.name, user.role
                    └── <LoginPage>        ← Gọi context: login(email, password)
```

#### State quản lý

| State | Kiểu | Mô tả |
|-------|------|-------|
| `user` | `AdminUser \| null` | Thông tin admin đang đăng nhập. `null` = chưa đăng nhập |
| `token` | `string \| null` | Firebase ID Token. `null` = chưa đăng nhập |
| `isLoading` | `boolean` | `true` khi đang kiểm tra auth state lần đầu (tránh flash màn hình) |

#### Các hàm trong Context

| Hàm | Chức năng | Gọi từ đâu |
|-----|-----------|------------|
| `login(email, password)` | Gọi `loginApi()` → cập nhật `user` và `token` trong state | `LoginPage` |
| `logout()` | Gọi `logoutService()` → reset `user` và `token` về `null` | Header / Sidebar |

#### Luồng khởi động (useEffect)

```
App mount lần đầu
       │
       ▼
useEffect → onAuthChange(callback) bắt đầu lắng nghe Firebase
       │
       ▼ (Firebase kiểm tra session trong ~1 giây)
       │
  isLoading = true (ProtectedRoute hiển thị màn hình loading)
       │
       ├── Firebase trả về user hợp lệ
       │     → setUser(adminUser), setToken(idToken), isLoading = false
       │     → ProtectedRoute cho vào Dashboard
       │
       └── Firebase trả về null (chưa đăng nhập / token hết hạn)
             → setUser(null), setToken(null), isLoading = false
             → ProtectedRoute redirect về /login
```

#### Luồng đăng nhập

```
[LoginPage] gọi login(email, password)
       │
       ▼
isLoading = true
       │
       ▼
loginApi(email, password)     ← gọi authService
       │
  Thành công → setUser(adminUser), setToken(idToken), isLoading = false
  Thất bại   → throw Error → LoginPage bắt và hiển thị thông báo lỗi
```

#### Luồng đăng xuất

```
[Header] gọi logout()
       │
       ▼
isLoading = true
       │
       ▼
logoutService()    ← gọi authService: Backend + Firebase + localStorage
       │
       ▼
setUser(null), setToken(null), isLoading = false
       │
       ▼
onAuthChange listener kích hoạt (Firebase báo user = null)
       │
       ▼
ProtectedRoute redirect về /login
```

---

*Tài liệu này được tạo để phục vụ mục đích review và onboarding.*
