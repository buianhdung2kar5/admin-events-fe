import apiClient, { ApiResponse } from "../apiClient"
export const FeedbackApi = {
    getAllFeedbackByEventId: (eventId: string, page: number = 0, size: number = 20): Promise<ApiResponse> => apiClient.get<any, ApiResponse>(`/feedbacks`, { params: { eventId, page, size } }),
    getFeedbackById: (feedbackId: string): Promise<ApiResponse> => apiClient.get<any, ApiResponse>(`/feedbacks/${feedbackId}`),
    getAllQuestionByEventId: (eventId: string, page: number = 0, size: number = 20): Promise<ApiResponse> => apiClient.get<any, ApiResponse>(`/feedback-questions`, { params: { eventId, page, size } }),
    getQuestionById: (questionId: string): Promise<ApiResponse> => apiClient.get<any, ApiResponse>(`/feedback-questions/${questionId}`),

    createQuestion: (data: QuestionData): Promise<ApiResponse> => apiClient.post<any, ApiResponse>(`/feedback-questions`, data),

    deleteQuestion: (questionId: number[]): Promise<ApiResponse> => apiClient.delete<any, ApiResponse>(`/feedback-questions`, { data: questionId }),


}

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