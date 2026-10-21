# Admin Events — hướng dẫn cho agent

- Repo FE trang quản trị (CRA, React 19, TypeScript 4.9, TanStack Query, Tailwind 3). **Chỉ làm FE — không sửa backend** (`D:\Events\events-backend`).
- Contract API backend: [docs/BACKEND_API_CONTRACT.md](docs/BACKEND_API_CONTRACT.md) — đọc trước khi gọi API. Thiếu API → ghi vào mục "Chờ backend" và báo người dùng.
- Trạng thái công việc & lưu ý kỹ thuật: [docs/FE_HANDOFF.md](docs/FE_HANDOFF.md).
- Rule code bắt buộc: `.agents/rules/` (`typescript-*`, `react-*`, `web-*`, `common-*`). Không `any` (dùng `unknown` + narrowing), không `console.*`, server state qua TanStack Query, validate form bằng zod@3, link ngoài có `rel="noopener noreferrer"`.
- Gọi API qua `http.*` trong `src/services/apiClient.ts` (đã unwrap `data`, lỗi là `ApiError`); không đọc `.object` / `statusCode`.
- Type-check: `npx -y -p typescript@5.4.5 tsc --noEmit -p .` (tsc 4.9 của project kẹt ở node_modules). Build thử với `BUILD_PATH` để không ghi đè `build/`.
- Chỉ commit khi người dùng yêu cầu. Trả lời bằng tiếng Việt.
