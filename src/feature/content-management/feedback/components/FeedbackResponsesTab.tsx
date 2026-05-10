import { ArrowLeft, MessageSquare } from "lucide-react";
import { Feedback } from "../data/FeedbackMockData";
import { StarRating } from "./FeedbackShared";

interface Props {
    feedbacks: Feedback[];
    selectedFeedbackId: number | null;
    setSelectedFeedbackId: (id: number | null) => void;
    selectedFeedbackData: Feedback | null | undefined;
}

export default function FeedbackResponsesTab({
    feedbacks,
    selectedFeedbackId,
    setSelectedFeedbackId,
    selectedFeedbackData
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            {selectedFeedbackId ? (
                /* Detail View */
                <div className="flex flex-col gap-4">
                    <button onClick={() => setSelectedFeedbackId(null)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 w-fit">
                        <ArrowLeft size={16} /> Quay lại danh sách
                    </button>
                    {selectedFeedbackData && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                        {/* Respondent */}
                        <div className="flex items-center gap-4">
                            <img src={selectedFeedbackData.eventParticipant?.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous"} alt="" className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50" />
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-gray-800">{selectedFeedbackData.eventParticipant?.user?.fullName || "Ẩn danh"}</span>
                                <span className="text-xs text-gray-400">{new Date(selectedFeedbackData.createdTime).toLocaleString("vi-VN")}</span>
                            </div>
                            <div className="ml-auto flex flex-col items-end gap-1">
                                {(() => {
                                    const ratings = selectedFeedbackData.feedbackAnswers?.filter(a => a.questionType === "RATING") || [];
                                    const avg = ratings.length > 0 ? Math.round(ratings.reduce((s, a) => s + parseInt(a.answerValue || "0", 10), 0) / ratings.length) : 0;
                                    return (
                                        <>
                                            <StarRating value={avg} />
                                            <span className="text-xs font-bold text-amber-500">{avg}/5</span>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {selectedFeedbackData.comment && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-gray-700 italic">
                                "{selectedFeedbackData.comment}"
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Chi tiết câu trả lời</h3>
                            {selectedFeedbackData.feedbackAnswers?.map((ans: any, i: number) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <p className="text-sm font-semibold text-gray-700">{i + 1}. {ans.questionText}</p>
                                    {ans.questionType === "RATING" && ans.answerValue !== undefined && (
                                        <div className="flex items-center gap-2">
                                            <StarRating value={parseInt(ans.answerValue, 10)} />
                                            <span className="text-sm font-bold text-amber-500">{ans.answerValue} sao</span>
                                        </div>
                                    )}
                                    {ans.questionType === "TEXT" && (
                                        <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">{ans.answerValue || "—"}</p>
                                    )}
                                    {(ans.questionType === "SINGLECHOICE" || ans.questionType === "MULTIPLECHOICE") && (
                                        <div className="flex flex-wrap gap-2">
                                            {ans.answerValue?.split(",").map((cv: string) => cv.trim()).filter(Boolean).map((cv: string) => (
                                                <span key={cv} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">{cv}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
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
                            {feedbacks.map(fb => {
                                const ratings = fb.feedbackAnswers?.filter(a => a.questionType === "RATING") || [];
                                const avg = ratings.length > 0 ? Math.round(ratings.reduce((s, a) => s + parseInt(a.answerValue || "0", 10), 0) / ratings.length) : 0;
                                return (
                                    <button key={fb.attendanceFeedbackId} onClick={() => setSelectedFeedbackId(fb.attendanceFeedbackId)}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all text-left">
                                        <img src={fb.eventParticipant?.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous"} alt="" className="w-10 h-10 rounded-xl border border-gray-100 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 text-sm">{fb.eventParticipant?.user?.fullName || "Ẩn danh"}</p>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{fb.comment || "Không có nhận xét"}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <StarRating value={avg} />
                                            <span className="text-xs text-gray-400">{new Date(fb.createdTime).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
