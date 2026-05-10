import { Plus, Trash2, MessageSquare } from "lucide-react";
import { FeedbackQuestion, QuestionType } from "../data/FeedbackMockData";
import { TYPE_BADGE } from "./FeedbackShared";

interface Props {
    questions: FeedbackQuestion[];
    selectedQuestionIds: number[];
    toggleSelectAllQuestions: () => void;
    toggleSelectQuestion: (id: number) => void;
    handleBulkDeleteQuestions: () => void;
    setIsFormOpen: (v: boolean) => void;
    handleDeleteQuestion: (id: number) => void;
}

export default function FeedbackQuestionsTab({
    questions,
    selectedQuestionIds,
    toggleSelectAllQuestions,
    toggleSelectQuestion,
    handleBulkDeleteQuestions,
    setIsFormOpen,
    handleDeleteQuestion
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">Danh sách câu hỏi khảo sát sau sự kiện</p>
                    {questions.length > 0 && (
                        <button onClick={toggleSelectAllQuestions}
                            className="text-xs font-semibold text-[#0092B8] hover:underline">
                            {selectedQuestionIds.length === questions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {selectedQuestionIds.length > 0 && (
                        <button onClick={handleBulkDeleteQuestions}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm">
                            <Trash2 size={16} /> Xóa ({selectedQuestionIds.length})
                        </button>
                    )}
                    <button onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm">
                        <Plus size={16} /> Thêm câu hỏi
                    </button>
                </div>
            </div>

            {questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-dashed border-gray-200">
                    <MessageSquare size={36} className="text-gray-300" />
                    <p className="text-sm font-semibold text-gray-400">Chưa có câu hỏi nào</p>
                    <button onClick={() => setIsFormOpen(true)} className="text-sm font-bold text-[#0092B8] hover:underline">
                        + Tạo câu hỏi đầu tiên
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {questions.map((q, idx) => (
                        <div key={q.feedbackQuestionId} className={`bg-white rounded-2xl border ${selectedQuestionIds.includes(q.feedbackQuestionId) ? "border-[#0092B8] bg-blue-50/20" : "border-gray-100"} shadow-sm px-5 py-4 flex items-start gap-4 hover:shadow-md transition-all`}>
                            <input
                                type="checkbox"
                                checked={selectedQuestionIds.includes(q.feedbackQuestionId)}
                                onChange={() => toggleSelectQuestion(q.feedbackQuestionId)}
                                className="w-4 h-4 mt-1.5 accent-[#0092B8] cursor-pointer shrink-0"
                            />
                            <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0 mt-0.5">
                                {idx + 1}
                            </span>
                            <div className="flex-1 flex flex-col gap-2 min-w-0">
                                <div className="flex items-start gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-gray-800 flex-1">{q.questionContent}</span>
                                    {q.isRequired && (
                                        <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg shrink-0">Bắt buộc</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${TYPE_BADGE[q.questionType as QuestionType]?.cls || ''}`}>
                                        {TYPE_BADGE[q.questionType as QuestionType]?.label || q.questionType}
                                    </span>
                                    {q.options && q.options.length > 0 && (
                                        <span className="text-xs text-gray-400">{q.options.map(o => o.optionValue).join(" · ")}</span>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => handleDeleteQuestion(q.feedbackQuestionId)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
