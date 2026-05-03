import apiClient, { ApiResponse } from '../apiClient'

export const ReportsManagement = {
    getAllReports(page?: number, size?: number, sort?: string[]): Promise<ApiResponse> {
        return apiClient.get<any, ApiResponse>('/reports', { params: { page, size, sort } })
    },
    getReportById(id:number):Promise<ApiResponse>{
        return apiClient.get<any, ApiResponse>(`/reports/${id}`)
    },
    resolveReport(id:number):Promise<ApiResponse>{
        return apiClient.post<any, ApiResponse>(`/reports/${id}/resolve`)
    }
}