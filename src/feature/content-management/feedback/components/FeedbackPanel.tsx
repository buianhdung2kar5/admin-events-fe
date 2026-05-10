import { useState } from "react";
import { ArrowLeft, MessageSquare, BarChart2, List, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
    FeedbackQuestion, Feedback, getFeedbackStats
} from "../data/FeedbackMockData";
import { FeedbackApi } from "../../../../services/events-management/FeedbackApi";
import FeedbackQuestionForm from "./FeedbackQuestionForm";
import Toast from "../../../../components/common/Toast";
import FeedbackQuestionsTab from "./FeedbackQuestionsTab";
import FeedbackResponsesTab from "./FeedbackResponsesTab";
import FeedbackStatsTab from "./FeedbackStatsTab";

interface Props {
    event: any;
    onBack: () => void;
}

type FeedbackTab = "questions" | "responses" | "stats";

export default function FeedbackPanel({ event, onBack }: Props) {
    const queryClient = useQueryClient();
    const eventIdStr = event.eventId || event.id;

    // Fetch questions
    const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
        queryKey: ["feedbackQuestions", eventIdStr],
        queryFn: async () => {
            const res = await FeedbackApi.getAllQuestionByEventId(eventIdStr);
            if (res.statusCode === 200) {
                return res.object?.content || res.object || [];
            }
            return [];
        }
    });

    // Fetch feedbacks
    const { data: feedbacksData, isLoading: isLoadingFeedbacks } = useQuery({
        queryKey: ["feedbacks", eventIdStr],
        queryFn: async () => {
            const res = await FeedbackApi.getAllFeedbackByEventId(eventIdStr);
            if (res.statusCode === 200) {
                return res.object?.content || res.object || [];
            }
            return [];
        }
    });

    const questions: FeedbackQuestion[] = questionsData || [];
    
    const feedbacks: Feedback[] = feedbacksData || [];

    const [activeTab, setActiveTab] = useState<FeedbackTab>("questions");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

    const toggleSelectQuestion = (id: number) => {
        setSelectedQuestionIds(prev => prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]);
    };

    const toggleSelectAllQuestions = () => {
        if (selectedQuestionIds.length === questions.length) {
            setSelectedQuestionIds([]);
        } else {
            setSelectedQuestionIds(questions.map(q => q.feedbackQuestionId));
        }
    };

    const handleBulkDeleteQuestions = async () => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedQuestionIds.length} câu hỏi đã chọn?`)) return;
        try {
            setIsMutating(true);
            const res = await FeedbackApi.deleteQuestion(selectedQuestionIds);
            if (res.statusCode === 200) {
                queryClient.invalidateQueries({ queryKey: ["feedbackQuestions", eventIdStr] });
                notify("Xóa câu hỏi thành công!", true);
                setSelectedQuestionIds([]);
            } else {
                notify("Xóa câu hỏi thất bại!", false);
            }
        } catch (error) {
            console.error("Error bulk deleting questions", error);
            notify("Đã xảy ra lỗi khi xóa câu hỏi!", false);
        } finally {
            setIsMutating(false);
        }
    };

    const { data: selectedFeedbackData, isLoading: isLoadingFeedbackDetail } = useQuery({
        queryKey: ["feedbackDetail", selectedFeedbackId],
        queryFn: async () => {
            if (!selectedFeedbackId) return null;
            const res = await FeedbackApi.getFeedbackById(selectedFeedbackId.toString());
            return res.statusCode === 200 ? res.object as Feedback : null;
        },
        enabled: !!selectedFeedbackId
    });

    const notify = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const isLoading = isLoadingQuestions || isLoadingFeedbacks || isMutating || isLoadingFeedbackDetail;

    const stats = getFeedbackStats(eventIdStr, questions, feedbacks);

    const handleAddQuestion = async (q: FeedbackQuestion) => {
        try {
            setIsMutating(true);
            const payload = {
                eventId: event.eventId || event.id,
                questionContent: q.questionContent,
                questionType: q.questionType,
                options: q.options?.map(o => ({ optionValue: o.optionValue })) || [],
                isRequired: q.isRequired
            };
            const res = await FeedbackApi.createQuestion(payload);
            if (res.statusCode === 200 || res.statusCode === 201) {
                queryClient.invalidateQueries({ queryKey: ["feedbackQuestions", eventIdStr] });
                notify("Thêm câu hỏi thành công!", true);
            } else {
                notify("Thêm câu hỏi thất bại!", false);
            }
        } catch (error) {
            console.error("Error creating question", error);
            notify("Đã xảy ra lỗi khi thêm câu hỏi!", false);
        } finally {
            setIsMutating(false);
        }
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
        try {
            setIsMutating(true);
            const res = await FeedbackApi.deleteQuestion([id]);
            if (res.statusCode === 200) {
                queryClient.invalidateQueries({ queryKey: ["feedbackQuestions", eventIdStr] });
                notify("Xóa câu hỏi thành công!", true);
            } else {
                notify("Xóa câu hỏi thất bại!", false);
            }
        } catch (error) {
            console.error("Error deleting question", error);
            notify("Đã xảy ra lỗi khi xóa câu hỏi!", false);
        } finally {
            setIsMutating(false);
        }
    };

    const tabs: { id: FeedbackTab; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: "questions",  label: "Câu hỏi",   icon: <List size={15} />,          count: questions.length },
        { id: "responses",  label: "Phản hồi",   icon: <MessageSquare size={15} />, count: feedbacks.length },
        { id: "stats",      label: "Thống kê",   icon: <BarChart2 size={15} /> },
    ];

    return (
        <div className="flex flex-col gap-5 relative min-h-[400px]">
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
                    <Loader2 className="animate-spin text-[#0092B8]" size={36} />
                </div>
            )}
            
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
                    <FeedbackQuestionsTab
                        questions={questions}
                        selectedQuestionIds={selectedQuestionIds}
                        toggleSelectAllQuestions={toggleSelectAllQuestions}
                        toggleSelectQuestion={toggleSelectQuestion}
                        handleBulkDeleteQuestions={handleBulkDeleteQuestions}
                        setIsFormOpen={setIsFormOpen}
                        handleDeleteQuestion={handleDeleteQuestion}
                    />
                )}

                {/* ── RESPONSES ── */}
                {activeTab === "responses" && (
                    <FeedbackResponsesTab
                        feedbacks={feedbacks}
                        selectedFeedbackId={selectedFeedbackId}
                        setSelectedFeedbackId={setSelectedFeedbackId}
                        selectedFeedbackData={selectedFeedbackData}
                    />
                )}

                {/* ── STATS ── */}
                {activeTab === "stats" && (
                    <FeedbackStatsTab
                        stats={stats}
                        questions={questions}
                    />
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

            {toast && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Toast toast={toast} onClose={() => setToast(null)} />
                </div>
            )}
        </div>
    );
}
