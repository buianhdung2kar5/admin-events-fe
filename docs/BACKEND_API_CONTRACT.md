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
| 409 | `CONFLICT`, `EMAIL_ALREADY_EXISTS`, `CONCURRENT_MODIFICATION`, `ALREADY_REGISTERED`, `PENDING_ORDER_EXISTS` (có `data.registrationId`) |
| 413 | `PAYLOAD_TOO_LARGE` (file > 25MB) |
| 422 | `BUSINESS_RULE_VIOLATION` (sai trạng thái, vd. publish sự kiện không phải DRAFT), `REGISTRATION_CLOSED`, `TICKET_SOLD_OUT`, `TICKET_TEMPORARILY_UNAVAILABLE` |
| 500 | `INTERNAL_ERROR` |
| 503 | `SERVICE_BUSY` (2026-10-29: quá đông, chờ khóa DB > 3s — thử lại sau 2–3s, CÙNG Idempotency-Key) |

> 2026-10-29: một số lỗi có thể kèm `data` (vd. `PENDING_ORDER_EXISTS` → `data.registrationId`). FE rẽ nhánh theo `code`, không theo `message`.

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

> **Slug — mới 2026-10-28** (áp dụng cho sự kiện §3b, §7 và bài tuyển §3c, §7c): mỗi bài có thêm field **`slug`**
> (vd. `le-hoi-am-nhac-2026-k3f9x2` = tiêu đề không dấu + 6 ký tự ngẫu nhiên). **Backend tự sinh khi tạo** (request
> KHÔNG gửi slug), **không đổi** khi sửa tiêu đề. Tiêu đề được trùng (2 tổ chức cùng tên vẫn tạo được), slug luôn khác nhau.
> **Chỉ 4 API GET chi tiết đổi sang slug**: `GET /public/events/{slug}`, `GET /public/recruitments/{slug}`,
> `GET /organization/events/{slug}`, `GET /organization/recruitments/{slug}` — gọi bằng id cũ → **404**.
> Mọi API khác (PUT / DELETE / publish / unpublish / vị trí / danh mục / featured…) **vẫn dùng `{id}`** — trang sửa lấy bài
> theo slug rồi dùng `id` trong response để gọi API sửa. Gợi ý route FE: `/event/{slug}`, `/recruitment/{slug}`,
> `/organization/recruitment/update/{slug}`.

| Method | Path | `data` |
|---|---|---|
| GET | `/public/events?keyword&categoryId&page&size` | `PageResponse<PublicEventSummaryResponse>` |
| GET | `/public/events/{slug}` | `PublicEventResponse` — **theo slug (2026-10-28)**, id cũ → 404 |

- Chỉ trả sự kiện **PUBLISHED**, sắp theo `startTime` mới nhất trước. Sự kiện không tồn tại hoặc chưa PUBLISHED → **404** `RESOURCE_NOT_FOUND`. Áp dụng cho cả `/public/events/{eventId}/categories`.
- **User đã đăng nhập cũng dùng đúng các API này** (không có `/users/events`); gửi kèm token hay không kết quả như nhau. Trạng thái riêng của user ("đã đăng ký / đã check-in") **không** có trong response public — sẽ có API riêng `GET /users/me/registrations?eventIds=…` khi làm đăng ký sự kiện, FE tự ghép.
- `keyword` (tùy chọn, tối đa 100 ký tự): tìm gần đúng theo **tiêu đề**, không phân biệt hoa thường. `%` / `_` được hiểu là ký tự thường.
- `categoryId` (tùy chọn, UUID): sự kiện gắn danh mục này **hoặc danh mục con** của nó. Truyền id danh mục cha thì lấy được cả sự kiện thuộc các con.
- `page` ≥ 0 (mặc định 0), `size` 1..100 (mặc định 20). Sai tham số (kể cả `categoryId` không phải UUID) → 400.
- `PublicEventSummaryResponse`: `{ id, slug, organizerId, organizerName, venueId, venueName, venueAddress, bannerUrl, eventType, title, price, startTime, endTime, registerOpenTime, registerCloseTime, maxParticipant }`. `venue*` có thể null. **2026-10-22**: `price` = giá thấp nhất của các loại vé (hiện "Từ …đ"), `maxParticipant` = tổng số vé.
- `PublicEventResponse`: `{ id, slug, eventType, title, description, content, bannerUrl, price, startTime, endTime, registerOpenTime, registerCloseTime, maxParticipant, organizer: { id, name, logoUrl }, venue: { id, name, address, latitude, longitude, capacity, sections: [{ id, name, capacity }] } | null, ticketTypes: [{ id, name, description, price, quantity, remaining, venueSectionId, venueSectionName }] }`. `content` là HTML đã sanitize. **2026-10-22**: thêm `ticketTypes` (theo thứ tự hiển thị, vd. "Hàng A – 500.000đ") và `venue.capacity/sections`; `price` = giá thấp nhất.
- **2026-10-26**: `/public/events` chỉ trả sự kiện thường (`eventType` luôn `ATTENDEE`); bỏ `recruitmentType`. Bài tuyển CTV xem mục 3c.
- Không có trong response: `status` (luôn là PUBLISHED), `roleConfigs`, `createdAt`/`updatedAt`. Chưa có: danh mục kèm theo (gọi `/public/events/{id}/categories`), số người đã đăng ký, sự kiện nổi bật.

### 3c. Bài tuyển CTV public (không cần token) — mới 2026-10-26

| Method | Path | `data` |
|---|---|---|
| GET | `/public/recruitments?keyword&categoryId&page&size` | `PageResponse<PublicRecruitmentSummaryResponse>` |
| GET | `/public/recruitments/{slug}` | `PublicRecruitmentResponse` — **theo slug (2026-10-28)**, id cũ → 404 |

- Chỉ bài tuyển **PUBLISHED**, sắp theo `startTime` mới nhất trước; tham số lọc giống `/public/events` (3b). Bài không tồn tại / chưa PUBLISHED / là sự kiện thường → **404**.
- Bài tuyển và sự kiện **tách API**: `/public/events` chỉ trả sự kiện thường (`ATTENDEE`), `/public/recruitments` chỉ trả bài tuyển. Id bài tuyển gọi vào `/public/events/{id}` → 404 (và ngược lại).
- `PublicRecruitmentSummaryResponse`: `{ id, slug, organizerId, organizerName, venueId, venueName, venueAddress, bannerUrl, title, startTime, endTime, registerOpenTime, registerCloseTime }`. `registerOpenTime` / `registerCloseTime` = thời gian nhận đơn / hạn nộp đơn.
- `PublicRecruitmentResponse`: `{ id, slug, title, description, content, bannerUrl, startTime, endTime, registerOpenTime, registerCloseTime, organizer: { id, name, logoUrl }, venue: (giống PublicEventResponse.venue) | null, categories: CategoryResponse[], positions: Position[], questions: Question[] }`.
  - `Position`: `{ id, title, description, quantity, benefits: string[], requirements: string[], status: OPEN|CLOSED|FULLED, questions: Question[] }` (câu hỏi riêng của vị trí).
  - `Question`: `{ id, content, type: SHORT_TEXT|MULTIPLE_CHOICE|YES_NO, required, options: string[] }` — **không có đáp án đúng** (chỉ tổ chức thấy).
  - `questions` ở cấp bài = câu hỏi chung cho mọi vị trí. Khách xem được câu hỏi trước khi đăng nhập ứng tuyển.
- Ứng tuyển (nộp đơn) **chưa có API** (Phase 2).

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
- `OrganizationProfileResponse`: `{ userId, email, organizationName, organizationType: "STUDENT_ORG"|"COMPANY"|"NGO"|null, address, logoUrl, description, verificationStatus: "UNVERIFIED"|"PENDING"|"VERIFIED"|"REJECTED", verifiedTime }` (**2026-10-22**: thêm `UNVERIFIED` = chưa nộp hồ sơ; `organizationType` thành enum — xem §6)
- `OrganizationProfileUpsertRequest`: `{ organizationName (bắt buộc), organizationType? ("STUDENT_ORG"|"COMPANY"|"NGO" — bắt buộc chọn trước khi nộp hồ sơ xác minh), address?, logoUrl?, description? }`

## 6. Hồ sơ xác minh tổ chức — viết lại 2026-10-22

Tổ chức nộp **1 hồ sơ gồm đủ giấy tờ** một lần; Admin duyệt **cả hồ sơ** → tổ chức `VERIFIED` ngay (không còn duyệt từng tài liệu). Chỉ tổ chức `VERIFIED` mới tạo sự kiện / gửi đơn nổi bật (khác → 403).

Trạng thái tổ chức (`OrganizationProfileResponse.verificationStatus`):
```
UNVERIFIED (mới đăng ký, chưa nộp) ─nộp─► PENDING ─Admin duyệt─► VERIFIED
                                              └─Admin từ chối (lý do)─► REJECTED ─nộp hồ sơ mới─► PENDING
```

Giấy tờ bắt buộc theo `organizationType` (phải chọn ở `PUT /organization/profile/me` trước khi nộp):

| `organizationType` | Bắt buộc (mỗi loại đúng 1 file) | Tùy chọn |
|---|---|---|
| `STUDENT_ORG` (CLB, Đoàn, Hội SV) | `ESTABLISHMENT_DECISION` (quyết định thành lập / văn bản công nhận của trường, Đoàn trường) + `REPRESENTATIVE_ID` (CCCD / thẻ SV người phụ trách) | `AUTHORIZATION_LETTER` (giấy giới thiệu, ≤1), `OTHER` (≤3) |
| `COMPANY` (doanh nghiệp, hộ KD) | `BUSINESS_LICENSE` (GCN đăng ký doanh nghiệp / hộ KD — đã có mã số thuế) + `REPRESENTATIVE_ID` (CCCD người đại diện pháp luật) | `AUTHORIZATION_LETTER` (giấy ủy quyền nếu người nộp không phải đại diện PL), `OTHER` |
| `NGO` (hội, quỹ, phi lợi nhuận) | `ESTABLISHMENT_DECISION` (quyết định thành lập / giấy phép hoạt động) + `REPRESENTATIVE_ID` | `AUTHORIZATION_LETTER`, `OTHER` |

Tối đa 6 file / hồ sơ, 1 file không nộp 2 lần. **Cách nộp**: upload từng file qua `POST /files` (multipart, `referenceType=VERIFICATION_DOC`) → lấy `id`, rồi gửi 1 request nộp hồ sơ.

| Method | Path | Ai | Ghi chú |
|---|---|---|---|
| POST | `/organization/verification-documents` | ORGANIZATION (`verification:submit`) | **JSON** `{ files: [{ documentType, fileId, originalFileName? (≤255) }] }` (1..6) → 201 `VerificationDocumentResponse` (`PENDING`), tổ chức → `PENDING`. Thiếu giấy tờ bắt buộc / chưa chọn `organizationType` / file sai loại hoặc đã thuộc hồ sơ khác → 422 (message nêu loại thiếu); `fileId` không phải của mình → 404; tổ chức đã `VERIFIED` hoặc đang có hồ sơ chờ duyệt → 409 |
| GET | `/organization/verification-documents` | ORGANIZATION | Lịch sử hồ sơ của mình (List, mới nhất trước — phần tử đầu = hồ sơ hiện tại) |
| GET | `/organization/verification-documents/{id}` | ORGANIZATION | của tổ chức khác → 404 |
| GET | `/admin/verification-documents?status&page&size` | ADMIN (`verification:approve`) | `PageResponse`. `status` **tùy chọn** (`PENDING`\|`APPROVED`\|`REJECTED`); `PENDING` = chờ duyệt, cũ nhất trước; còn lại mới nhất trước |
| GET | `/admin/verification-documents/{id}` | ADMIN | |
| POST | `/admin/verification-documents/{id}/approve` | ADMIN | Hồ sơ `PENDING` → `APPROVED`; tổ chức → `VERIFIED` (+ `verifiedTime`). Không PENDING → 422 |
| POST | `/admin/verification-documents/{id}/reject` | ADMIN | body `{ reason }` (bắt buộc, ≤1000; **đổi tên từ `note`**) → hồ sơ + tổ chức `REJECTED` |

`VerificationDocumentResponse`: `{ id, userId, organizationName, organizationEmail, organizationType, files: [{ documentType, fileId, fileUrl, originalFileName }], status: "PENDING"|"APPROVED"|"REJECTED", rejectReason, reviewedAt, createdAt, updatedAt }`.
`documentType`: `ESTABLISHMENT_DECISION` | `BUSINESS_LICENSE` | `REPRESENTATIVE_ID` | `AUTHORIZATION_LETTER` | `OTHER` (**bỏ** `UNIVERSITY_DECISION`, `CLUB_CERTIFICATE`, `TAX_CODE`).
**Đã bỏ**: upload multipart từng tài liệu; duyệt / từ chối từng tài liệu; field `verificationDocumentId` (→ `id`), `fileId`/`fileUrl`/`documentType` ở cấp hồ sơ (→ `files[]`), `note` (→ `rejectReason`). Không có API xóa hồ sơ.

## 7. Sự kiện của tổ chức (ORGANIZATION)

> **Cập nhật 2026-10-22 — địa điểm + loại vé** (backend `docs/VENUE_TICKET_PLAN.md`): sự kiện không còn 1 giá duy nhất mà
> có **danh sách loại vé** (`ticketTypes`); `price` / `maxParticipant` **không gửi lên nữa**, backend tự tính
> (`price` = giá thấp nhất = "giá từ", `maxParticipant` = tổng số vé). Publish cần có **venue** + ≥ 1 loại vé. Venue lấy từ §7b.
> **Cập nhật 2026-10-26**: API này **chỉ còn sự kiện thường** (`ATTENDEE`). Request bỏ `eventType`, `recruitmentType`;
> response bỏ `recruitmentType`. Bài tuyển CTV dùng API riêng §7c.

| Method | Path | `data` |
|---|---|---|
| GET | `/organization/events?page&size` | `PageResponse<EventSummaryResponse>` (của chính tổ chức, mọi trạng thái) |
| GET | `/organization/events/{slug}` | `EventResponse` — **theo slug (2026-10-28)**; sự kiện tổ chức khác / id cũ → 404 |
| POST | `/organization/events` | `EventResponse` (201, luôn DRAFT) |
| PUT | `/organization/events/{id}` | `EventResponse` (không đổi trạng thái) |
| POST | `/organization/events/{id}/publish` | `EventResponse` (DRAFT → PUBLISHED, ghi `publishedAt`). **Tốn 1 lượt `EVENT_PUBLISH`** của tháng (§8b); hết lượt → 422. **Thiếu venue / thiếu loại vé → 422** |
| POST | `/organization/events/{id}/unpublish` | `EventResponse` (**mới 2026-10-20**: ẩn PUBLISHED → DRAFT, chỉ khi sự kiện chưa bắt đầu; không trả lượt) |
| DELETE | `/organization/events/{id}` | hủy sự kiện (→ CANCELLED, không xóa bản ghi) |
| PUT | `/organization/events/{id}/categories` | body `{ categoryIds: UUID[] }` (**không rỗng**, thay toàn bộ danh sách cũ; đổi từ POST 2026-10-19) → `{ eventId, categories: CategoryResponse[] }` |

- `EventSummaryResponse`: `{ id, slug, userId, venueId, venueName, venueAddress, bannerUrl, eventType, title, price, startTime, endTime, registerOpenTime, registerCloseTime, status, maxParticipant, createdAt, updatedAt }` — **mới**: `venueName`, `venueAddress`; `price` = giá thấp nhất ("Từ …đ"), `maxParticipant` = tổng số vé (null nếu chưa có vé).
- `EventResponse` = Summary (không có `venueName/venueAddress`) + `{ description, content (HTML đã lọc), roleConfigs (chuỗi JSON), publishedAt, venue: VenueResponse | null, ticketTypes: EventTicketTypeResponse[] }`.
- `EventTicketTypeResponse`: `{ id, name, description, price, quantity, soldCount, remaining, venueSectionId, venueSectionName }` (`soldCount` = đã bán + đang giữ chỗ chờ thanh toán — có số thật từ 2026-10-29, xem ghi chú cuối file).
- `EventUpsertRequest` (**không có `status`, `price`, `maxParticipant`**): `title` (bắt buộc, ≤255), `description` (≤5000), `content` (≤100000), `venueId?` (id venue **của chính tổ chức**, §7b; khác → 404; bỏ trống = chưa / bỏ địa điểm), `bannerUrl?` (phải `https://`, ≤500), `startTime` (bắt buộc, ở tương lai), `endTime` (bắt buộc), `registerOpenTime?`, `registerCloseTime?`, `roleConfigs?` (chuỗi JSON hợp lệ, ≤10000), `ticketTypes?` (≤20).
- `ticketTypes[]`: `{ id?, name (bắt buộc, ≤100), description? (≤500), price (bắt buộc, số nguyên ≥0, 0 = miễn phí), quantity (bắt buộc, >0), venueSectionId? }`.
  **PUT gửi ĐỦ danh sách**: phần tử có `id` → sửa loại vé đó, không `id` → thêm, loại vé không còn trong danh sách → xóa. Gửi `ticketTypes` rỗng / bỏ trống = xóa hết.
- Lỗi 422 (`BUSINESS_RULE_VIOLATION`, message nêu rõ):
  - tên loại vé trùng;
  - `venueSectionId` không thuộc venue đang chọn — message liệt kê đủ các loại vé sai (vd. khi đổi venue): *"Địa điểm hiện tại không có khu vực cho: Hàng A, Hàng B. Chọn lại khu vực hoặc bỏ khu vực của các loại vé này"* → **không có gì bị lưu**;
  - tổng vé của các loại cùng khu > sức chứa khu; tổng vé > sức chứa venue;
  - sự kiện đang PUBLISHED mà bỏ venue / bỏ hết loại vé;
  - loại vé đã có người mua: không xóa, không đổi giá, không giảm dưới số đã bán.
- **Sự kiện cũ**: backend đã/ sẽ tạo sẵn 1 loại vé "Vé thường" (giá + số lượng cũ). 2 sự kiện đang PUBLISHED chưa có venue vẫn hiển thị, nhưng **lần sửa tới phải chọn venue**.
- Enum: `eventType` = `ATTENDEE` | `CTV_RECRUITMENT` (**bỏ `HYBRID` 2026-10-26**; API này luôn `ATTENDEE`); `status` = `DRAFT` | `PUBLISHED` | `CLOSED` | `CANCELLED` | `LOCKED`.

## 7c. Bài tuyển CTV của tổ chức (ORGANIZATION) — mới 2026-10-26, **đổi API câu hỏi 2026-10-27**

> Backend `docs/CTV_RECRUITMENT_PLAN.md`. Bài tuyển **tách API khỏi sự kiện** (sau còn luồng ứng tuyển); backend tự gán
> loại bài, request **không gửi `eventType`**. Bỏ `HYBRID`: sự kiện vừa bán vé vừa tuyển CTV → đăng 2 bài.
> Quyền giống sự kiện (`events:create/update/publish/delete`). Id bài tuyển gọi vào `/organization/events/...` → 404 và ngược lại.

| Method | Path | `data` |
|---|---|---|
| GET | `/organization/recruitments?page&size` | `PageResponse<RecruitmentSummaryResponse>` (của chính tổ chức, mọi trạng thái) |
| GET | `/organization/recruitments/{slug}` | `RecruitmentResponse` (**có đáp án đúng**) — **theo slug (2026-10-28)**; id cũ → 404 |
| POST | `/organization/recruitments` | `RecruitmentResponse` (201, luôn DRAFT) — gửi kèm `positions`, `questions` được |
| PUT | `/organization/recruitments/{id}` | `RecruitmentResponse` — sửa **thông tin chung** (gửi đủ) + **câu hỏi chung** (`questions`: null / bỏ trống = giữ nguyên, `[]` = xóa hết, có phần tử = thay toàn bộ); `positions` **bị bỏ qua** |
| POST | `/organization/recruitments/{id}/positions` | body `CtvPositionRequest` (kèm `questions` riêng) → `RecruitmentResponse` (201) — thêm 1 vị trí vào cuối |
| PUT | `/organization/recruitments/{id}/positions/{positionId}` | body `CtvPositionRequest` → `RecruitmentResponse` — **mới**: sửa vị trí (gửi đủ) + **câu hỏi riêng** (`questions`: null = giữ nguyên, `[]` = xóa hết, có phần tử = thay toàn bộ). Giữ thứ tự + `status` |
| DELETE | `/organization/recruitments/{id}/positions/{positionId}` | `RecruitmentResponse` — xóa vị trí (kèm câu hỏi riêng của nó) |
| POST | `/organization/recruitments/{id}/publish` | `RecruitmentResponse` (DRAFT → PUBLISHED). Cần **venue + ≥ 1 vị trí**; tốn 1 lượt `EVENT_PUBLISH` như sự kiện |
| POST | `/organization/recruitments/{id}/unpublish` | `RecruitmentResponse` (PUBLISHED → DRAFT, chưa bắt đầu; không trả lượt) |
| DELETE | `/organization/recruitments/{id}` | hủy bài (→ CANCELLED) |

- **Đổi 2026-10-27 — KHÔNG còn API câu hỏi riêng** (đã bỏ 4 endpoint `/questions` và `/positions/{positionId}/questions`). Câu hỏi đi kèm form sở hữu nó:
  câu hỏi chung trong `POST` / `PUT /organization/recruitments/{id}`, câu hỏi riêng trong `POST` / `PUT .../positions/{positionId}`. Mỗi lần lưu **thay toàn bộ** danh sách theo đúng thứ tự mảng gửi lên;
  câu hỏi được tạo lại nên **id câu hỏi đổi sau mỗi lần lưu** → luôn dùng `RecruitmentResponse` mới nhất. Không gửi `questions` (null) = giữ nguyên; `[]` = xóa hết.
- **Chỉ sửa được khi DRAFT** (PUT bài, thêm / sửa / xóa vị trí). Bài PUBLISHED → 422; muốn sửa: `unpublish` → sửa → `publish` lại. Dừng tuyển sớm = `unpublish` hoặc hủy.
- Vị trí mới nối cuối danh sách; PUT vị trí giữ thứ tự cũ (chưa đổi thứ tự được).
- Mọi API sửa trả `RecruitmentResponse` mới nhất → FE vẽ lại cả bài. Vị trí không thuộc bài → 404. 2 lần lưu cùng lúc (2 tab / bấm 2 lần) → request sau **409** → FE tải lại bài.
- `RecruitmentUpsertRequest` (POST + PUT): `title` (bắt buộc, ≤255), `description?` (≤5000), `content?` (≤100000, HTML được lọc), `venueId?` (venue của chính tổ chức), `bannerUrl?` (`https://`), `startTime` (bắt buộc, tương lai), `endTime` (bắt buộc), `registerOpenTime?` (mở nhận đơn), `registerCloseTime?` (hạn nộp đơn), `categoryIds?: UUID[]` (thay toàn bộ, rỗng = bỏ hết), `positions?: CtvPositionRequest[]` (**chỉ POST**, PUT bỏ qua), `questions?: RecruitmentQuestionRequest[]` (câu hỏi chung; POST + PUT, PUT null = giữ nguyên). PUT là thay toàn bộ thông tin chung: field bỏ trống → bị xóa.
- `CtvPositionRequest`: `{ title (bắt buộc, ≤255, không trùng trong bài – không phân biệt hoa thường), description? (≤5000), quantity (bắt buộc, >0), benefits?: string[], requirements?: string[] (mỗi dòng không trống, ≤255), questions?: RecruitmentQuestionRequest[] }` — body cho POST và PUT vị trí. Không có `id` / `status` (vị trí mới luôn `OPEN`).
- `RecruitmentQuestionRequest`: `{ content (bắt buộc, ≤1000), type: SHORT_TEXT|MULTIPLE_CHOICE|YES_NO (bắt buộc), required? (mặc định false), options?: string[], correctAnswer? }`:
  - `YES_NO`: `correctAnswer` = `true` / `false` (**bắt buộc**), không có `options`;
  - `MULTIPLE_CHOICE`: `options` ≥ 2 (không trống, không trùng), `correctAnswer` = **mảng** ≥ 1 lựa chọn nằm trong `options` (**bắt buộc**, được nhiều đáp án đúng);
  - `SHORT_TEXT`: không có `options`, **không có** `correctAnswer`.
  - `correctAnswer` sai hình thức JSON (chuỗi, số…) → 400; sai theo loại câu hỏi → 422.
- `RecruitmentSummaryResponse`: `{ id, slug, venueId, venueName, venueAddress, bannerUrl, title, startTime, endTime, registerOpenTime, registerCloseTime, status, createdAt, updatedAt }`.
- `RecruitmentResponse`: `{ id, slug, userId, title, description, content, bannerUrl, startTime, endTime, registerOpenTime, registerCloseTime, status, publishedAt, venue: VenueResponse | null, categories: CategoryResponse[], positions: CtvPositionResponse[], questions: RecruitmentQuestionResponse[], createdAt, updatedAt }`.
  - `CtvPositionResponse`: `{ id, title, description, quantity, benefits, requirements, status: OPEN|CLOSED|FULLED, questions: RecruitmentQuestionResponse[] }`.
  - `RecruitmentQuestionResponse`: `{ id, content, type, required, options, correctAnswer }` (`correctAnswer`: `true/false`, mảng chuỗi, hoặc `null`).
- Lỗi 422 (`BUSINESS_RULE_VIOLATION`, message nêu rõ): bài không phải DRAFT; tên vị trí trùng; sai quy tắc câu hỏi / đáp án; publish thiếu venue / chưa có vị trí; (Phase 2) xóa vị trí đã có đơn; gửi `questions` (kể cả `[]`) khi bài đã có đơn; `quantity` nhỏ hơn số đơn đã duyệt của vị trí.
- Trạng thái vị trí `FULLED` / `CLOSED` do hệ thống đặt ở Phase 2 (ứng tuyển, duyệt đơn) — Phase 1 vị trí luôn `OPEN`.

## 7b. Địa điểm (Venue) — mới 2026-10-22

Mỗi tổ chức có danh sách địa điểm riêng, dùng lại cho nhiều sự kiện. Địa điểm có thể chia **khu vực** (khán đài, hàng…) — khu chỉ có **sức chứa**, **giá nằm ở loại vé của sự kiện** (§7).

| Actor | Method | Path | Quyền | `data` |
|---|---|---|---|---|
| Org | GET | `/organization/venues?keyword&page&size` | `events:create` | `PageResponse<VenueResponse>` mới nhất trước; `keyword` (≤100) tìm theo tên / địa chỉ |
| Org | GET | `/organization/venues/{id}` | `events:create` | `VenueResponse` (của tổ chức khác → 404) |
| Org | POST | `/organization/venues` | `events:create` | `VenueResponse` (201) |
| Org | PUT | `/organization/venues/{id}` | `events:create` | `VenueResponse` |
| Org | DELETE | `/organization/venues/{id}` | `events:create` | `null` — venue đang được sự kiện nào gắn (kể cả đã hủy) → 422 |
| Admin | GET | `/admin/venues?organizerId&keyword&page&size` | `venues:manage` | `PageResponse<VenueResponse>` (chỉ xem) |
| Admin | GET | `/admin/venues/{id}` | `venues:manage` | `VenueResponse` |

- `VenueUpsertRequest`: `{ name (bắt buộc, ≤255), address (bắt buộc, ≤500), latitude? (-90..90), longitude? (-180..180) — nhập cả hai hoặc không, capacity? (>0, sức chứa tổng; bỏ trống = không giới hạn), sections?: [{ id?, name (bắt buộc, ≤100), capacity (bắt buộc, >0) }] (≤50) }`.
  **PUT gửi ĐỦ danh sách `sections`**: có `id` → sửa, không `id` → thêm, thiếu → xóa. Field bỏ trống (tọa độ, sức chứa) = xóa giá trị cũ.
- `VenueResponse`: `{ id, organizerId, name, address, latitude, longitude, capacity, sections: [{ id, name, capacity }], createdAt, updatedAt }`.
- Lỗi 422: tên khu trùng; tổng sức chứa các khu > sức chứa venue; xóa khu đang được loại vé dùng; giảm sức chứa khu / venue xuống dưới số vé 1 sự kiện (chưa hủy) đã mở.
- Tạo venue **không** cần tổ chức đã xác minh (publish sự kiện mới cần).

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
- **Đơn chờ thanh toán (2026-10-22)**: còn 1 lần mua `PENDING_PAYMENT` chưa quá 15 phút mà bấm mua lại cùng gói (key mới) → **409** "Bạn đang có đơn chờ thanh toán…". FE lấy lại bill cũ qua `GET /me/packages?status=PENDING_PAYMENT` (lọc theo `packageId`) rồi `GET /me/packages/{id}` để hiện lại QR. Quá 15 phút → mua lại được, tạo bill mới.
- **Hết giữ chỗ — CHƯA có job dọn (PACKAGE_PLAN Phase 5)**: quá `expiresAt` mà chưa có tiền thì backend **chưa** tự đổi trạng thái → `userPackage.status` vẫn `PENDING_PAYMENT`, `payment.status` vẫn `PENDING`, `failureReason` null. FE tự coi là hết hạn khi `payment.status == "PENDING" && expiresAt <= now` (dừng poll, hiện "Đơn đã hết hạn, đặt lại"). Tiền về muộn vẫn được ghi nhận → ACTIVE. Khi có job: `userPackage` → `CANCELLED`, `payment` → `FAILED` + `EXPIRED`.
- **Sai số tiền**: `payment.status = FAILED`, `failureReason = AMOUNT_MISMATCH`, `userPackage.status = CANCELLED` (đơn đóng hẳn, đặt đơn mới; tiền đã chuyển Admin hoàn tay).

## 8b. Quyền lợi theo lượt (2026-10-21 — docs/BENEFIT_BUSINESS.md ở backend)

Lượt tính theo **tháng dương lịch, giờ VN**: hạn mức = miễn phí theo role + Σ `monthlyQuota` của các gói **đang hiệu lực**. Sang tháng mới tự làm mới.

| Action | Ai dùng | Miễn phí / tháng | Tốn lượt khi |
|---|---|---|---|
| `EVENT_PUBLISH` | ORGANIZATION | 20 | **mỗi lần** `POST /organization/events/{id}/publish` (kể cả publish lại sau khi ẩn). Ẩn / hủy **không** trả lượt |
| `EVENT_FEATURE` | ORGANIZATION | 0 | gửi đơn làm nổi bật. Admin từ chối đơn PENDING / Org hủy đơn PENDING → **trả lượt**. Admin gỡ ghim (`REVOKED`) / thu hồi gói → **không** trả |

| Method | Path | Quyền | `data` |
|---|---|---|---|
| GET | `/me/benefits` | `packages:read` (USER, ORG) | `MyBenefitsResponse` |

- `MyBenefitsResponse`: `{ period: "2026-10", periodEnd (Instant, đầu tháng sau giờ VN), benefits: BenefitUsageResponse[] }` — chỉ các action role có quyền (USER hiện là mảng rỗng).
- `BenefitUsageResponse`: `{ action, freeLimit, limit, used, remaining, sources: BenefitSourceResponse[] }`
- `BenefitSourceResponse`: `{ userPackageId, packageName, endAt, monthlyQuota, placement?, durationDays? }` (`placement`/`durationDays` chỉ có với `EVENT_FEATURE`; dùng `userPackageId` khi gửi đơn).
- Hết lượt → 422 `BUSINESS_RULE_VIOLATION`, message vd. "Đã dùng hết 20 lượt đăng sự kiện tháng này. Mua gói để đăng thêm".

## 8c. Sự kiện nổi bật (featured events — "ghim") — cập nhật 2026-10-22

Một bản ghi `FeaturedEvent` đi trọn vòng đời. Vị trí + số ngày do **gói** quy định; khung giờ tính **lúc Admin duyệt** (`startDate` = lúc duyệt, `endDate` = startDate + `durationDays`, cắt theo giờ kết thúc sự kiện); `priority` do **Admin** đặt. **Chỉ ghim được sự kiện PUBLISHED, chưa kết thúc.**

| `status` | Nghĩa | Lý do nằm ở | Trả lượt |
|---|---|---|---|
| `PENDING` | Đơn chờ duyệt | | đã trừ 1 lượt |
| `APPROVED` | Đang / sẽ hiển thị. `endDate <= now` = **hết hạn** (FE tự so, status giữ APPROVED) | | |
| `REJECTED` | Admin từ chối đơn PENDING | `rejectReason`, `rejectedAt` | **có** |
| `CANCELLED` | Tổ chức tự hủy đơn PENDING | | **có** |
| `REVOKED` | Đã gỡ: Admin gỡ ghim bản ghi APPROVED (lý do Admin nhập) **hoặc** gói bị thu hồi (lý do hệ thống "Bị gỡ do gói bị thu hồi") | `revokedReason`, `revokedAt` | không |

FE gắn nhãn theo `status` (+ so `endDate` cho hết hạn); hiển thị lý do theo cột tương ứng — **không** phân loại bằng chữ.

Tổ chức (`featured:request`, chỉ ORGANIZATION):

| Method | Path | Ghi chú |
|---|---|---|
| POST | `/organization/featured-events` | body `{ eventId, userPackageId, address? (≤255), note? (≤1000) }` → 201 `FeaturedEventResponse` (`PENDING`, trừ 1 lượt). Sự kiện không PUBLISHED / đã kết thúc, gói hết hạn / bị thu hồi / không có `EVENT_FEATURE`, hết lượt → 422; tổ chức chưa xác minh → 403; sự kiện đang có đơn chờ hoặc đang nổi bật → 409 |
| GET | `/organization/featured-events?status&page&size` | của chính mình, **mới nhất trước** |
| GET | `/organization/featured-events/{id}` | của tổ chức khác → 404 |
| POST | `/organization/featured-events/{id}/cancel` | chỉ PENDING → `CANCELLED`, trả lượt |
| POST | `/organization/featured-events/{id}/removal-request` | **mới**: body `{ reason }` (bắt buộc, ≤500). Chỉ bản ghi `APPROVED` còn hạn → gắn cờ `removalRequestedAt` + `removalReason`, status **không đổi**, banner vẫn chạy tới khi Admin gỡ. Đã xin rồi / không APPROVED / hết hạn → 422 |

Admin (`featured:manage`):

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/admin/featured-events?status&placement&removalRequested&page&size` | mọi tổ chức, **mới nhất trước**. Không truyền `status` = mọi trạng thái. `status=PENDING` = đơn chờ duyệt; `removalRequested=true` = tổ chức đã xin gỡ ghim |
| GET | `/admin/featured-events/{id}` | |
| POST | `/admin/featured-events/{id}/approve` | body `{ priority (bắt buộc 1..1000), address? }` → `APPROVED`, hiển thị ngay. Sự kiện **không PUBLISHED** (DRAFT / hủy / khóa) hoặc đã kết thúc → 422 "Muốn ghim thì sự kiện phải được công khai (PUBLISHED). Hiện tại: …" |
| POST | `/admin/featured-events/{id}/reject` | body `{ reason }` (bắt buộc, ≤500). **Chỉ đơn PENDING** → `REJECTED` + trả lượt. Bản ghi APPROVED → 422 (dùng `/revoke`) |
| POST | `/admin/featured-events/{id}/revoke` | **mới**: body `{ reason }` (bắt buộc, ≤500). Gỡ ghim bản ghi `APPROVED` còn hạn → `REVOKED`, `endDate` = lúc gỡ, không trả lượt. Dùng cả khi tổ chức xin gỡ |
| POST | `/admin/featured-events` | gắn trực tiếp (không cần đơn, không trừ lượt): `{ eventId, placement, priority, durationDays (1..365), address? }` → 201, `APPROVED` từ lúc tạo. Sự kiện không PUBLISHED → 422 |
| PUT | `/admin/featured-events/{id}` | chỉ APPROVED: `{ priority, endDate (sau startDate, **không sau giờ kết thúc sự kiện**), address? }`. Sự kiện không PUBLISHED → 422 |

Public (không cần token):

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/public/featured-events?placement&page&size` | APPROVED, sự kiện PUBLISHED, đang trong `[startDate, endDate)`; sắp `priority` (1 trước) rồi `startDate` |
| GET | `/public/featured-events/{id}` | không đang hiển thị → 404 |

- `placement` = `HOME_TOP` (đầu trang chủ) — sẽ thêm giá trị sau.
- `FeaturedEventResponse`: `{ id, userId, eventId, eventSlug (mới 2026-10-28, link trang sự kiện), userPackageId (null = Admin gắn), placement, durationDays, priority, startDate, endDate (3 field null khi PENDING), address, note, status, approvedAt, rejectReason, rejectedAt, revokedReason, revokedAt, removalRequestedAt, removalReason, eventTitle, eventStatus, eventEndTime, organizerName, organizerLogoUrl, packageName, userPackageStatus (2 field cuối null khi Admin gắn), createdAt, updatedAt }` — dùng chung cho mọi endpoint Org / Admin (kể cả response của approve / reject / revoke / cancel / removal-request / POST / PUT).
- `PublicFeaturedEventResponse`: `{ id, placement, priority, startDate, endDate, address, event: PublicEventSummaryResponse }` (chi tiết sự kiện: `GET /public/events/{event.slug}` — đổi sang slug 2026-10-28).
- Tổ chức ẩn sự kiện đang nổi bật về DRAFT → banner biến mất khỏi public, khung giờ **vẫn trôi**, không trả lượt; publish lại trước `endDate` thì hiện lại phần còn lại. Gợi ý FE Org: cảnh báo khi bấm Ẩn sự kiện đang được ghim. Đơn còn PENDING mà sự kiện bị ẩn → Admin duyệt bị 422, Admin từ chối → tổ chức được trả lượt.
- Thu hồi lần mua từ màn hình nổi bật: dùng `userPackageId` gọi `POST /admin/user-packages/{userPackageId}/revoke` (§8d) — cắt **mọi** quyền lợi của lần mua; chỉ hiện nút khi `userPackageStatus = ACTIVE`. Chỉ muốn bỏ banner này → `/revoke` của featured.

## 8d. Thu hồi gói (ADMIN)

| Method | Path | Ghi chú |
|---|---|---|
| POST | `/admin/user-packages/{userPackageId}/revoke` | `packages:manage`, body `{ reason }` (bắt buộc, ≤500) → `UserPackageResponse` (`REVOKED`). Chỉ lần mua ACTIVE (khác → 422) |

Thu hồi = mọi quyền lợi của **lần mua đó** hết ngay: hạn mức giảm; sự kiện nổi bật còn mở của lần mua (PENDING / APPROVED chưa hết hạn) → `REVOKED` "Bị gỡ do gói bị thu hồi" (đang hiển thị thì `endDate` = lúc thu hồi), **không** trả lượt. Gói gốc và người khác mua cùng gói không bị ảnh hưởng. Sự kiện đã đăng vẫn giữ.

## 9. Quản lý tài khoản (ADMIN)

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/admin/accounts?role&status&keyword&page&size` | `PageResponse<AccountSummaryResponse>`, mới nhất trước, `keyword` tìm theo email/SĐT; không sort tùy chọn |
| GET | `/admin/accounts/{id}` | `AccountDetailResponse` |
| PUT | `/admin/accounts/{id}/profile` | `{ userProfile?: UserProfileUpsertRequest, organizationProfile?: OrganizationProfileUpsertRequest }` (theo role) |
| POST | `/admin/accounts/{id}/block` | thu hồi mọi phiên đăng nhập; không áp dụng cho chính mình |
| POST | `/admin/accounts/{id}/unlock` | |
| DELETE | `/admin/accounts/{id}` | xóa mềm tài khoản + hồ sơ |
| GET | `/admin/accounts/{id}/portfolios` | **mảng** `PortfolioResponse[]` — mọi portfolio của tài khoản, **kể cả chưa publish**, mới nhất trước (2026-11-03). Tài khoản chưa có thì `[]` |
| GET | `/admin/portfolios/{id}` | `PortfolioResponse`, kể cả chưa publish; đã xóa / không có → 404 |

- `AccountSummaryResponse`: `{ id, email, phoneNumber, role, status, displayName (fullName/organizationName), avatarUrl (avatar/logo), createdAt }`
- `AccountDetailResponse`: `{ id, email, phoneNumber, role, status, currentCoin, createdAt, updatedAt, userProfile, organizationProfile }`
- Không có API khóa hàng loạt → gọi `block`/`unlock` từng id.
- `PortfolioResponse` (2026-11-03, docs/PORTFOLIO_PLAN.md ở backend; cần chạy `db/manual/2026-11-03_portfolios.sql`): `{ id, title, description|null, isPublished, publishedAt|null, createdAt, owner: { userId, fullName, avatarUrl, studentCode, university, faculty, major } | null, items: [{ eventId, eventSlug, eventTitle, organizationName, role: "ATTENDEE"|"CTV", positionName|null, startTime, endTime, issuedAt, note|null }] }`. Quyền `users:manage`, chỉ đọc. Portfolio = ghép các chứng nhận tham gia sự kiện của user; Admin thấy cả bản chưa publish (hiện badge "Chưa publish"). Dùng ở tab portfolio của trang chi tiết người dùng.- **Sửa hồ sơ (`PUT /admin/accounts/{id}/profile`) backend đã có từ trước** — FE Admin CHƯA ghép: nút "Lưu thay đổi" ở trang chi tiết người dùng chưa gọi API, `AccountApi` chưa có `updateProfile`, trang chi tiết tổ chức chưa có form sửa.

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

- ~~Sự kiện public: đăng ký tham gia~~ — **đã có 2026-10-29/30 cho USER** (`/me/registrations`, `/me/tickets`, xem ghi chú cuối file; FE Admin không dùng). Danh sách / chi tiết đã có (mục 3b); sự kiện nổi bật đã có (mục 8c, `/public/featured-events` — **bỏ** `/events/featured`, pin cũ).
- Sự kiện cho Admin (`/admin/events`), phản hồi, điểm danh, **ứng tuyển CTV** (User nộp + Tổ chức duyệt đã có từ 2026-11-04, Admin không có API xem đơn; xem / đăng bài tuyển đã có §3c, §7c), tin tức, vé, xếp hạng, portfolio, **báo cáo vi phạm** (`/admin/reports` — BE ĐÃ CÓ từ 2026-10-31, xem §14), giao dịch tài chính, nhật ký hoạt động.
- `/users/me` (coin, SĐT…), sự kiện đã tham gia của user.
- Admin: danh sách gói người dùng đã mua, thu hồi tất cả, hoàn tiền (Phase 6) — thu hồi 1 lần mua đã có (mục 8d), điều chỉnh coin.
- **Tin tức (§15) — chỉ cho đổi tiêu đề/slug khi tin còn DRAFT** (người dùng chốt 2026-11-05): FE Admin đã khóa ô tiêu đề với tin `PUBLISHED` và gửi lại `slug` cũ khi PUT. Backend nên chặn `PUT /admin/news/{id}` đổi `title` hoặc `slug` của tin `PUBLISHED` (đề xuất 422 kèm message "Gỡ đăng tin trước khi đổi tiêu đề") để link công khai không bị 404.
- CORS ở tầng Spring Security chưa bật → FE chạy khác origin phải đi qua proxy.
- Lưu token qua cookie httpOnly (hiện backend trả token trong body).

## Ghi chú 2026-10-29 — đăng ký sự kiện (FE Admin không đổi)

- Backend thêm API đăng ký sự kiện / vé của tôi cho **USER** (`/api/v1/me/registrations`, `/api/v1/me/tickets`) — FE Admin không dùng. Tài khoản ORGANIZATION không còn quyền `registrations:*`, `staff_applications:apply`, `attendances:self_checkin` (chỉ USER).
- Mã lỗi mới ở bảng mã lỗi phía trên (`ALREADY_REGISTERED`, `PENDING_ORDER_EXISTS`, `REGISTRATION_CLOSED`, `TICKET_SOLD_OUT`, `TICKET_TEMPORARILY_UNAVAILABLE`, `SERVICE_BUSY` 503).

## Ghi chú 2026-10-30 — đăng ký sự kiện Phase 2–4 (FE Admin không đổi)

- **Vé có phí (Phase 2):** USER mua vé → đơn có mã `TKT` + 8 ký tự, giữ chỗ 15 phút, trả bằng QR SePay. Đơn vé nằm chung
  bảng `transactions` với đơn gói (`PKG…`), cùng webhook `/api/v1/integrations/sepay/webhook`. Vé đã mua **không hủy,
  không hoàn tiền**; người mua không có nút hủy đơn (chờ hết 15 phút).
- **Job tự động (Phase 3):** mỗi phút đơn vé quá hạn → hết hạn + trả chỗ; đơn vé bỏ dở quá 24 giờ (không có tiền về) bị xóa
  hẳn. Đơn **gói** không bị job đụng tới (vẫn như cũ).
- **Phía tổ chức (Phase 4):** `GET /organization/events/{id}/participants` (tổ chức xem người đã có vé). Ẩn / hủy sự kiện
  khi tổng `soldCount` > 0 → **422** "Sự kiện đã có N vé đã bán hoặc đang giữ chỗ, không thể ẩn / hủy" — nếu tổ chức hỏi
  Admin vì sao không hủy được thì đây là lý do (chưa có hoàn tiền hàng loạt).
- `soldCount` trong `EventTicketTypeResponse` giờ có số thật (đã bán + đang giữ chỗ).
- **Chỉ profile dev:** `POST /api/v1/admin/payments/{mã PKG…|TKT…}/simulate?amount=…` (quyền `finance:adjust`, chỉ ADMIN)
  giả lập "tiền về" để test, chạy đúng luồng webhook. Server thật không có API này — **FE Admin không cần làm màn**.
- **Chưa có cho Admin:** xem danh sách đơn vé / người tham dự / giao dịch, hủy sự kiện có vé + hoàn tiền. Để sau cùng
  `/admin/events` (mục 11).

## 14. Báo cáo vi phạm (ADMIN) — backend có từ 2026-10-31 (docs/REPORT_PLAN.md)

> ⚠️ Chạy `db/manual/2026-11-01_reports.sql` trước. Bản chốt **đơn giản hơn mock**: Admin chỉ **đổi trạng thái** — KHÔNG có `PROCESSING` / `process`, KHÔNG có `action` (`NONE|WARN|LOCK`), KHÔNG có `warningCount`. Muốn khóa tài khoản bị báo cáo, gọi riêng `POST /admin/accounts/{userId}/block` (đã có, §9) với `target.accountUserId` lấy từ chi tiết báo cáo.

Quyền `reports:manage` (chỉ ADMIN). Người gửi là USER hoặc ORGANIZATION; đối tượng: `USER | ORGANIZATION | EVENT`.

- `GET /admin/reports?status&targetType&level&keyword&page&size` → `PageResponse<{ id, title, reporter:{ userId, displayName, role }, targetType, targetId, targetName, level|null, status, evidenceCount, submittedAt, handledBy|null }>`. `status=PENDING` → **cũ nhất trước**; còn lại mới nhất trước. `keyword` tìm theo tiêu đề hoặc tên đối tượng. `handledBy` là TÊN Admin xử lý.
- `GET /admin/reports/{id}` → thêm `content`, `evidences:[{ mediaId, fileUrl, fileName, contentType }]`, `target:{ accountUserId, displayName, accountStatus: ACTIVE|BLOCKED, otherReportCount }` (với `EVENT`, `accountUserId` là tổ chức sở hữu; `otherReportCount` = số báo cáo khác cùng đối tượng, chỉ có ở chi tiết), `resolution: null | { result: RESOLVED|REJECTED, response, resolvedAt, level|null, handledBy }`.
- `POST /admin/reports/{id}/resolve` `{ response (bắt buộc ≤2000), level?: LOW|MEDIUM|HIGH|CRITICAL }` → `PENDING → RESOLVED`, trả chi tiết mới.
- `POST /admin/reports/{id}/reject` `{ response (bắt buộc ≤2000) }` → `PENDING → REJECTED`.
- Chỉ xử lý được báo cáo `PENDING`; xử lý lại → **422**. Hai Admin xử lý cùng lúc → một bên nhận 409 `CONCURRENT_MODIFICATION`.
- Người gửi thấy `response` nhưng KHÔNG thấy `level` và tên Admin.
- `level` do Admin chấm khi `resolve` (tùy chọn); báo cáo `REJECTED` luôn có `level = null`.

## 15. Tin tức (ADMIN) — backend có từ 2026-11-04 (docs/NEWS_PLAN.md ở backend)
Quyền `news:manage` (chỉ ADMIN). ⚠️ DB dev cần chạy `db/manual/2026-11-06_news.sql` + restart backend trước khi gọi được.
- `GET /api/v1/admin/news?status=DRAFT|PUBLISHED&keyword&tag&page=0&size=20` → `PageResponse<NewsSummary>`, mới cập nhật trước.
- `GET /api/v1/admin/news/{newsId}` → `News` (mọi trạng thái).
- `POST /api/v1/admin/news` → 201 `News` (luôn DRAFT). `PUT /api/v1/admin/news/{newsId}` → `News` (gửi ĐỦ trường; trường bỏ trống = xóa giá trị cũ).
- `POST /api/v1/admin/news/{newsId}/publish` | `/unpublish` → `News`. `DELETE /api/v1/admin/news/{newsId}` → 200 + message (chỉ DRAFT).
- Body `NewsUpsertRequest`: `title` (bắt buộc ≤255), `slug` (bắt buộc ≤100, `^[a-z0-9]+(-[a-z0-9]+)*$`), `summary` (≤500), `content` (HTML ≤100000), `bannerUrl` (`https://`, ≤500), `tag` (≤50).
- **slug do FE sinh ngầm từ title** (bỏ dấu kể cả đ→d, chữ thường, ký tự khác a-z0-9 → `-`, gộp `-`, bỏ `-` đầu/cuối, ≤100 cắt ở `-`), gửi lại mỗi lần sửa. BE chỉ kiểm định dạng + trùng.
- `News`: `id, slug, title, summary, content, bannerUrl, tag, status, viewCount, publishedAt (null = chưa từng đăng), createdAt, updatedAt`. `NewsSummary` = không có `content`.
- Lỗi: 409 `NEWS_SLUG_TAKEN` (slug trùng tin khác → nhắc đổi tiêu đề); 422 đăng khi nội dung trống / sai trạng thái, xóa tin đang đăng, sửa tin đang đăng thành nội dung trống; 409 `CONCURRENT_MODIFICATION`; 400 validation theo field.
- HTML được giữ: p, div, h1–h6, ul/ol/li, blockquote, b/strong, i/em, u, s/strike/del, sub/sup, code, span, br, a (http/https), img (http/https), table/thead/tbody/tr/th/td, style đơn giản. Bị bỏ: script, iframe/video/embed, pre, class, on*, `javascript:`.
- Phía công khai (FE User/Org dùng):
- `GET /api/v1/public/news?keyword&tag&page=0&size=20` → `PageResponse<PublicNewsSummary>` — chỉ tin PUBLISHED, mới đăng trước, KHÔNG có `content`.
- `GET /api/v1/public/news/{slug}` → `PublicNews` — path là **slug**, không phải id. Chưa đăng / đã gỡ / đã xóa / slug sai → 404.
- `PublicNewsSummary`: `id, slug, title, summary, bannerUrl, tag, viewCount, publishedAt`. `PublicNews` = thêm `content` (HTML đã lọc ở server — vẫn render qua sanitizer phía FE nếu có).
- Admin đổi tiêu đề → slug đổi → link cũ 404 (người dùng chốt). **Cập nhật 2026-11-05:** chỉ tin DRAFT được đổi tiêu đề; FE đã khóa, chờ backend chặn (mục 11).
