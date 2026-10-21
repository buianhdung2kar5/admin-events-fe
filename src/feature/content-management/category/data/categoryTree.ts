import type { CategoryResponse, CategoryStats, CategoryTreeNode, FlatCategory } from "./category.types";

const PATH_SEPARATOR = " › ";

const byCreatedAt = (a: CategoryTreeNode, b: CategoryTreeNode): number =>
    a.createdAt.localeCompare(b.createdAt) || a.name.localeCompare(b.name, "vi");

/**
 * Dựng cây từ danh sách phẳng: nhóm theo `parentCategoryId`, `null` là gốc.
 * Cha không có trong danh sách (dữ liệu lệch) → coi như gốc để không mất danh mục.
 */
export function buildTree(items: CategoryResponse[]): CategoryTreeNode[] {
    const ids = new Set(items.map((item) => item.categoryId));
    const childrenByParent = new Map<string | null, CategoryResponse[]>();
    items.forEach((item) => {
        const parentKey = item.parentCategoryId && ids.has(item.parentCategoryId) ? item.parentCategoryId : null;
        childrenByParent.set(parentKey, [...(childrenByParent.get(parentKey) ?? []), item]);
    });

    const toNodes = (parentKey: string | null): CategoryTreeNode[] =>
        (childrenByParent.get(parentKey) ?? [])
            .map((item) => ({
                categoryId: item.categoryId,
                name: item.name,
                parentCategoryId: item.parentCategoryId,
                createdAt: item.createdAt,
                children: toNodes(item.categoryId),
            }))
            .sort(byCreatedAt);

    return toNodes(null);
}

/** Duyệt cây theo thứ tự hiển thị (cha trước, con sau) kèm độ sâu và đường dẫn. */
export function flattenTree(nodes: CategoryTreeNode[], depth = 0, parentPath = ""): FlatCategory[] {
    return nodes.flatMap((node) => {
        const path = parentPath ? `${parentPath}${PATH_SEPARATOR}${node.name}` : node.name;
        const self: FlatCategory = {
            categoryId: node.categoryId,
            name: node.name,
            parentCategoryId: node.parentCategoryId,
            depth,
            path,
            childCount: node.children.length,
        };
        return [self, ...flattenTree(node.children, depth + 1, path)];
    });
}

export function findNode(nodes: CategoryTreeNode[], id: string): CategoryTreeNode | null {
    for (const node of nodes) {
        if (node.categoryId === id) return node;
        const found = findNode(node.children, id);
        if (found) return found;
    }
    return null;
}

/** Id của nút và toàn bộ con cháu — không được chọn làm cha khi sửa (tránh vòng lặp). */
export function collectSubtreeIds(node: CategoryTreeNode): Set<string> {
    const ids = new Set<string>([node.categoryId]);
    node.children.forEach((child) => collectSubtreeIds(child).forEach((id) => ids.add(id)));
    return ids;
}

/** Id các nút có con — dùng cho "Mở tất cả". */
export function collectExpandableIds(nodes: CategoryTreeNode[]): string[] {
    return nodes.flatMap((node) =>
        node.children.length > 0 ? [node.categoryId, ...collectExpandableIds(node.children)] : []);
}

/**
 * Lọc cây theo từ khóa: giữ nút khớp (cùng toàn bộ con của nó) và các nút cha dẫn tới nút khớp.
 * Trả thêm id các nút cha cần mở để thấy kết quả.
 */
export function filterTree(nodes: CategoryTreeNode[], keyword: string): { nodes: CategoryTreeNode[]; expandIds: string[] } {
    const query = keyword.trim().toLowerCase();
    if (!query) return { nodes, expandIds: [] };

    const expandIds: string[] = [];
    const visit = (list: CategoryTreeNode[]): CategoryTreeNode[] =>
        list.flatMap((node) => {
            if (node.name.toLowerCase().includes(query)) return [node];
            const children = visit(node.children);
            if (children.length === 0) return [];
            expandIds.push(node.categoryId);
            return [{ ...node, children }];
        });

    return { nodes: visit(nodes), expandIds };
}

export function computeStats(nodes: CategoryTreeNode[]): CategoryStats {
    const flat = flattenTree(nodes);
    return {
        total: flat.length,
        roots: nodes.length,
        children: flat.length - nodes.length,
        maxDepth: flat.reduce((max, item) => Math.max(max, item.depth + 1), 0),
    };
}
