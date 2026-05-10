import { useState, useEffect } from "react";
import {
    ChevronLeft, ChevronRight, Eye, Users,
    Calendar, DollarSign, Star, Trash2
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RecruitmentApi } from "../../../../services/events-management/Recruitments";
import { RecruitmentItem } from "../data/RecruitmentMockData";
import RecruitmentDetailPanel from "./RecruitmentDetailPanel";
import Toast from "../../../../components/common/Toast";

interface RecruitmentListProps {
    filter?: { search?: string; filter1?: string; };
}

export default function RecruitmentList({ filter }: RecruitmentListProps) {
    const queryClient = useQueryClient();

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 8;

    const [detailId, setDetailId] = useState<number | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // Reset page on filter change
    useEffect(() => { setCurrentPage(0); }, [filter?.search, filter?.filter1]);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    // Fetch danh sách
    const { data: response, isLoading, isError } = useQuery({
        queryKey: ["recruitments"],
        queryFn: () => RecruitmentApi.getAllRecruitment(0, 200, ["createdTime,desc"]),
    });

    const allItems: RecruitmentItem[] = response?.object?.content || [];
    const totalElements = allItems.length;

    // FE filter by keyword + status from GroupFilter
    const filtered = allItems.filter(r => {
        const keyword = filter?.search || "";
        const matchSearch = !keyword ||
            r.title.toLowerCase().includes(keyword.toLowerCase()) ||
            r.roleName.toLowerCase().includes(keyword.toLowerCase());
        const statusParam = filter?.filter1 || "";
        const matchStatus =
            !statusParam ||
            (statusParam === "OPEN" && r.isOpen) ||
            (statusParam === "CLOSED" && !r.isOpen);
        return matchSearch && matchStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginatedItems = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    // Xóa một recruitment
    const handleDelete = async (id: number) => {
        try {
            await RecruitmentApi.deleteRecruitment(String(id));
            showToast("Đã xóa đợt tuyển dụng thành công", true);
            queryClient.invalidateQueries({ queryKey: ["recruitments"] });
        } catch {
            showToast("Xóa thất bại. Vui lòng thử lại.", false);
        }
    };

    // Chuyển trạng thái open/close
    const handleToggleStatus = async (id: number) => {
        try {
            await RecruitmentApi.patchRecruitment(String(id));
            showToast("Đã cập nhật trạng thái thành công", true);
            queryClient.invalidateQueries({ queryKey: ["recruitments"] });
            setDetailId(null);
        } catch {
            showToast("Cập nhật trạng thái thất bại", false);
        }
    };

    const statusStyle = (isOpen: boolean) =>
        isOpen
            ? "bg-green-50 text-green-600 border-green-200"
            : "bg-gray-100 text-gray-500 border-gray-200";

    const formatCurrency = (amount: number) =>
        amount > 0 ? amount.toLocaleString("vi-VN") + "đ" : "Không có";

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("vi-VN");

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-bold text-gray-800">Danh sách đợt tuyển CTV</h2>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-3xl">
                        <div className="w-8 h-8 border-4 border-blue-100 border-t-[#0092B8] rounded-full animate-spin" />
                    </div>
                )}

                {/* Error state */}
                {isError && !isLoading && (
                    <div className="py-16 text-center text-sm text-red-400 font-medium">
                        Không thể tải dữ liệu. Vui lòng thử lại.
                    </div>
                )}

                {!isError && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">Đợt tuyển / Vai trò</th>
                                    <th className="px-5 py-4 text-center">Thời gian</th>
                                    <th className="px-5 py-4 text-center">Chỉ tiêu</th>
                                    <th className="px-5 py-4 text-center">Đơn nộp</th>
                                    <th className="px-5 py-4 text-center">Quyền lợi</th>
                                    <th className="px-5 py-4 text-center">Trạng thái</th>
                                    <th className="px-5 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length === 0 && !isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center text-sm text-gray-400 font-medium">
                                            Không tìm thấy đợt tuyển dụng nào
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedItems.map(r => (
                                        <tr key={r.ctvRecruitmentId} className="hover:bg-blue-50/20 transition-colors">
                                            {/* Title + Role */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                        {r.banner ? (
                                                            <img
                                                                src={r.banner}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "https://placehold.co/80x48?text=No+Image";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <Users size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-1 max-w-[260px]">
                                                        <span className="font-bold text-gray-800 truncate text-sm" title={r.title}>
                                                            {r.title}
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs text-[#0092B8] font-semibold bg-blue-50 px-2 py-0.5 rounded-lg">
                                                                {r.roleName}
                                                            </span>
                                                            {r.categories.slice(0, 1).map(cat => (
                                                                <span key={cat.categoryId} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
                                                                    {cat.options[0]?.value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Thời gian */}
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar size={11} className="text-gray-400" />
                                                        <span>{formatDate(r.startTime)}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400">Ngày tuyển</span>
                                                </div>
                                            </td>

                                            {/* Chỉ tiêu */}
                                            <td className="px-5 py-4 text-center">
                                                <span className="font-bold text-gray-700">{r.quantity}</span>
                                            </td>

                                            {/* Đơn nộp */}
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="font-bold text-[#0092B8]">{r.appliedCount}</span>
                                                    <div className="w-12 bg-gray-100 rounded-full h-1 overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#0092B8] rounded-full"
                                                            style={{ width: `${Math.min((r.appliedCount / Math.max(r.quantity, 1)) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Quyền lợi */}
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    {r.cashRewardAmount > 0 && (
                                                        <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                                                            <DollarSign size={10} />
                                                            {formatCurrency(r.cashRewardAmount)}
                                                        </span>
                                                    )}
                                                    {r.youthUnionPoint > 0 && (
                                                        <span className="text-xs text-purple-500 font-semibold flex items-center gap-0.5">
                                                            <Star size={10} />
                                                            {r.youthUnionPoint} điểm RĐ
                                                        </span>
                                                    )}
                                                    {r.cashRewardAmount === 0 && r.youthUnionPoint === 0 && (
                                                        <span className="text-xs text-gray-400">—</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase tracking-wide ${statusStyle(r.isOpen)}`}>
                                                    {r.isOpen ? "Đang mở" : "Đã đóng"}
                                                </span>
                                            </td>

                                            {/* Thao tác */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => setDetailId(r.ctvRecruitmentId)}
                                                        className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Chi tiết"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(r.ctvRecruitmentId)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">
                            Tổng <span className="font-bold text-gray-800">{filtered.length}</span> đợt tuyển
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`w-8 h-8 rounded-xl text-sm font-bold transition-all ${currentPage === i ? "bg-[#0092B8] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage >= totalPages - 1}
                                className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            {detailId !== null && (
                <RecruitmentDetailPanel
                    recruitmentId={detailId}
                    onClose={() => setDetailId(null)}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Toast */}
            {toast && (
                <Toast toast={{ msg: toast.msg, ok: toast.ok }} onClose={() => setToast(null)} />
            )}
        </div>
    );
}
