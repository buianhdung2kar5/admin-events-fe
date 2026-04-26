# Hướng Dẫn Chạy Dự Án Bằng Docker

Tài liệu này hướng dẫn bạn cách khởi chạy và quản trị hệ thống giao diện quản trị viên (Admin Events) cục bộ bằng Docker.

## Yêu cầu trước khi bắt đầu
Đảm bảo bạn đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/). Nếu bạn dùng Windows, hãy đảm bảo tính năng WSL2 đã được kích hoạt.

---

## Bước 1: Build Docker Image

Mở Terminal (Command Prompt, PowerShell, hoặc Git Bash) và điều hướng đến thư mục chứa mã nguồn dự án:

```bash
cd d:\Events\adminevents\admin-events
```

Chạy lệnh sau để build (đóng gói) ứng dụng. Quá trình này sẽ cài đặt Node.js modules, build production và đưa nội dung vào Nginx. Ở lần chạy đầu tiên có thể tốn vài phút.

```bash
docker build -t admin-events-fe .
```

> **Lưu ý:** Dấu `.` ở cuối lệnh rất quan trọng, nó chỉ định thư mục hiện tại làm context cho quá trình build.

---

## Bước 2: Chạy Container

Sau khi lệnh build kết thúc thành công, hãy chạy image đó bằng lệnh sau:

```bash
docker run -d -p 8080:80 --name admin-dashboard admin-events-fe
```

**Giải thích thông số:**
- `-d`: Chạy ngầm container (Detach mode), giúp bạn tiếp tục sử dụng cửa sổ terminal.
- `-p 8080:80`: Ánh xạ cổng (port map). Nginx bên trong container sử dụng cổng `80`. Bạn truy cập nó qua cổng `8080` trên máy tính.
- `--name admin-dashboard`: Đặt tên riêng cho container để dễ dàng quản lý sau này.

---

## Bước 3: Truy cập ứng dụng

Mở trình duyệt web của bạn và truy cập:

👉 [http://localhost:8080](http://localhost:8080)

Nếu bạn cấu hình thành công, giao diện Admin Events sẽ hiện ra. Lỗi `404 Not Found` khi nhấn F5 tải lại trang sẽ không xảy ra nhờ cấu hình `nginx.conf` đã xử lý các file tĩnh và React Router.

---

## Quản lý Container

Trong quá trình phát triển, dưới đây là một số lệnh hữu ích để quản lý Docker container của bạn:

**1. Xem các container đang chạy:**
```bash
docker ps
```

**2. Xem lịch sử log (nếu có lỗi xảy ra):**
```bash
docker logs admin-dashboard
```

**3. Tạm dừng container:**
```bash
docker stop admin-dashboard
```

**4. Khởi động lại container (sau khi đã tắt):**
```bash
docker start admin-dashboard
```

**5. Xóa container cũ (để build/run lại phiên bản mới nhất):**
```bash
docker rm -f admin-dashboard
```

Nếu bạn có chỉnh sửa mã nguồn và muốn cập nhật trên Docker, hãy thực hiện lại **Bước 1** và **Bước 2** (nhớ chạy `docker rm -f admin-dashboard` trước khi khởi chạy lệnh `run` mới).
