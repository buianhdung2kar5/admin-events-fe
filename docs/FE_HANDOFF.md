# Bàn giao FE Admin (admin-events)

> Viết ngày 2026-10-19 khi chuyển phần FE sang session riêng. Contract backend: [`BACKEND_API_CONTRACT.md`](BACKEND_API_CONTRACT.md).

## Phạm vi
- Repo này là trang quản trị cho **ADMIN**. FE User/Org nằm ở `D:\Events\refactor_events`.
- **Không sửa backend.** Thiếu API / lệch contract → ghi vào mục 11 của contract và báo người dùng.

## Đã làm (CHƯA commit, CHƯA test giao diện với backend thật)
- **Bỏ Firebase**, đăng nhập JWT của backend: `services/authService.ts` (`loginApi` — role ≠ ADMIN thì thu hồi token + báo lỗi; `restoreSession` khi F5 gọi `GET /admin/accounts/{id}`; `logout`). Token lưu `localStorage` qua `services/session.ts`. Đã xóa `src/firebase.ts` (package `firebase` còn trong package.json).
- `services/apiClient.ts`: interceptor **trả thẳng `data`**; lỗi → `ApiError` (`services/apiError.ts`); 401 → `/auth/refresh` (gộp 1 lần) → thất bại thì về `/login`. Dùng `http.get/post/put/patch/delete<T>`.
- Tài khoản: `services/user-management/AccountApi.ts` (thay `UserApi.ts` đã xóa) — list/detail/block/unlock (+ `blockMany`/`unlockMany` gọi từng id), delete. Status chỉ còn `ACTIVE` | `BLOCKED`. Trang chi tiết User/Org dùng `AccountDetail`; tab chưa có API hiện ghi chú.
- Duyệt tài liệu: `services/user-management/DocumentApi.ts` — `GET ?status=PENDING` (thay `/pending`)/detail/approve/**reject** (thật). Phân trang + tìm kiếm ở client. Link file chỉ mở `https`.
- Danh mục (cập nhật 2026-10-19): hiển thị **cây nhiều tầng** (`CategoryList` + `CategoryTreeRow`), mở/thu gọn từng nhánh, tìm kiếm giữ nhánh cha, thống kê từ dữ liệu thật. Mỗi nút: thêm danh mục con / sửa (đổi tên + đổi cha) / xóa (khóa khi còn con; 409 — đang gán cho sự kiện — hiện giải thích và khóa nút Xóa). Form validate zod@3 (`categoryForm.schema.ts`), ô chọn cha loại chính nó + con cháu (backend cũng trả 400 nếu vòng lặp — từ nhánh backend `feat/package-purchase`, chưa merge). Đọc `GET /public/categories` (phẳng) rồi dựng cây bằng `buildTree` — backend đã bỏ `/public/categories/tree`. Hàm cây thuần ở `data/categoryTree.ts`, type ở `data/category.types.ts`. Đã bỏ khái niệm "option", `CategoryOptionsPanel`, phân trang và xóa hàng loạt. `EventList` vẫn đọc `category.type` kiểu cũ — sửa khi có API sự kiện cho admin.
- Gói ưu đãi: bỏ mock; `services/finance/PackageApi.ts`, hook `feature/financial-management/package/hooks/useAdminPackages.ts`, schema zod@3 `packageForm.schema.ts`, component `PackageList` / `PackageToolbar` / `PackageCard` / `PackageFormModal`. Tab "User đã mua" chờ API (Phase 6).
- Upload: `POST /files` → `MediaResult` (= backend `MediaResponse`, có `mediaId`); xóa `DELETE /files/{mediaId}`. News form gửi `banner` (URL) thay `bannerId`.
- Service chưa có backend (Events, Featured, Feedback, Attendance, Recruitment, News, Finance, Reports, SystemManagement): giữ path, generic `LegacyPage<T>` / `T` (mặc định `unknown`), bỏ `.object` / `statusCode` ở component.
- `package.json`: thêm `"proxy": "http://localhost:8080"`, dependency `zod@^3.23.8` (zod 4 cần TS ≥ 5.5, project đang TS 4.9). Tạo `.env.development.local` (gitignored): `REACT_APP_API_URL=/api/v1`.

## Lưu ý kỹ thuật
- `tsc` 4.9 của project **dừng ở lỗi cú pháp trong `node_modules/react-hook-form`** → không type-check được code. Dùng: `npx -y -p typescript@5.4.5 tsc --noEmit -p .`
- `build/` đang được track trong git và người dùng có thay đổi ở đó → build thử ra thư mục khác: `BUILD_PATH=<thư mục tạm> npm run build`.
- Lệnh `start` dùng cổng 3001 (thay đổi có sẵn của người dùng).
- Production: `.env` (`REACT_APP_API_URL`) phải đổi thành `.../api/v1`; backend chưa bật CORS ở Spring Security.

## Kiểm tra lúc bàn giao
- tsc 5.4.5 → 0 lỗi; `npx eslint src` → 0 lỗi, 33 cảnh báo (cũ); build → qua (JS 254 kB gzip).

## Việc tiếp theo gợi ý
1. Chạy backend `:8080` + `npm start`, đăng nhập ADMIN; thử tài khoản USER (phải bị từ chối); test Tài khoản, Duyệt tài liệu, Danh mục, Gói.
2. Sửa form sửa hồ sơ tài khoản (`PUT /admin/accounts/{id}/profile`) — nút "Chỉnh sửa" ở trang chi tiết chưa nối API.
3. Dọn `any` / cảnh báo lint ở các màn hình cũ khi backend có API tương ứng.
4. Commit khi người dùng đồng ý.

## Chạy & kiểm tra
```bash
npm start
npx -y -p typescript@5.4.5 tsc --noEmit -p .
npx eslint src
```
