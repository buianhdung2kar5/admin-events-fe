import { useState } from "react";
import { ArrowLeft, MessageSquare, BarChart2, List, Plus, Trash2, Star, X } from "lucide-react";
import { EventItem } from "../data/EventMockData";
import {
    FeedbackQuestion, Feedback, QuestionType,
    MockFeedbackQuestions, MockFeedbacks, getFeedbackStats
} from "../data/FeedbackMockData";
import FeedbackQuestionForm from "./FeedbackQuestionForm";

interface Props {
    event: EventItem;
    onBack: () => void;
}

type FeedbackTab = "questions" | "responses" | "stats";

const TYPE_BADGE: Record<QuestionType, { label: string; cls: string }> = {
    TEXT:          { label: "Văn bản",    cls: "bg-gray-100 text-gray-600" },
    RATING:        { label: "Sao",        cls: "bg-amber-50 text-amber-600" },
    SINGLECHOICE:  { label: "Chọn 1",     cls: "bg-blue-50 text-blue-600" },
    MULTIPLECHOICE:{ label: "Chọn nhiều", cls: "bg-purple-50 text-purple-600" }
};

const StarRating = ({ value }: { value: number }) => (
    <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(s => (
            <Star key={s} size={14} className={s <= value ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
        ))}
    </div>
);

export default function FeedbackPanel({ event, onBack }: Props) {
    const [activeTab, setActiveTab] = useState<FeedbackTab>("questions");
    const [questions, setQuestions] = useState<FeedbackQuestion[]>(
        MockFeedbackQuestions.filter(q => q.eventId === event.id)
    );
    const [feedbacks] = useState<Feedback[]>(
        MockFeedbacks.filter(f => f.eventId === event.id)
    );
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

    const stats = getFeedbackStats(event.id, questions, feedbacks);

    const handleAddQuestion = (q: FeedbackQuestion) => {
        setQuestions(prev => [...prev, q]);
    };

    const handleDeleteQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const tabs: { id: FeedbackTab; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: "questions",  label: "Câu hỏi",   icon: <List size={15} />,          count: questions.length },
        { id: "responses",  label: "Phản hồi",   icon: <MessageSquare size={15} />, count: feedbacks.length },
        { id: "stats",      label: "Thống kê",   icon: <BarChart2 size={15} /> },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Back Header */}
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-bold text-gray-800">Feedback & Khảo sát</h2>
                    <p className="text-sm text-gray-500 truncate max-w-[480px]">{event.title}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === tab.id ? "bg-[#0092B8] text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }`}>
                        {tab.icon} {tab.label}
                        {tab.count !== undefined && (
                            <span className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                                activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                            }`}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-[fadeIn_0.2s_ease]">

                {/* ── QUESTIONS ── */}
                {activeTab === "questions" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Danh sách câu hỏi khảo sát sau sự kiện</p>
                            <button onClick={() => setIsFormOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm">
                                <Plus size={16} /> Thêm câu hỏi
                            </button>
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
                                {questions.sort((a, b) => a.order - b.order).map((q, idx) => (
                                    <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                                            <div className="flex items-start gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-gray-800 flex-1">{q.content}</span>
                                                {q.required && (
                                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg shrink-0">Bắt buộc</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${TYPE_BADGE[q.type].cls}`}>
                                                    {TYPE_BADGE[q.type].label}
                                                </span>
                                                {q.options && (
                                                    <span className="text-xs text-gray-400">{q.options.join(" · ")}</span>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteQuestion(q.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── RESPONSES ── */}
                {activeTab === "responses" && (
                    <div className="flex flex-col gap-4">
                        {selectedFeedback ? (
                            /* Detail View */
                            <div className="flex flex-col gap-4">
                                <button onClick={() => setSelectedFeedback(null)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 w-fit">
                                    <ArrowLeft size={16} /> Quay lại danh sách
                                </button>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                                    {/* Respondent */}
                                    <div className="flex items-center gap-4">
                                        <img src={selectedFeedback.participantAvatar} alt="" className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50" />
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-gray-800">{selectedFeedback.participantName}</span>
                                            <span className="text-xs text-gray-400">{new Date(selectedFeedback.submittedAt).toLocaleString("vi-VN")}</span>
                                        </div>
                                        <div className="ml-auto flex flex-col items-end gap-1">
                                            <StarRating value={selectedFeedback.overallRating} />
                                            <span className="text-xs font-bold text-amber-500">{selectedFeedback.overallRating}/5</span>
                                        </div>
                                    </div>

                                    {selectedFeedback.comment && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-gray-700 italic">
                                            "{selectedFeedback.comment}"
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Chi tiết câu trả lời</h3>
                                        {selectedFeedback.answers.map((ans, i) => (
                                            <div key={i} className="flex flex-col gap-2">
                                                <p className="text-sm font-semibold text-gray-700">{i + 1}. {ans.questionContent}</p>
                                                {ans.type === "RATING" && ans.ratingValue !== undefined && (
                                                    <div className="flex items-center gap-2">
                                                        <StarRating value={ans.ratingValue} />
                                                        <span className="text-sm font-bold text-amber-500">{ans.ratingValue} sao</span>
                                                    </div>
                                                )}
                                                {ans.type === "TEXT" && (
                                                    <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">{ans.textValue || "—"}</p>
                                                )}
                                                {(ans.type === "SINGLECHOICE" || ans.type === "MULTIPLECHOICE") && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {ans.choiceValues?.map(cv => (
                                                            <span key={cv} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">{cv}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* List View */
                            <>
                                <p className="text-sm text-gray-500">{feedbacks.length} phản hồi đã nhận được</p>
                                {feedbacks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-dashed border-gray-200">
                                        <MessageSquare size={36} className="text-gray-300" />
                                        <p className="text-sm text-gray-400">Chưa có phản hồi nào</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {feedbacks.map(fb => (
                                            <button key={fb.id} onClick={() => setSelectedFeedback(fb)}
                                                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all text-left">
                                                <img src={fb.participantAvatar} alt="" className="w-10 h-10 rounded-xl border border-gray-100 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-800 text-sm">{fb.participantName}</p>
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">{fb.comment || "Không có nhận xét"}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <StarRating value={fb.overallRating} />
                                                    <span className="text-xs text-gray-400">{new Date(fb.submittedAt).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ── STATS ── */}
                {activeTab === "stats" && (
                    <div className="flex flex-col gap-5">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tổng phản hồi</span>
                                <span className="text-3xl font-black text-gray-800">{stats.totalFeedbacks}</span>
                            </div>
                            <div className="bg-amber-50 rounded-2xl border border-amber-100 shadow-sm p-5 flex flex-col gap-2">
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Điểm trung bình</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black text-amber-600">{stats.avgRating}</span>
                                    <span className="text-sm font-bold text-amber-400 mb-1">/ 5</span>
                                </div>
                                <StarRating value={Math.round(stats.avgRating)} />
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Câu hỏi</span>
                                <span className="text-3xl font-black text-gray-800">{questions.length}</span>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phân bố đánh giá tổng thể</h3>
                            {[...stats.ratingDist].reverse().map(rd => (
                                <div key={rd.star} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-14 shrink-0">
                                        <Star size={13} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-gray-600">{rd.star}</span>
                                    </div>
                                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all"
                                            style={{ width: stats.totalFeedbacks > 0 ? `${(rd.count / stats.totalFeedbacks) * 100}%` : "0%" }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 w-8 text-right">{rd.count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Choice question stats */}
                        {stats.questionStats.map((qs, i) => {
                            const maxVal = Math.max(...Object.values(qs.choiceCounts), 1);
                            return (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                                    <h3 className="text-sm font-bold text-gray-700">{qs.question}</h3>
                                    {Object.entries(qs.choiceCounts).map(([opt, cnt]) => (
                                        <div key={opt} className="flex items-center gap-3">
                                            <span className="text-xs text-gray-600 font-medium w-28 shrink-0 truncate" title={opt}>{opt}</span>
                                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#0092B8] rounded-full transition-all"
                                                    style={{ width: `${(cnt / maxVal) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 w-6 text-right">{cnt}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Question Modal */}
            {isFormOpen && (
                <FeedbackQuestionForm
                    eventId={event.id}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleAddQuestion}
                />
            )}
        </div>
    );
}
