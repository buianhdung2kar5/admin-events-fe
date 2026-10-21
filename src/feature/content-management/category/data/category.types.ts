export interface CategoryOptionInterface {
    categoryOptionId: number;
    categoryId: number;
    value: string;
}

export interface CategoryInterface {
    categoryId: number;
    name: string;
    type: string;
    options: CategoryOptionInterface[];
}

export interface CategoryResponseInterface {
    errorCode: number;
    statusCode: number;
    object: {
        content: CategoryInterface[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                unsorted: boolean;
                sorted: boolean;
                empty: boolean;
            };
            offset: number;
            unpaged: boolean;
            paged: boolean;
        };
        totalPages: number;
        totalElements: number;
        last: boolean;
        numberOfElements: number;
        size: number;
        number: number;
        sort: {
            unsorted: boolean;
            sorted: boolean;
            empty: boolean;
        };
        first: boolean;
        empty: boolean;
    };
}

export interface SingleCategoryResponseInterface {
    errorCode: number;
    statusCode: number;
    object: CategoryInterface;
}

export const CategoryCardData = [
    { title: "Tổng danh mục", value: 6 },
    { title: "Có options",    value: 4, color: "text-green-500" },
    { title: "Chưa có options", value: 2, color: "text-amber-500" },
    { title: "Tổng options",  value: 12, color: "text-blue-600" },
];
