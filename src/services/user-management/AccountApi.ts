import { http } from "../apiClient";
import type { PageResponse } from "../../types/api.types";
import type { AccountDetail, AccountListParams, AccountSummary } from "../../types/account.types";

const BASE_PATH = "/admin/accounts";

/** Kết quả thao tác hàng loạt (khóa / mở khóa nhiều tài khoản). */
export interface BulkResult {
  succeeded: number;
  failed: number;
  firstError: string | null;
}

async function runBulk(ids: string[], action: (id: string) => Promise<unknown>): Promise<BulkResult> {
  const results = await Promise.allSettled(ids.map(action));
  const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  const firstReason: unknown = rejected[0]?.reason;
  return {
    succeeded: results.length - rejected.length,
    failed: rejected.length,
    firstError: firstReason instanceof Error ? firstReason.message : null,
  };
}

/** Admin quản lý tài khoản — GET/PUT/POST/DELETE /admin/accounts. Backend chặn khóa/xóa chính mình. */
export const AccountApi = {
  /** Danh sách (mới nhất trước), lọc theo role / status, tìm theo email / SĐT */
  getAccounts(params: AccountListParams): Promise<PageResponse<AccountSummary>> {
    return http.get<PageResponse<AccountSummary>>(BASE_PATH, { params });
  },

  getAccount(id: string): Promise<AccountDetail> {
    return http.get<AccountDetail>(`${BASE_PATH}/${id}`);
  },

  block(id: string): Promise<unknown> {
    return http.post<unknown>(`${BASE_PATH}/${id}/block`);
  },

  unlock(id: string): Promise<unknown> {
    return http.post<unknown>(`${BASE_PATH}/${id}/unlock`);
  },

  blockMany(ids: string[]): Promise<BulkResult> {
    return runBulk(ids, AccountApi.block);
  },

  unlockMany(ids: string[]): Promise<BulkResult> {
    return runBulk(ids, AccountApi.unlock);
  },

  /** Xóa mềm tài khoản + hồ sơ */
  deleteAccount(id: string): Promise<void> {
    return http.delete(`${BASE_PATH}/${id}`);
  },
};
