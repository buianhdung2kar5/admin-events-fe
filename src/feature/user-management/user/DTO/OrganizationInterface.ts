/** Kiểu dữ liệu chi tiết tổ chức: dùng AccountDetail trong src/types/account.types.ts. */

export const getOrgTypeStyles = (type: string) => {
    switch (type?.toUpperCase()) {
        case "UNIVERSITY":
            return { label: "Trường Đại học", color: "bg-blue-50 text-blue-600 border-blue-100" };
        case "CLUB":
            return { label: "CLB / Hội nhóm", color: "bg-purple-50 text-purple-600 border-purple-100" };
        case "BUSINESS":
            return { label: "Doanh nghiệp", color: "bg-amber-50 text-amber-600 border-amber-100" };
        default:
            return { label: type || "Tổ chức", color: "bg-gray-50 text-gray-600 border-gray-100" };
    }
};

export const getVerificationStyles = (status: string) => {
    switch (status?.toUpperCase()) {
        case "APPROVED":
        case "VERIFIED":
            return { label: "Đã xác thực", color: "bg-blue-50 text-[#0092B8] border-blue-100" };
        case "PENDING":
            return { label: "Chờ duyệt", color: "bg-amber-50 text-amber-600 border-amber-100" };
        case "REJECTED":
            return { label: "Từ chối", color: "bg-red-50 text-red-600 border-red-100" };
        default:
            return { label: "Chưa xác thực", color: "bg-gray-50 text-gray-400 border-gray-100" };
    }
};
