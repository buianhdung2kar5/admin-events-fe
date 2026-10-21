# Contract API backend (events-backend) — dành cho FE

> Nguồn sự thật phía backend: repo `D:\Events\events-backend` (`docs/API_RESPONSE_STANDARD.md`, `docs/CRUD_RULE.md`).
> File này là bản tóm tắt cho FE. **FE không sửa backend** — thiếu API / lệch contract thì ghi vào mục "Chờ backend" cuối file và báo người dùng.
> Cập nhật lần cuối: 2026-10-19 (backend nhánh `feat/package-purchase`).

## 1. Quy ước chung

- Base URL: `http://localhost:8080/api/v1` (mọi path dưới đây đều tương đối với base này).
- Auth: header `Authorization: Bearer <accessToken>`. Access token hết hạn → `POST /auth/refresh`.
- Id luôn là **UUID (string)**. Thời gian luôn là **ISO-8601 UTC** (`Instant`), riêng ngày sinh là `YYYY-MM-DD`.
- Tiền là **số nguyên VND** (JSON number).
- Hành động chuyển trạng thái dùng `POST /{id}/<hành-động>` (publish, unpublish, approve, reject, cancel, revoke, block, unlock…); `PATCH` không dùng.

### Format response

```jsonc
// Thành công (2xx)
{ "success": true, "code": "OK", "message": "Thành công", "data": { ... }, "timestamp": "..." }
// Lỗi (4xx/5xx) — HTTP status là nguồn sự thật, body KHÔNG lặp status code
{ "success": false, "code": "VALIDATION_FAILED", "message": "Dữ liệu đầu vào không hợp lệ",
  "errors": [{ "field": "title", "message": "Tiêu đề sự kiện không được để trống" }],
  "path": "/api/v1/organization/events", "timestamp": "..." }
```

Phân trang (`data` của danh sách):

```jsonc
{ "items": [ ... ], "page": 0, "size": 20, "totalElements": 57, "totalPages": 3 }
```

- `page` bắt đầu từ 0; `size` tối đa 100 (sai → 400, không tự sửa).
- Tạo mới trả `201`; xóa / hủy trả `200` với `data` rỗng (chỉ có `message`).

### Mã lỗi (`code`)

| HTTP | code |
|---|---|
| 400 | `BAD_REQUEST`, `VALIDATION_FAILED` (có `errors[]`), `MALFORMED_REQUEST` |
| 401 | `UNAUTHORIZED` (thiếu/hết hạn token → refresh), `INVALID_CREDENTIALS` (sai email/mật khẩu — KHÔNG refresh), `INVALID_REFRESH_TOKEN` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` (kể cả truy cập dữ liệu của người khác) |
| 405 | `METHOD_NOT_ALLOWED` |
| 409 | `CONFLICT`, `EMAIL_ALREADY_EXISTS`, `CONCURRENT_MODIFICATION` |
| 413 | `PAYLOAD_TOO_LARGE` (file > 25MB) |
| 422 | `BUSINESS_RULE_VIOLATION` (sai trạng thái, vd. publish sự kiện không phải DRAFT) |
| 500 | `INTERNAL_ERROR` |

## 2. Auth (public)

| Method | Path | Body | `data` |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password (≥8), role: "USER" \| "ORGANIZATION" }` | `UserResponse` (201) |
| POST | `/auth/login` | `{ email, password }` | `AuthResponse` |
| POST | `/auth/refresh` | `{ refreshToken }` | `AuthResponse` (token rotation — lưu cả refresh token mới) |
| POST | `/auth/logout` | `{ refreshToken }` (cần Bearer) | — |

- Đăng ký **không** cho chọn `ADMIN` (gửi lên → 400). Tài khoản ADMIN tạo nội bộ.
- `AuthResponse`: `{ userId, email, role: "USER"|"ORGANIZATION"|"ADMIN", accessToken, refreshToken, accessTokenExpiredAt }`
- `UserResponse`: `{ id, fullName, phoneNumber, role, email, currentCoin, status: "ACTIVE"|"BLOCKED" }`
- JWT claims: `sub` = userId, `userId`, `email`, `role`.

## 3. Danh mục (public, không cần token)

| Method | Path | `data` |
|---|---|---|
| GET | `/public/categories?parentCategoryId&search` | `CategoryResponse[]` |
| GET | `/public/categories/{id}` | `CategoryResponse` |
| GET | `/public/events/{eventId}/categories` | `CategoryResponse[]` (sự kiện chưa PUBLISHED → 404) |

- `CategoryResponse`: `{ categoryId, name, parentCategoryId, createdAt, updatedAt }`
- **`GET /public/categories/tree` đã bỏ (2026-10-19, path không RESTful).** Lấy toàn bộ bằng `GET /public/categories` (không truyền tham số) → danh sách phẳng; `parentCategoryId: null` là gốc. **FE tự dựng cây** bằng cách nhóm theo `parentCategoryId`. `CategoryTreeResponse` không còn.
- Không có field `type` / `options` — cây cha-con thay thế.

### 3b. Sự kiện public (không cần token)

| Method | Path | `data` |
|---|---|---|
| GET | `/public/events?keyword&categoryId&page&size` | `PageResponse<PublicEventSummaryResponse>` |
| GET | `/public/events/{eventId}` | `PublicEventResponse` |

- Chỉ trả sự kiện **PUBLISHED**, sắp theo `startTime` mới nhất trước. Sự kiện không tồn tại hoặc chưa PUBLISHED → **404** `RESOURCE_NOT_FOUND`. Áp dụng cho cả `/public/events/{eventId}/categories`.
- **User đã đăng nhập cũng dùng đúng các API này** (không có `/users/events`); gửi kèm token hay không kết quả như nhau. Trạng thái riêng của user ("đã đăng ký / đã check-in") **không** có trong response public — sẽ có API riêng `GET /users/me/registrations?eventIds=…` khi làm đăng ký sự kiện, FE tự ghép.
- `keyword` (tùy chọn, tối đa 100 ký tự): tìm gần đúng theo **tiêu đề**, không phân biệt hoa thường. `%` / `_` được hiểu là ký tự thường.
- `categoryId` (tùy chọn, UUID): sự kiện gắn danh mục này **hoặc danh mục con** của nó. Truyền id danh mục cha thì lấy được cả sự kiện thuộc các con.
- `page` ≥ 0 (mặc định 0), `size` 1..100 (mặc định 20). Sai tham số (kể cả `categoryId` không phải UUID) → 400.
- `PublicEventSummaryResponse`: `{ id, organizerId, organizerName, venueId, venueName, venueAddress, bannerUrl, eventType, title, price, startTime, endTime, registerOpenTime, registerCloseTime, maxParticipant }`. `venue*` có thể null.
- `PublicEventResponse`: `{ id, eventType, title, description, content, bannerUrl, price, startTime, endTime, registerOpenTime, registerCloseTime, recruitmentType, maxParticipant, organizer: { id, name, logoUrl }, venue: { id, name, address, latitude, longitude } | null }`. `content` là HTML đã sanitize.
- Không có trong response: `status` (luôn là PUBLISHED), `roleConfigs`, `createdAt`/`updatedAt`. Chưa có: danh mục kèm theo (gọi `/public/events/{id}/categories`), số người đã đăng ký, sự kiện nổi bật.

## 4. File (cần đăng nhập)

| Method | Path | Ghi chú |
|---|---|---|
| POST | `/files` | multipart `file`; query `folder` (mặc định `uncategorized`), `referenceType` (`USER_AVATAR`\|`EVENT_BANNER`\|`EVENT_GALLERY`\|`VERIFICATION_DOC`\|`SYSTEM`), `referenceId` (UUID) → `MediaResponse` (201) |
| DELETE | `/files/{mediaId}` | chỉ xóa được file **do chính mình upload** (file người khác / không có → 404); xóa mềm bản ghi + xóa trên Cloudinary |

`MediaResponse`: `{ mediaId, fileUrl, publicId, contentType, fileSize, folder, fileName }` — giữ `mediaId` nếu cần xóa file sau. **Đổi 2026-10-19:** `POST /files/upload` → `POST /files`; `DELETE /files?id={publicId}` → `DELETE /files/{mediaId}`. Quy ước: upload trước, gửi `fileUrl` vào các field URL (banner, avatar, logo).

## 5. Hồ sơ

| Method | Path | Ai | Body / `data` |
|---|---|---|---|
| GET | `/users/me/profile` | USER | `UserProfileResponse` |
| PUT | `/users/me/profile` | USER | `UserProfileUpsertRequest` → `UserProfileResponse` |
| GET | `/organization/profile/me` | ORGANIZATION | `OrganizationProfileResponse` |
| PUT | `/organization/profile/me` | ORGANIZATION | `OrganizationProfileUpsertRequest` → `OrganizationProfileResponse` |

- `UserProfileResponse`: `{ userId, email, fullName, gender, birthOfDate (YYYY-MM-DD), studentCode, university, faculty, major, avatarUrl }` — **không** có coin / SĐT / role / status.
- `UserProfileUpsertRequest`: các field trên trừ `userId`, `email`; `fullName ≤255`, `gender ≤10`, `birthOfDate` phải ở quá khứ, `avatarUrl ≤500`.
- `OrganizationProfileResponse`: `{ userId, email, organizationName, organizationType, address, logoUrl, description, verificationStatus: "PENDING"|"VERIFIED"|"REJECTED", verifiedTime }`
- `OrganizationProfileUpsertRequest`: `{ organizationName (bắt buộc), organizationType?, address?, logoUrl?, description? }`

## 6. Tài liệu xác minh tổ chức

| Method | Path | Ai | Ghi chú |
|---|---|---|---|
| POST | `/organization/verification-documents` | ORGANIZATION | multipart `file`, `documentType`, `originalFileName?` → 201 |
| GET | `/organization/verification-documents` | ORGANIZATION | tài liệu của chính mình (List, không phân trang) |
| GET | `/admin/verification-documents?status=PENDING` | ADMIN | tài liệu theo trạng thái (`PENDING`\|`APPROVED`\|`REJECTED`, **bắt buộc**; List, không phân trang). Thay cho `/pending` (bỏ 2026-10-19) |
| GET | `/admin/verification-documents/{id}` | ADMIN | |
| POST | `/admin/verification-documents/{id}/approve` | ADMIN | PENDING → APPROVED |
| POST | `/admin/verification-documents/{id}/reject` | ADMIN | body `{ note }` (bắt buộc, ≤1000) → REJECTED |

`VerificationDocumentResponse`: `{ verificationDocumentId, userId, fileId, fileUrl, documentType, originalFileName, status: "PENDING"|"APPROVED"|"REJECTED", note, createdAt }` — **không** có tên/avatar người nộp.
`documentType`: `BUSINESS_LICENSE` | `UNIVERSITY_DECISION` | `CLUB_CERTIFICATE` | `TAX_CODE` | `OTHER`. Không có API xóa tài liệu.

## 7. Sự kiện của tổ chức (ORGANIZATION)

| Method | Path | `data` |
|---|---|---|
| GET | `/organization/events?page&size` | `PageResponse<EventSummaryResponse>` (của chính tổ chức, mọi trạng thái) |
| GET | `/organization/events/{id}` | `EventResponse` (sự kiện tổ chức khác → 404) |
| POST | `/organization/events` | `EventResponse` (201, luôn DRAFT) |
| PUT | `/organization/events/{id}` | `EventResponse` (không đổi trạng thái) |
| POST | `/organization/events/{id}/publish` | `EventResponse` (DRAFT → PUBLISHED, ghi `publishedAt`). **Tốn 1 lượt `EVENT_PUBLISH`** của tháng (§8b); hết lượt → 422 |
| POST | `/organization/events/{id}/unpublish` | `EventResponse` (**mới 2026-10-20**: ẩn PUBLISHED → DRAFT, chỉ khi sự kiện chưa bắt đầu; không trả lượt) |
| DELETE | `/organization/events/{id}` | hủy sự kiện (→ CANCELLED, không xóa bản ghi) |
| PUT | `/organization/events/{id}/categories` | body `{ categoryIds: UUID[] }` (**không rỗng**, thay toàn bộ danh sách cũ; đổi từ POST 2026-10-19) → `{ eventId, categories: CategoryResponse[] }` |

- `EventSummaryResponse`: `{ id, userId, venueId, bannerUrl, eventType, title, price, startTime, endTime, registerOpenTime, registerCloseTime, status, maxParticipant, createdAt, updatedAt }`
- `EventResponse` = Summary + `{ description, content (HTML đã lọc), recruitmentType, roleConfigs (chuỗi JSON), publishedAt (lần publish gần nhất, null nếu chưa từng) }`
- `EventUpsertRequest` (**không có `status`**): `title` (bắt buộc, ≤255), `description` (≤5000), `content` (≤100000), `eventType` (bắt buộc), `venueId?`, `bannerUrl?` (phải `https://`, ≤500), `price?` (≥0), `startTime` (bắt buộc, ở tương lai), `endTime` (bắt buộc), `registerOpenTime?`, `registerCloseTime?`, `recruitmentType?`, `maxParticipant?` (>0), `roleConfigs?` (chuỗi JSON hợp lệ, ≤10000).
- Enum: `eventType` = `ATTENDEE` | `CTV_RECRUITMENT` | `HYBRID`; `status` = `DRAFT` | `PUBLISHED` | `CLOSED` | `CANCELLED` | `LOCKED`; `recruitmentType` = `OPEN` | `CLOSED` | `FULLED`.

## 8. Gói ưu đãi

Người dùng / tổ chức (`packages:read`, `finance:transaction`):

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/packages?page&size` | gói PUBLISHED phù hợp với role (`useFor`) |
| GET | `/packages/{id}` | |
| POST | `/packages/{id}/purchases` | header **`Idempotency-Key`** (bắt buộc, mỗi lần bấm mua 1 key) → `PackageBillResponse` (201). **Gói này đang còn hiệu lực → 409** (không cộng dồn, từ 2026-10-20) |
| GET | `/me/packages?status&page&size` | `PageResponse<UserPackageResponse>` |
| GET | `/me/packages/{userPackageId}` | `PackageBillResponse` |

Admin:

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/admin/packages?status&useFor&page&size` | mọi trạng thái |
| GET | `/admin/packages/{id}` | |
| POST | `/admin/packages` | `PackageUpsertRequest` → 201, luôn DRAFT. `config` sai permission theo `useFor` → 422 |
| PUT | `/admin/packages/{id}` | người đã mua không bị ảnh hưởng; `config` thay toàn bộ (gửi null = bỏ quyền lợi) |
| POST | `/admin/packages/{id}/publish` | DRAFT → PUBLISHED |
| POST | `/admin/packages/{id}/unpublish` | PUBLISHED → DRAFT (gỡ bán; người đã mua dùng tiếp tới hết hạn). **Thay `/hide` từ 2026-10-20** |
| DELETE | `/admin/packages/{id}` | xóa mềm; gói PUBLISHED phải gỡ bán trước |

- `PackageResponse`: `{ id, name, description, price, durationDays, discount, sortOrder, tag, useFor: "USER"|"ORGANIZATION"|"ALL", config: PackageConfig | null, status: "DRAFT"|"PUBLISHED" (bỏ HIDDEN từ 2026-10-20), createdAt, updatedAt }`
- `PackageConfig` (quyền lợi theo lượt, key = action): `{ "EVENT_PUBLISH"?: { monthlyQuota }, "EVENT_FEATURE"?: { monthlyQuota, placement, durationDays } }` — ví dụ `{"EVENT_PUBLISH":{"monthlyQuota":30},"EVENT_FEATURE":{"monthlyQuota":30,"placement":"HOME_TOP","durationDays":10}}`. `EVENT_PUBLISH`/`EVENT_FEATURE` chỉ dành cho ORGANIZATION → gói `useFor` USER/ALL có 2 action này bị 422.
- `PackageUpsertRequest`: `name` (bắt buộc, ≤255), `description?` (≤2000), `price` (bắt buộc, số nguyên ≥0), `durationDays` (bắt buộc, ≥1), `discount?`, `sortOrder?` (≥0), `tag?` (≤50), `useFor` (bắt buộc), `config?` (`PackageConfig`: `monthlyQuota` 1..100000; `placement` + `durationDays` 1..365 chỉ cho `EVENT_FEATURE`).
- `PackageBillResponse`: `{ userPackage: UserPackageResponse, payment: PaymentResponse | null }` (`payment` null với gói 0đ — ACTIVE ngay).
- `UserPackageResponse`: `{ id, packageId, packageName, price, durationDays, config (chụp lúc mua), startAt, endAt, status, effective, revokedAt, revokedReason, refundedAt, createdAt }`; `status` = `PENDING_PAYMENT` | `ACTIVE` | `EXPIRED` | `REVOKED` | `CANCELLED`. **Không cộng dồn** (2026-10-20): gói đang hiệu lực thì không mua lại được (409), hiệu lực luôn tính từ lúc mua / lúc tiền về.
- `PaymentResponse`: `{ transactionId, paymentCode, finalAmount, paymentUrl (ảnh QR chuyển khoản), status: "PENDING"|"SUCCESS"|"FAILED", expiresAt (giữ chỗ 15 phút), paidAt, failureReason: "EXPIRED"|"AMOUNT_MISMATCH"|null, receivedAmount }`
- Thanh toán qua chuyển khoản SePay: hiển thị QR `paymentUrl` + `paymentCode`, poll `GET /me/packages/{id}` tới khi `payment.status` đổi.

## 8b. Quyền lợi theo lượt (2026-10-21 — docs/BENEFIT_BUSINESS.md ở backend)

Lượt tính theo **tháng dương lịch, giờ VN**: hạn mức = miễn phí theo role + Σ `monthlyQuota` của các gói **đang hiệu lực**. Sang tháng mới tự làm mới.

| Action | Ai dùng | Miễn phí / tháng | Tốn lượt khi |
|---|---|---|---|
| `EVENT_PUBLISH` | ORGANIZATION | 20 | **mỗi lần** `POST /organization/events/{id}/publish` (kể cả publish lại sau khi ẩn). Ẩn / hủy **không** trả lượt |
| `EVENT_FEATURE` | ORGANIZATION | 0 | gửi đơn làm nổi bật. Admin từ chối đơn PENDING / Org hủy đơn PENDING → **trả lượt**. Admin gỡ sớm / thu hồi gói → **không** trả |

| Method | Path | Quyền | `data` |
|---|---|---|---|
| GET | `/me/benefits` | `packages:read` (USER, ORG) | `MyBenefitsResponse` |

- `MyBenefitsResponse`: `{ period: "2026-10", periodEnd (Instant, đầu tháng sau giờ VN), benefits: BenefitUsageResponse[] }` — chỉ các action role có quyền (USER hiện là mảng rỗng).
- `BenefitUsageResponse`: `{ action, freeLimit, limit, used, remaining, sources: BenefitSourceResponse[] }`
- `BenefitSourceResponse`: `{ userPackageId, packageName, endAt, monthlyQuota, placement?, durationDays? }` (`placement`/`durationDays` chỉ có với `EVENT_FEATURE`; dùng `userPackageId` khi gửi đơn).
- Hết lượt → 422 `BUSINESS_RULE_VIOLATION`, message vd. "Đã dùng hết 20 lượt đăng sự kiện tháng này. Mua gói để đăng thêm".

## 8c. Sự kiện nổi bật (featured events — "ghim")

Một bản ghi `FeaturedEvent` đi trọn vòng đời: `PENDING` (đơn của tổ chức) → `APPROVED` (đang/sẽ hiển thị) | `REJECTED` (từ chối / gỡ sớm / gói bị thu hồi — luôn có `rejectReason`) | `CANCELLED` (tổ chức tự hủy). Vị trí + số ngày do **gói** quy định; khung giờ tính **lúc Admin duyệt** (`startDate` = lúc duyệt, `endDate` = startDate + `durationDays`, cắt theo giờ kết thúc sự kiện); `priority` do **Admin** đặt.

Tổ chức (`featured:request`, chỉ ORGANIZATION):

| Method | Path | Ghi chú |
|---|---|---|
| POST | `/organization/featured-events` | body `{ eventId, userPackageId, address? (≤255), note? (≤1000) }` → 201 `FeaturedEventResponse` (`PENDING`, trừ 1 lượt). Sự kiện không PUBLISHED / đã kết thúc, gói hết hạn / bị thu hồi / không có `EVENT_FEATURE`, hết lượt → 422; tổ chức chưa xác minh → 403; sự kiện đang có đơn chờ hoặc đang nổi bật → 409 |
| GET | `/organization/featured-events?status&page&size` | của chính mình, mới nhất trước |
| GET | `/organization/featured-events/{id}` | của tổ chức khác → 404 |
| POST | `/organization/featured-events/{id}/cancel` | chỉ PENDING → `CANCELLED`, trả lượt |

Admin (`featured:manage`):

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/admin/featured-events?status&placement&page&size` | mọi tổ chức, cũ nhất trước — `status=PENDING` = danh sách đơn chờ duyệt |
| GET | `/admin/featured-events/{id}` | |
| POST | `/admin/featured-events/{id}/approve` | body `{ priority (bắt buộc 1..1000), address? }` → `APPROVED`, hiển thị ngay. Sự kiện hủy / khóa / đã kết thúc → 422 |
| POST | `/admin/featured-events/{id}/reject` | body `{ reason }` (bắt buộc, ≤500). Đơn PENDING → `REJECTED` + trả lượt; bản ghi APPROVED → **gỡ sớm** (`REJECTED`, `endDate` = lúc gỡ, không trả lượt) |
| POST | `/admin/featured-events` | gắn trực tiếp (không cần đơn, không trừ lượt): `{ eventId, placement, priority, durationDays (1..365), address? }` → 201, `APPROVED` từ lúc tạo |
| PUT | `/admin/featured-events/{id}` | chỉ APPROVED: `{ priority, endDate (sau startDate), address? }` |

Public (không cần token):

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/public/featured-events?placement&page&size` | APPROVED, sự kiện PUBLISHED, đang trong `[startDate, endDate)`; sắp `priority` (1 trước) rồi `startDate` |
| GET | `/public/featured-events/{id}` | không đang hiển thị → 404 |

- `placement` = `HOME_TOP` (đầu trang chủ) — sẽ thêm giá trị sau.
- `FeaturedEventResponse`: `{ id, userId, eventId, userPackageId (null = Admin gắn), placement, durationDays, priority, startDate, endDate (3 field null khi PENDING), address, note, status, approvedAt, rejectReason, rejectedAt, createdAt, updatedAt }`
- `PublicFeaturedEventResponse`: `{ id, placement, priority, startDate, endDate, address, event: PublicEventSummaryResponse }` (chi tiết sự kiện: `GET /public/events/{event.id}`).
- Sự kiện đang nổi bật mà tổ chức ẩn về DRAFT → biến mất khỏi public, khung giờ vẫn trôi.

## 8d. Thu hồi gói (ADMIN)

| Method | Path | Ghi chú |
|---|---|---|
| POST | `/admin/user-packages/{userPackageId}/revoke` | `packages:manage`, body `{ reason }` (bắt buộc, ≤500) → `UserPackageResponse` (`REVOKED`). Chỉ lần mua ACTIVE (khác → 422) |

Thu hồi = mọi quyền lợi của **lần mua đó** hết ngay: hạn mức giảm; sự kiện nổi bật còn mở của lần mua (PENDING / APPROVED chưa hết hạn) → `REJECTED` "Gói đã bị thu hồi" (đang hiển thị thì `endDate` = lúc thu hồi), **không** trả lượt. Gói gốc và người khác mua cùng gói không bị ảnh hưởng. Sự kiện đã đăng vẫn giữ.

## 9. Quản lý tài khoản (ADMIN)

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/admin/accounts?role&status&keyword&page&size` | `PageResponse<AccountSummaryResponse>`, mới nhất trước, `keyword` tìm theo email/SĐT; không sort tùy chọn |
| GET | `/admin/accounts/{id}` | `AccountDetailResponse` |
| PUT | `/admin/accounts/{id}/profile` | `{ userProfile?: UserProfileUpsertRequest, organizationProfile?: OrganizationProfileUpsertRequest }` (theo role) |
| POST | `/admin/accounts/{id}/block` | thu hồi mọi phiên đăng nhập; không áp dụng cho chính mình |
| POST | `/admin/accounts/{id}/unlock` | |
| DELETE | `/admin/accounts/{id}` | xóa mềm tài khoản + hồ sơ |

- `AccountSummaryResponse`: `{ id, email, phoneNumber, role, status, displayName (fullName/organizationName), avatarUrl (avatar/logo), createdAt }`
- `AccountDetailResponse`: `{ id, email, phoneNumber, role, status, currentCoin, createdAt, updatedAt, userProfile, organizationProfile }`
- Không có API khóa hàng loạt → gọi `block`/`unlock` từng id.

## 10. Danh mục (ADMIN — ghi)

| Method | Path | Body |
|---|---|---|
| POST | `/admin/categories` | `{ name (≤100), parentCategoryId? }` → 201 |
| PUT | `/admin/categories/{id}` | `{ name, parentCategoryId? }` → cập nhật đúng bản ghi, `categoryId` giữ nguyên |
| DELETE | `/admin/categories/{id}` | từng id; còn danh mục con → 400 `BAD_REQUEST`; đang gán cho sự kiện → 409 `CONFLICT` |

- Cây không giới hạn số tầng; `parentCategoryId: null` = danh mục gốc. Đổi cha = `PUT` với `parentCategoryId` mới.
- `PUT` chọn cha là chính nó **hoặc con/cháu của nó** → 400 `BAD_REQUEST` ("Không thể chọn danh mục con/cháu làm danh mục cha"). FE vẫn nên loại con cháu khỏi ô chọn cha.
- `DELETE` là xóa mềm: danh mục biến mất khỏi mọi API đọc. Muốn xóa danh mục đang gán thì tổ chức phải gỡ khỏi sự kiện trước (backend không tự gỡ).
- Đã sửa 2026-10-19 (trên nhánh backend `feat/package-purchase`, chưa merge/deploy): PUT tạo bản trùng, chưa chặn vòng lặp, DELETE không kiểm tra sự kiện. Bản ghi trùng tạo ra trước khi sửa không tự mất — xóa tay nếu còn.

## 11. Chờ backend (CHƯA có API — FE giữ path cũ, sẽ 404)

- Sự kiện public: nổi bật (`/events/featured`), đăng ký tham gia (`/registrations`). Danh sách / chi tiết đã có, xem mục 3b.
- Sự kiện cho Admin (`/admin/events`), sự kiện nổi bật, phản hồi, điểm danh, tuyển CTV, tin tức, vé, xếp hạng, portfolio, báo cáo vi phạm, giao dịch tài chính, nhật ký hoạt động.
- `/users/me` (coin, SĐT…), sự kiện đã tham gia của user.
- Admin: tài liệu xác minh theo tổ chức, danh sách gói người dùng đã mua / thu hồi / hoàn tiền (Phase 6), điều chỉnh coin.
- CORS ở tầng Spring Security chưa bật → FE chạy khác origin phải đi qua proxy.
- Lưu token qua cookie httpOnly (hiện backend trả token trong body).
