import { useState } from "react";
import { X, Plus, Trash2, GripVertical, ToggleLeft, ToggleRight } from "lucide-react";
import { FeedbackQuestion, QuestionType } from "../data/FeedbackMockData";

interface Props {
    eventId: string;
    onClose: () => void;
    onSave: (q: FeedbackQuestion) => void;
}

const TYPE_LABELS: Record<QuestionType, string> = {
    TEXT: "Văn bản tự do",
    RATING: "Đánh giá sao (1-5)",
    SINGLECHOICE: "Chọn một",
    MULTIPLECHOICE: "Chọn nhiều"
};

const TYPE_ICONS: Record<QuestionType, string> = {
    TEXT: "📝", RATING: "⭐", SINGLECHOICE: "🔘", MULTIPLECHOICE: "☑️"
};

export default function FeedbackQuestionForm({ eventId, onClose, onSave }: Props) {
    const [content, setContent] = useState("");
    const [type, setType] = useState<QuestionType>("TEXT");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [required, setRequired] = useState(true);

    const needsOptions = type === "SINGLECHOICE" || type === "MULTIPLECHOICE";

    const addOption = () => setOptions(prev => [...prev, ""]);
    const removeOption = (i: number) => setOptions(prev => prev.filter((_, idx) => idx !== i));
    const updateOption = (i: number, value: string) => setOptions(prev => prev.map((o, idx) => idx === i ? value : o));

    const handleSave = () => {
        if (!content.trim()) return;
        const validOptions = options.filter(o => o.trim());
        if (needsOptions && validOptions.length < 2) return;
        onSave({
            id: `q-${Date.now()}`,
            eventId,
            content: content.trim(),
            type,
            options: needsOptions ? validOptions : undefined,
            required,
            order: Date.now()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Thêm câu hỏi khảo sát</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Cấu hình câu hỏi để thu thập phản hồi</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
                    {/* Question content */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Nội dung câu hỏi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={2}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="VD: Bạn đánh giá chất lượng chương trình như thế nào?"
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all resize-none"
                        />
                    </div>

                    {/* Type selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Loại câu hỏi</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(TYPE_LABELS) as QuestionType[]).map(t => (
                                <button key={t} onClick={() => setType(t)}
                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                                        type === t ? "border-[#0092B8] bg-blue-50 text-[#0092B8]" : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}>
                                    <span className="text-base">{TYPE_ICONS[t]}</span>
                                    <span className="leading-tight">{TYPE_LABELS[t]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Options (for choice types) */}
                    {needsOptions && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                Các lựa chọn <span className="text-red-500">*</span>
                                <span className="text-gray-400 font-normal ml-2">(tối thiểu 2 lựa chọn)</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                {options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <GripVertical size={16} className="text-gray-300 shrink-0" />
                                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 ${type === "SINGLECHOICE" ? "rounded-full" : "rounded"} border-gray-300`} />
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={e => updateOption(i, e.target.value)}
                                            placeholder={`Lựa chọn ${i + 1}`}
                                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0092B8] transition-colors"
                                        />
                                        {options.length > 2 && (
                                            <button onClick={() => removeOption(i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addOption} className="flex items-center gap-2 text-sm font-semibold text-[#0092B8] hover:text-[#007a99] mt-1 w-fit">
                                    <Plus size={15} /> Thêm lựa chọn
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Required toggle */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-gray-700">Bắt buộc trả lời</span>
                            <span className="text-xs text-gray-400">Người dùng phải trả lời câu hỏi này</span>
                        </div>
                        <button onClick={() => setRequired(r => !r)}>
                            {required
                                ? <ToggleRight size={28} className="text-[#0092B8]" />
                                : <ToggleLeft size={28} className="text-gray-300" />}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200/50 rounded-xl transition-colors">
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!content.trim() || (needsOptions && options.filter(o => o.trim()).length < 2)}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                        Thêm câu hỏi
                    </button>
                </div>
            </div>
        </div>
    );
}
