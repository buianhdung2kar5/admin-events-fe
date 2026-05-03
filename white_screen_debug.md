# Hướng dẫn khắc phục lỗi "Trắng màn hình" khi Deploy

Lỗi "Trắng màn hình" (White Screen of Death) sau khi deploy thường do ứng dụng bị treo (crash) ngay khi vừa khởi chạy, trước khi kịp render bất kỳ giao diện nào. Dưới đây là các nguyên nhân phổ biến và cách kiểm tra.

## 1. Kiểm tra Console trong Browser (Quan trọng nhất)
Hãy mở trang web bị trắng màn, nhấn **F12** (hoặc chuột phải -> Inspect) và chọn tab **Console**.
- Nếu thấy lỗi màu đỏ (ví dụ: `Uncaught ReferenceError`, `process is not defined`, `apiKey is missing`...), đó chính là nguyên nhân.
- Chụp ảnh màn hình lỗi này để tôi có thể giúp bạn sửa chính xác.

## 2. Thiếu biến môi trường (Environment Variables)
Ứng dụng của chúng ta sử dụng Firebase và API URL thông qua `process.env`. Nếu bạn deploy lên GitHub Pages, Vercel, hay Host cá nhân mà chưa cấu hình các biến này, ứng dụng sẽ bị lỗi.

**Các biến cần cấu hình trên server deploy:**
- `REACT_APP_API_URL`
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

> [!IMPORTANT]
> Với Create React App, các biến môi trường **BẮT BUỘC** phải bắt đầu bằng tiền tố `REACT_APP_`.

## 3. Lỗi cấu hình Routing (GitHub Pages / Nginx)
Nếu bạn truy cập vào một đường dẫn sâu (ví dụ: `events.net.vn/login`) và bị trắng màn hoặc lỗi 404:
- **GitHub Pages**: Không hỗ trợ mặc định cho Single Page Application (SPA). Bạn cần sử dụng `HashRouter` thay vì `BrowserRouter` hoặc sử dụng thủ thuật `404.html` để redirect.
- **Nginx/Apache**: Cần cấu hình để mọi request đều trỏ về `index.html`.

## 4. Lỗi "Object.object is undefined"
Trong quá trình migration API, nếu có một Component nào đó cố gắng truy cập dữ liệu từ API mà không kiểm tra `null/undefined` (ví dụ: `response.object.content` khi `object` chưa về), nó sẽ làm treo toàn bộ ứng dụng.

**Cách khắc phục tạm thời:** Luôn sử dụng Optional Chaining (`?.`) và giá trị mặc định.
```javascript
// Thay vì:
const list = response.object.content;
// Hãy dùng:
const list = response?.object?.content || [];
```

## 5. Kiểm tra file `package.json`
Trong `package.json` của bạn có dòng:
`"homepage": "https://events.net.vn/"`
Hãy đảm bảo URL này chính xác với tên miền bạn đang sử dụng. Nếu bạn deploy vào sub-folder (ví dụ: `events.net.vn/admin`), homepage phải là `https://events.net.vn/admin`.

---
**Để tôi giúp bạn nhanh nhất:**
Hãy gửi cho tôi nội dung lỗi ở tab **Console** khi bạn mở trang web bị trắng màn nhé!
