# Kiến trúc và Tích hợp Docker trong Dự án Frontend

Tài liệu này giải thích chi tiết lý do tại sao chúng ta sử dụng Docker, tác dụng của từng file cấu hình và quy trình tích hợp Docker vào một dự án Frontend (React).

## 1. Tại sao lại dùng Docker cho dự án Frontend?

Docker giúp đóng gói toàn bộ ứng dụng của bạn và môi trường chạy nó vào một "hộp" duy nhất gọi là **Container**.

**Các lợi ích chính:**
- **Môi trường đồng nhất:** Mã nguồn chạy trên máy bạn (Windows) giống hệt 100% khi chạy trên server (Linux) hay máy của đồng nghiệp (Mac). Chấm dứt tình trạng *"Lạ nhỉ, code chạy ngon trên máy em mà lên server lại lỗi"*.
- **Triển khai cực nhanh (CI/CD):** Server không cần phải cài đặt Node.js hay Nginx phức tạp. Chỉ cần tải Docker Image về và chạy.
- **Bảo mật và cô lập:** Ứng dụng chạy trong một không gian riêng biệt, không ảnh hưởng đến các phần mềm khác trên cùng một máy chủ.
- **Khả năng mở rộng (Scale):** Có thể bật hàng chục container cùng lúc nếu hệ thống cần xử lý lượng truy cập lớn.

---

## 2. Giải thích chi tiết các file cấu hình Docker

Dự án này sử dụng mô hình **Multi-stage Build** (Build nhiều giai đoạn) để tối ưu hóa. Chúng ta có 3 file quan trọng:

### 2.1. `Dockerfile` - Trái tim của Docker
Đây là kịch bản (script) hướng dẫn Docker cách tạo ra "Container". File này được chia làm 2 giai đoạn (Stages):

**Stage 1: Build (Giai đoạn Biên dịch)**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```
- **Tác dụng:** Docker tạo một máy chủ ảo cực nhẹ có sẵn Node.js (`node:18-alpine`). Nó copy code của bạn vào, chạy `npm ci` để cài thư viện, rồi chạy `npm run build` để đóng gói React code thành các file HTML/CSS/JS tĩnh.
- **Tại sao cần:** Chúng ta cần Node.js để build code, nhưng khi code đã build xong (thành tĩnh), chúng ta **không cần Node.js nữa**.

**Stage 2: Serve (Giai đoạn Chạy thực tế)**
```dockerfile
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
- **Tác dụng:** Docker bỏ hoàn toàn cái máy ảo Node.js nặng nề ở trên đi. Nó tạo một máy ảo mới siêu nhẹ chạy Nginx (Web Server). Tiếp theo, nó **copy** thư mục `build` từ Stage 1 sang Stage 2. Cuối cùng, nó chèn cấu hình `nginx.conf` của ta vào để phục vụ web.
- **Kết quả:** Dung lượng Image cuối cùng rất nhỏ gọn (thường dưới 50MB) và tốc độ tải trang cực nhanh vì Nginx sinh ra để phục vụ file tĩnh.

### 2.2. `nginx.conf` - Điều phối viên giao thông
ReactJS là một **SPA (Single Page Application)**. Nó chỉ có đúng một file `index.html`. Tất cả logic chuyển trang (ví dụ `/user-management`) đều do JavaScript thực hiện trên trình duyệt.

Nếu không có cấu hình này, khi user đang ở trang `/dashboard` và nhấn **F5**, Nginx sẽ vào thư mục tìm file `dashboard.html`. Trả về `404 Not Found` ngay lập tức!

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
- **Tác dụng:** Dòng lệnh trên dặn Nginx: *"Nếu người dùng yêu cầu một đường dẫn bất kỳ, hãy cứ trả về `index.html` và để React tự xử lý tiếp"*. Nhờ đó, tính năng Routing của React sẽ hoạt động hoàn hảo.

### 2.3. `.dockerignore` - Bộ lọc rác
Giống hệt `.gitignore`.

```text
node_modules
build
.git
```
- **Tác dụng:** Khi bạn gõ lệnh `docker build`, Docker sẽ copy toàn bộ thư mục máy bạn vào máy ảo của nó. Thư mục `node_modules` rất nặng (hàng trăm MB). File này chặn Docker copy `node_modules`.
- **Kết quả:** Giúp tăng tốc độ build từ vài phút xuống còn vài giây, và đảm bảo môi trường sạch sẽ (Docker tự tải lại `node_modules` chuẩn Linux bên trong container).

---

## 3. Cách ứng dụng Docker trong vòng đời dự án (Lifecycle)

### Giai đoạn Phát triển (Development)
- Lập trình viên chạy `npm start` trên máy cá nhân để code và xem thay đổi ngay lập tức (Hot-reload). Hiếm khi dùng Docker ở bước này vì code liên tục thay đổi.

### Giai đoạn Kiểm thử (Testing/Staging)
- Leader dùng lệnh `docker build` để đóng gói dự án thành Image.
- Gửi Image này lên Docker Hub hoặc AWS ECR.
- Chạy thử container để QA/Tester kiểm tra. Đảm bảo mọi thứ chạy đúng 100% như môi trường thực tế.

### Giai đoạn Triển khai (Production)
- Server thực tế (VPS, AWS EC2, DigitalOcean) không hề có mã nguồn của bạn. Nó cũng không cài Node.js.
- Server chỉ chạy duy nhất lệnh: `docker run -d -p 80:80 admin-events-fe`.
- Web ngay lập tức online và sẵn sàng phục vụ hàng ngàn người dùng thông qua sức mạnh của Nginx.

Nếu có bản cập nhật mới? Chỉ cần build image mới (Version 2), tắt container cũ và bật container mới. Thời gian gián đoạn website (downtime) chưa tới 1 giây!
