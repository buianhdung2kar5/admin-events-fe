import apiClient, { ApiResponse } from '../apiClient'
export const EventsApi={
    getAll(
        page:number=0,
        size:number=20,
        keyword?:string,
        categoryId?:number,
        status?:string,
        startDateFrom?:string,
    ):Promise<ApiResponse> {
        return apiClient.get<any,ApiResponse>('/events', { params: { keyword, categoryId, status, startDateFrom, page, size } });
    },
    getStatisticEvent(id:string):Promise<ApiResponse> {
        return apiClient.get<any,ApiResponse>(`/events/${id}/statistics`)
        
    },
    getAnalyticsEvent(id:string):Promise<ApiResponse> {
        return apiClient.get<any,ApiResponse>(`/events/${id}/analytics`)
    },
    getFeatureEvents():Promise<ApiResponse> {
        return apiClient.get<any,ApiResponse>(`/events/featured`)
    },
    updateEventById(id:string,data:any):Promise<ApiResponse> {
        return apiClient.put<any,ApiResponse>(`/events/${id}`,data)
    },
    publishEvent(id:string):Promise<ApiResponse> {
        return apiClient.post<any,ApiResponse>(`/events/${id}/publish`)
    },
    createEvent(data:any):Promise<ApiResponse> {
        return apiClient.post<any,ApiResponse>('/events',data)
    },
     deleteEventById(id:string):Promise<ApiResponse> {
        return apiClient.delete<any,ApiResponse>(`/events/${id}`)
    },
    getById(id: string): Promise<ApiResponse> {
        return apiClient.get<any, ApiResponse>(`/events/${id}`);
    },
}