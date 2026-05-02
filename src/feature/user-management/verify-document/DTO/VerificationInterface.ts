export interface VerificationDocument {
    verificationDocumentId: number;
    userId: number;
    documentType: string;
    fileUrl: string;
    originalFileName: string;
    createdTime: string;
}

export interface VerificationDocumentResponse {
    content: VerificationDocument[];
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
}

export const getDocumentTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
        case "BUSINESS_LICENSE":
            return "Giấy phép kinh doanh";
        case "CLUB_CERTIFICATE":
            return "Chứng nhận CLB / Hội nhóm";
        case "TAX_CODE":
            return "Mã số thuế";
        case "STUDENT_CARD":
            return "Thẻ sinh viên";
        case "CCCD":
            return "Căn cước công dân";
        default:
            return type || "Tài liệu";
    }
};

export const getDocumentTypeStyle = (type: string) => {
    switch (type?.toUpperCase()) {
        case "BUSINESS_LICENSE":
            return "bg-blue-50 text-blue-600 border-blue-100";
        case "CLUB_CERTIFICATE":
            return "bg-purple-50 text-purple-600 border-purple-100";
        case "TAX_CODE":
            return "bg-amber-50 text-amber-600 border-amber-100";
        default:
            return "bg-gray-50 text-gray-600 border-gray-100";
    }
};
