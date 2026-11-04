# Bàn giao FE Admin (admin-events)

> Viết ngày 2026-10-19 khi chuyển phần FE sang session riêng. Contract backend: [`BACKEND_API_CONTRACT.md`](BACKEND_API_CONTRACT.md).

## Phạm vi
- Repo này là trang quản trị cho **ADMIN**. FE User/Org nằm ở `D:\Events\refactor_events`.
- **Không sửa backend.** Thiếu API / lệch contract → ghi vào mục 11 của contract và báo người dùng.

## Đã làm (CHƯA commit, CHƯA test giao diện với backend thật)
- **Bỏ Firebase**, đăng nhập JWT của backend: `services/authService.ts` (`loginApi` — role ≠ ADMIN thì thu hồi token + báo lỗi; `restoreSession` khi F5 gọi `GET /admin/accounts/{id}`; `logout`). Token lưu `localStorage` qua `services/session.ts`. Đã xóa `src/firebase.ts` (package `firebase` còn trong package.json).
- `services/apiClient.ts`: interceptor **trả thẳng `data`**; lỗi → `ApiError` (`services/apiError.ts`); 401 → `/auth/refresh` (gộp 1 lần) → thất bại thì về `/login`. Dùng `http.get/post/put/patch/delete<T>`.
- Tài khoản: `services/user-management/AccountApi.ts` (thay `UserApi.ts` đã xóa) — list/detail/block/unlock (+ `blockMany`/`unlockMany` gọi từng id), delete. Status chỉ còn `ACTIVE` | `BLOCKED`. Trang chi tiết User/Org dùng `AccountDetail`; tab chưa có API hiện ghi chú.
- Duyệt hồ sơ xác minh (2026-10-22, §6): duyệt **cả hồ sơ** thay vì từng tài liệu. `DocumentApi.ts` — `list({status?,page,size})` → `PageResponse<VerificationProfile>`, `approve`, `reject(id, reason)` (đổi từ `note`), `count(status)` (totalElements). `DocList`: tab Chờ duyệt (cũ nhất trước) / Đã duyệt / Từ chối / Tất cả, phân trang server, cột "Đủ / Thiếu giấy tờ bắt buộc" theo `organizationType` (`REQUIRED_DOCUMENTS`). `DocDetailModal`: checklist giấy tờ, danh sách file (link https + xem trước ảnh), Duyệt / Từ chối (zod, ≤1000). Thống kê + thẻ Dashboard đếm bằng `count`. Tổ chức: thêm `UNVERIFIED`, `organizationType` = `STUDENT_ORG|COMPANY|NGO`.
- Danh mục (cập nhật 2026-10-19): hiển thị **cây nhiều tầng** (`CategoryList` + `CategoryTreeRow`), mở/thu gọn từng nhánh, tìm kiếm giữ nhánh cha, thống kê từ dữ liệu thật. Mỗi nút: thêm danh mục con / sửa (đổi tên + đổi cha) / xóa (khóa khi còn con; 409 — đang gán cho sự kiện — hiện giải thích và khóa nút Xóa). Form validate zod@3 (`categoryForm.schema.ts`), ô chọn cha loại chính nó + con cháu (backend cũng trả 400 nếu vòng lặp — từ nhánh backend `feat/package-purchase`, chưa merge). Đọc `GET /public/categories` (phẳng) rồi dựng cây bằng `buildTree` — backend đã bỏ `/public/categories/tree`. Hàm cây thuần ở `data/categoryTree.ts`, type ở `data/category.types.ts`. Đã bỏ khái niệm "option", `CategoryOptionsPanel`, phân trang và xóa hàng loạt. `EventList` vẫn đọc `category.type` kiểu cũ — sửa khi có API sự kiện cho admin.
- Gói ưu đãi: bỏ mock; `services/finance/PackageApi.ts`, hook `feature/financial-management/package/hooks/useAdminPackages.ts`, schema zod@3 `packageForm.schema.ts`, component `PackageList` / `PackageToolbar` / `PackageCard` / `PackageFormModal`. Tab "User đã mua" chờ API (Phase 6).
  - (2026-10-22) Vòng đời DRAFT ⇄ PUBLISHED: nút "Mở bán" (`/publish`) / "Gỡ gói" (`/unpublish`), bỏ `HIDDEN`. Form có phần **Quyền lợi theo lượt** (`PackageBenefitFields`): `EVENT_PUBLISH { monthlyQuota }`, `EVENT_FEATURE { monthlyQuota, placement, durationDays }` — chỉ hiện khi `useFor = ORGANIZATION`, loại khác gửi `config: null`. Card tóm tắt quyền lợi (`describePackageConfig`).
- Sự kiện nổi bật (2026-10-22, §8c): `services/events-management/FeaturedEventsApi.ts` + type `types/featured.types.ts`, hook `featured/hooks/useFeaturedEvents.ts`. `FeaturedList` có tab Tất cả / Chờ duyệt / Đã duyệt / Tổ chức xin gỡ / Từ chối / Đã gỡ / Tổ chức hủy (mới nhất trước, phân trang server; filter1 của GroupFilter = vị trí). Nút theo trạng thái (`featuredDisplay.ts`): Duyệt + Từ chối (PENDING), Sửa + Gỡ ghim (APPROVED còn hạn), Thu hồi gói (`userPackageStatus = ACTIVE`, gọi `services/finance/UserPackageApi.ts`). APPROVED có `endDate ≤ now` hiển thị "Hết hạn". Chặn sự kiện không PUBLISHED (khóa Duyệt/Sửa; backend cũng trả 422). Gắn trực tiếp: `FeaturedFormModal` chọn sự kiện qua `/public/events?keyword`. Đã xóa `FeaturedMockData`.
- Báo cáo vi phạm (nối API 2026-10-31, §14): `services/user-management/ReportsApi.ts` gọi `/admin/reports`, đã xóa mock. Chỉ có 3 trạng thái PENDING / RESOLVED / REJECTED, không có nhận xử lý hay hình thức xử phạt. Danh sách `ReportList` (lọc + phân trang server, `keyword` chỉ tìm tiêu đề và tên đối tượng), chi tiết `/user-management/report/:id` (`pages/user-management/report-detail`): minh chứng có lightbox; `ReportHandleForm` giải quyết (phản hồi bắt buộc, mức độ tùy chọn) hoặc bác bỏ; `ReportTargetCard` có nút khóa tài khoản riêng, gọi `AccountApi.block(target.accountUserId)` và không đổi trạng thái đơn. Số "Báo cáo chưa xử lý" ở Dashboard lấy từ `ReportsApi.count("PENDING")`. **Chưa test luồng thật**: cần chạy `db/manual/2026-11-01_reports.sql` ở backend, khởi động lại và có đơn tạo qua `/me/reports`.
- Portfolio và sửa hồ sơ (§9): trang chi tiết người dùng có tab Portfolio (`UserPortfolioTab`, gọi `GET /admin/accounts/{id}/portfolios`, Admin chỉ xem). (2026-11-04) Tab chỉ hiện thẻ tóm tắt (tiêu đề, badge publish, mô tả 2 dòng, số sự kiện); bấm thẻ mở `PortfolioDetailModal` gọi `GET /admin/portfolios/{id}`, hiển thị dạng giấy chứng nhận `PortfolioPaperSheet` (chép theo `PortfolioSheetUI` + `PaperSheet` bên FE User; email chủ portfolio lấy từ tài khoản vì `owner` không có email). 404 hiện "Không tìm thấy portfolio", đóng modal thì tải lại danh sách. Badge và nhãn vai trò dùng chung ở `portfolioDisplay.tsx`. `UserProfileForm` và `OrganizationProfileForm` gọi `AccountApi.updateProfile`. Backend bỏ qua trường `null`, nên body lấy giá trị từ response rồi ghi đè phần vừa sửa; ô chữ xóa trắng gửi chuỗi rỗng; trường không sửa được hiện dạng disable. Giới tính chuẩn `MALE | FEMALE | OTHER`, nhãn dịch ở `profileForm.schema.ts` (đọc được cả `NAM`, `NU` cũ).
- Tin tức (2026-11-05, §15): `services/news-management/NewsApi.ts` gọi `/admin/news` (đã xóa `NewApi.ts`, `NewsFormModal`, `NewsDetailModal`, `NewsMockData`, trang `news-detail`). Khi API trả 404 / 5xx / mất kết nối, danh sách hiện **tin mẫu** (`newsMock.ts`, id `mock-…`) kèm cảnh báo vàng, thao tác ghi bị khóa (người dùng yêu cầu). `NewsList`: thẻ thống kê thật, tab Tất cả/Nháp/Đã đăng, tìm `keyword`, lọc `tag` (ô nhập tự do), phân trang server; Đăng / Gỡ đăng / Xóa (chỉ DRAFT, có xác nhận). Trang tạo/sửa `/content-management/news/new` và `/:newsId` (`pages/content-management/news-edit`, `NewsForm`): slug sinh ngầm từ tiêu đề (`utils/slug.ts`), **tin PUBLISHED khóa ô tiêu đề và gửi lại slug cũ** (chờ backend chặn, mục 11); PUT gửi đủ trường, ô trống → `null`. Editor rich text `NewsEditor` (TipTap 2.27.3, chỉ sinh thẻ trong whitelist OWASP: không `pre`, không `hr`, không video; ảnh upload qua `/files`; link chỉ http/https). Lỗi: 409 `NEWS_SLUG_TAKEN` báo ở ô tiêu đề, 409 `CONCURRENT_MODIFICATION` có nút Tải lại, 400 theo field, 422 hiện message.
- Địa điểm (2026-10-30): đã gỡ tab Địa điểm dùng dữ liệu giả và thư viện leaflet. Admin không quản lý hay tạo địa điểm (do tổ chức tạo), không dùng `/admin/venues`; địa điểm chỉ hiện trong chi tiết sự kiện.
- Upload: `POST /files` → `MediaResult` (= backend `MediaResponse`, có `mediaId`); xóa `DELETE /files/{mediaId}`. News form gửi `banner` (URL) thay `bannerId`.
- Service chưa có backend (Events, Feedback, Attendance, Recruitment, News, Finance, SystemManagement): giữ path, generic `LegacyPage<T>` / `T` (mặc định `unknown`), bỏ `.object` / `statusCode` ở component.
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
