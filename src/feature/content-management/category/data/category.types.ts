/**
 * Backend lưu danh mục dạng cây cha – con, không giới hạn số tầng. Id là UUID (string).
 */

/** Khớp backend CategoryResponse (GET /public/categories — danh sách phẳng). */
export interface CategoryResponse {
    categoryId: string;
    name: string;
    parentCategoryId: string | null;
    createdAt: string;
    updatedAt: string;
}

/** Nút cây do FE tự dựng từ danh sách phẳng (backend không còn API cây). */
export interface CategoryTreeNode {
    categoryId: string;
    name: string;
    parentCategoryId: string | null;
    createdAt: string;
    children: CategoryTreeNode[];
}

/** Khớp backend CategoryUpsertRequest (POST/PUT /admin/categories). */
export interface CategoryUpsertRequest {
    name: string;
    parentCategoryId: string | null;
}

/** Một nút đã làm phẳng để hiển thị (select chọn cha, thống kê). */
export interface FlatCategory {
    categoryId: string;
    name: string;
    parentCategoryId: string | null;
    depth: number;
    /** "Cha › Con › Cháu" */
    path: string;
    childCount: number;
}

export interface CategoryStats {
    total: number;
    roots: number;
    children: number;
    maxDepth: number;
}

/** Độ dài tên tối đa — khớp @Size(max = 100) của CategoryUpsertRequest. */
export const CATEGORY_NAME_MAX_LENGTH = 100;
