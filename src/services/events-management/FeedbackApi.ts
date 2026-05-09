import apiClient, { ApiResponse } from "../apiClient"
export const FeedbackApi  = {
    getAllFeedbackByEventId: (eventId: string,page:number=0,size:number=20):Promise<ApiResponse> => apiClient.get<any, ApiResponse>(`/feedbacks/${eventId}`,{params:{page,size}}),

    getAllQuestionByEventId: (eventId: string,page:number=0,size:number=20):Promise<ApiResponse> => apiClient.get<any, ApiResponse>(`/feedback-questions/${eventId}`,{params:{page,size}}),
 

    createQuestion: (data: any):Promise<ApiResponse> => apiClient.post<any, ApiResponse>(`/feedback-questions`, data),
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