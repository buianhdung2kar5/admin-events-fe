import apiClient, { ApiResponse } from "../apiClient"

export const RecruitmentApi = {
    getAllRecruitment: (page: number = 0, size: number = 20, sort: string[]): Promise<ApiResponse> => {
        return apiClient.get<any, ApiResponse>("/recruitments", { params: { page, size, sort } })
    },

    getRecruitmentById: (id: string): Promise<ApiResponse> => {
        return apiClient.get<any, ApiResponse>(`/recruitments/${id}`)
    },

    putRecruitment:(id:string, data:any):Promise<ApiResponse> => {
        return apiClient.put<any, ApiResponse>(`/recruitments/${id}`, data)
    },

    patchRecruitment: (id:string):Promise<ApiResponse> => {
        return apiClient.patch<any, ApiResponse>(`/recruitment/${id}/close`)
    },

    deleteRecruitment: (id:string):Promise<ApiResponse> => {
        return apiClient.delete<any, ApiResponse>(`/recruitment/${id}`)
    },
}