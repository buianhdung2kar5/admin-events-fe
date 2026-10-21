import { http } from "../apiClient";
import type {
    CategoryResponse,
    CategoryTreeNode,
    CategoryUpsertRequest,
} from "../../feature/content-management/category/data/category.types";
import { buildTree } from "../../feature/content-management/category/data/categoryTree";

const ADMIN_PATH = "/admin/categories";
export const CATEGORIES_QUERY_KEY = ["categories", "tree"] as const;

/**
 * Đọc danh sách phẳng qua API public rồi tự dựng cây (backend đã bỏ /public/categories/tree), ghi qua /admin/categories.
 * Backend: chọn cha là chính nó / con cháu → 400; xóa danh mục còn con → 400; đang gán cho sự kiện → 409; xóa là xóa mềm.
 */
export const CategoryApi = {
    async getTree(): Promise<CategoryTreeNode[]> {
        const items = await http.get<CategoryResponse[]>("/public/categories");
        return buildTree(items);
    },

    create(body: CategoryUpsertRequest): Promise<unknown> {
        return http.post<unknown>(ADMIN_PATH, body);
    },

    update(id: string, body: CategoryUpsertRequest): Promise<unknown> {
        return http.put<unknown>(`${ADMIN_PATH}/${id}`, body);
    },

    remove(id: string): Promise<unknown> {
        return http.delete<unknown>(`${ADMIN_PATH}/${id}`);
    },
};
