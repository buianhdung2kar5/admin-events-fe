import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { getErrorMessage } from "../../../../services/apiError";
import {
    REPORT_LEVELS,
    type RejectReportBody,
    type ReportLevel,
    type ResolveReportBody,
} from "../../../../types/report.types";
import { REPORT_LEVEL_META } from "../reportDisplay";
import { REPORT_RESPONSE_MAX_LENGTH, rejectReportSchema, resolveReportSchema } from "../reportForm.schema";

type Mode = "resolve" | "reject";

interface Props {
    onResolve: (body: ResolveReportBody) => Promise<unknown>;
    onReject: (body: RejectReportBody) => Promise<unknown>;
}

const INPUT_CLASS = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-normal normal-case tracking-normal outline-none focus:border-[#0092B8]";
const LABEL_CLASS = "flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600";

/** Giải quyết hoặc bác bỏ một đơn đang chờ — chỉ đổi trạng thái, không xử phạt. */
export default function ReportHandleForm({ onResolve, onReject }: Props) {
    const [mode, setMode] = useState<Mode>("resolve");
    const [level, setLevel] = useState<ReportLevel | "">("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const run = async (task: () => Promise<unknown>) => {
        setError(null);
        setIsSaving(true);
        try {
            await task();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (mode === "reject") {
            const parsed = rejectReportSchema.safeParse({ response });
            if (!parsed.success) {
                setError(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
                return;
            }
            run(() => onReject(parsed.data));
            return;
        }
        const parsed = resolveReportSchema.safeParse({ level: level || undefined, response });
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
            return;
        }
        run(() => onResolve(parsed.data));
    };

    return (
        <section aria-labelledby="handle-title" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h2 id="handle-title" className="text-xs font-bold uppercase tracking-wide text-gray-500">Xử lý báo cáo</h2>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl" role="group" aria-label="Chọn kết quả">
                {(["resolve", "reject"] as const).map((key) => (
                    <button key={key} type="button" aria-pressed={mode === key} onClick={() => { setMode(key); setError(null); }}
                        className={`flex-1 px-4 min-h-10 rounded-lg text-sm font-semibold transition-all ${mode === key ? "bg-white shadow-sm text-[#0092B8]" : "text-gray-500 hover:text-gray-700"}`}>
                        {key === "resolve" ? "Giải quyết" : "Bác bỏ"}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {mode === "resolve" && (
                    <label className={LABEL_CLASS}>
                        Mức độ
                        <select value={level} onChange={(e) => setLevel(e.target.value as ReportLevel | "")} className={`${INPUT_CLASS} bg-white`}>
                            <option value="">Không chấm</option>
                            {REPORT_LEVELS.map((value) => <option key={value} value={value}>{REPORT_LEVEL_META[value].label}</option>)}
                        </select>
                    </label>
                )}

                <label className={LABEL_CLASS}>
                    {mode === "reject" ? "Lý do bác bỏ *" : "Phản hồi cho người báo cáo *"}
                    <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={3} maxLength={REPORT_RESPONSE_MAX_LENGTH}
                        placeholder={mode === "reject" ? "Người báo cáo sẽ thấy lý do này" : "Người báo cáo thấy nội dung này, không thấy mức độ và tên Admin"} className={`${INPUT_CLASS} resize-none`} />
                    <span className="self-end text-[11px] font-normal text-gray-400">{response.length}/{REPORT_RESPONSE_MAX_LENGTH}</span>
                </label>

                {error && (
                    <p role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100 text-xs font-medium text-red-600">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{error}
                    </p>
                )}

                <button type="submit" disabled={isSaving}
                    className={`px-5 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 ${mode === "reject" ? "bg-red-500 hover:bg-red-600" : "bg-[#0092B8] hover:bg-[#007a99]"}`}>
                    {isSaving && <Loader2 size={14} className="animate-spin" />}{mode === "reject" ? "Xác nhận bác bỏ" : "Hoàn tất giải quyết"}
                </button>
            </form>
        </section>
    );
}
