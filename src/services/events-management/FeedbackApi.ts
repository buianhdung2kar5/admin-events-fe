import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/** Backend CHƯA có API phản hồi sự kiện — giữ nguyên path cũ, chỉ khớp interceptor mới. */
export const FeedbackApi = {
    getAllFeedbackByEventId: <T = unknown>(eventId: string, page: number = 0, size: number = 20): Promise<LegacyPage<T>> =>
        http.get<LegacyPage<T>>("/feedbacks", { params: { eventId, page, size } }),
    getFeedbackById: <T = unknown>(feedbackId: string): Promise<T> => http.get<T>(`/feedbacks/${feedbackId}`),
    getAllQuestionByEventId: <T = unknown>(eventId: string, page: number = 0, size: number = 20): Promise<LegacyPage<T>> =>
        http.get<LegacyPage<T>>("/feedback-questions", { params: { eventId, page, size } }),
    getQuestionById: <T = unknown>(questionId: string): Promise<T> => http.get<T>(`/feedback-questions/${questionId}`),
    createQuestion: (data: QuestionData): Promise<unknown> => http.post<unknown>("/feedback-questions", data),
    deleteQuestion: (questionId: number[]): Promise<void> => http.delete("/feedback-questions", { data: questionId }),
};

export interface QuestionOption {
    optionValue: string;
}

export interface QuestionData {
    eventId: number;
    questionContent: string;
    questionType: string;
    options: QuestionOption[];
    isRequired: boolean;
}
