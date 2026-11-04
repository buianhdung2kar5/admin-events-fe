/** Kiểu dữ liệu chi tiết tổ chức: dùng AccountDetail trong src/types/account.types.ts. */

export const getOrgTypeStyles = (type: string) => {
    switch (type?.toUpperCase()) {
        case "STUDENT_ORG":
            return { label: "Tổ chức sinh viên", color: "bg-blue-50 text-blue-600 border-blue-100" };
        case "COMPANY":
            return { label: "Doanh nghiệp", color: "bg-amber-50 text-amber-600 border-amber-100" };
        case "NGO":
            return { label: "Phi lợi nhuận", color: "bg-purple-50 text-purple-600 border-purple-100" };
        default:
            return { label: "Chưa chọn loại", color: "bg-gray-50 text-gray-500 border-gray-100" };
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
            return { label: "Bị từ chối", color: "bg-red-50 text-red-600 border-red-100" };
        case "UNVERIFIED":
        default:
            return { label: "Chưa nộp hồ sơ", color: "bg-gray-50 text-gray-400 border-gray-100" };
    }
};
