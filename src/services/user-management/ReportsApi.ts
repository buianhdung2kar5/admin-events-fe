import apiClient from '../apiClient'
export const ReportsApi={
    getAllReports(page: number, size: number, sort?: string, status?: string){
        return apiClient.get('/reports', {params:{
            page: page,
            size: size,
            sort: sort,
            status: status
        }})
    },

    getReportById(id:number){
        return apiClient.get(`/reports/${id}`)
    },

    resolveReport(id:number){
        return apiClient.put(`/reports/${id}/resolve`)
    }
    
}