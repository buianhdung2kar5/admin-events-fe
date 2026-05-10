import apiClient, { ApiResponse } from "../apiClient";

export const AttendanceApi = {
    getLogsAttendance: (eventId: string, page: number = 0, size: number = 20): Promise<ApiResponse> => {
        return apiClient.get<any, ApiResponse>(`attendances`,{params: {eventId, page, size}})
    },

    getAttendanceById: (id: string): Promise<ApiResponse> => {
        return apiClient.get<any, ApiResponse>(`attendances/${id}`)
    },

    putAttendance: (id: string, data: any): Promise<ApiResponse> => {
        return apiClient.put<any, ApiResponse>(`attendances/${id}`, data)
    },

    deleteAttendance: (id: string): Promise<ApiResponse> => {
        return apiClient.delete<any, ApiResponse>(`attendances/${id}`)
    },

    
}   
