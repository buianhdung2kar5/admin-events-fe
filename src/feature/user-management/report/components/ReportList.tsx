import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, Paperclip, Search, ShieldCheck } from "lucide-react";
import { REPORTS_QUERY_KEY, ReportsApi } from "../../../../services/user-management/ReportsApi";
import { getErrorMessage } from "../../../../services/apiError";
import {
    REPORT_LEVELS,
    type ReportLevel,
    type ReportStatus,
    type ReportTargetType,
} from "../../../../types/report.types";
import {
    REPORTER_ROLE_LABELS,
    REPORT_LEVEL_META,
    REPORT_STATUS_META,
    REPORT_TARGET_LABELS,
    formatReportDate,
    formatReportId,
} from "../reportDisplay";
import { ReportLevelBadge, ReportStatusBadge } from "./ReportBadges";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const SELECT_CLASS = "border border-gray-200 rounded-xl px-3 min-h-11 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer";

const STATUS_OPTIONS = Object.keys(REPORT_STATUS_META) as ReportStatus[];
const TARGET_OPTIONS = Object.keys(REPORT_TARGET_LABELS) as ReportTargetType[];

/** Danh sách báo cáo vi phạm (lọc + phân trang phía server); bấm vào dòng để mở trang xử lý. */
export default function ReportList() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<ReportStatus | "">("");
    const [targetType, setTargetType] = useState<ReportTargetType | "">("");
    const [level, setLevel] = useState<ReportLevel | "">("");
    const [search, setSearch] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyword(search.trim());
            setPage(0);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    const params = {
        status: status || undefined,
        targetType: targetType || undefined,
        level: level || undefined,
        keyword: keyword || undefined,
        page,
        size: PAGE_SIZE,
    };
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: [...REPORTS_QUERY_KEY, "list", params],
        queryFn: () => ReportsApi.list(params),
        placeholderData: keepPreviousData,
    });

    const reports = data?.items ?? [];
    const totalPages = Math.max(1, data?.totalPages ?? 1);

    const changeFilter = <T extends string>(setter: (value: T) => void) => (e: ChangeEvent<HTMLSelectElement>) => {
        setter(e.target.value as T);
        setPage(0);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 min-h-11 focus-within:border-[#0092B8] flex-1">
                    <Search size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tiêu đề hoặc tên đối tượng"
                        aria-label="Tìm báo cáo" className="text-sm outline-none bg-transparent w-full" />
                </label>
                <div className="flex flex-wrap gap-3">
                    <select value={status} onChange={changeFilter<ReportStatus | "">(setStatus)} aria-label="Lọc trạng thái" className={SELECT_CLASS}>
                        <option value="">Tất cả trạng thái</option>
                        {STATUS_OPTIONS.map((value) => <option key={value} value={value}>{REPORT_STATUS_META[value].label}</option>)}
                    </select>
                    <select value={targetType} onChange={changeFilter<ReportTargetType | "">(setTargetType)} aria-label="Lọc loại đối tượng" className={SELECT_CLASS}>
                        <option value="">Tất cả đối tượng</option>
                        {TARGET_OPTIONS.map((value) => <option key={value} value={value}>{REPORT_TARGET_LABELS[value]}</option>)}
                    </select>
                    <select value={level} onChange={changeFilter<ReportLevel | "">(setLevel)} aria-label="Lọc mức độ" className={SELECT_CLASS}>
                        <option value="">Tất cả mức độ</option>
                        {REPORT_LEVELS.map((value) => <option key={value} value={value}>{REPORT_LEVEL_META[value].label}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                {isFetching && !isLoading && <Loader2 size={16} className="absolute top-4 right-4 animate-spin text-[#0092B8]" aria-label="Đang tải lại" />}
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>
                ) : error ? (
                    <p role="alert" className="px-6 py-16 text-center text-sm font-medium text-red-500">{getErrorMessage(error, "Không tải được danh sách báo cáo")}</p>
                ) : reports.length === 0 ? (
                    <div className="px-6 py-16 flex flex-col items-center gap-2 text-sm text-gray-400">
                        <ShieldCheck size={32} className="text-gray-300" aria-hidden="true" /> Không có báo cáo nào
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">Báo cáo</th>
                                    <th className="px-5 py-4">Người gửi</th>
                                    <th className="px-5 py-4">Đối tượng</th>
                                    <th className="px-5 py-4">Mức độ</th>
                                    <th className="px-5 py-4">Trạng thái</th>
                                    <th className="px-5 py-4">Người xử lý</th>
                                    <th className="px-5 py-4">Gửi lúc</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reports.map((report) => (
                                    <tr key={report.id} onClick={() => navigate(`/user-management/report/${report.id}`)} className="align-top cursor-pointer hover:bg-blue-50/30 transition-colors">
                                        <td className="px-5 py-4 max-w-xs">
                                            <Link to={`/user-management/report/${report.id}`} onClick={(e) => e.stopPropagation()} className="font-bold text-gray-800 hover:text-[#0092B8]">{report.title}</Link>
                                            <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                                {formatReportId(report.id)}
                                                <span className="inline-flex items-center gap-0.5"><Paperclip size={11} aria-hidden="true" />{report.evidenceCount}<span className="sr-only"> minh chứng</span></span>
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-700">{report.reporter.displayName}</p>
                                            <p className="text-xs text-gray-400">{REPORTER_ROLE_LABELS[report.reporter.role]}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-700">{report.targetName}</p>
                                            <p className="text-xs text-gray-400">{REPORT_TARGET_LABELS[report.targetType]}</p>
                                        </td>
                                        <td className="px-5 py-4"><ReportLevelBadge level={report.level} /></td>
                                        <td className="px-5 py-4"><ReportStatusBadge status={report.status} /></td>
                                        <td className="px-5 py-4 text-xs text-gray-600">{report.handledBy ?? "—"}</td>
                                        <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">{formatReportDate(report.submittedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
                    <span>{data?.totalElements ?? 0} báo cáo · {status === "PENDING" ? "cũ nhất trước" : "mới nhất trước"}</span>
                    <div className="flex items-center gap-2">
                        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Trước</button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
