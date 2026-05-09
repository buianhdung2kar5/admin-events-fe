import apiClient, { ApiResponse } from "../apiClient";

export const FeaturedApi = {
   getAllFeaturedEvents(
    page:number=0,
    size:number=20,
   ):Promise<ApiResponse>  {
    return apiClient.get<any,ApiResponse>('/featured-events/admin',{params:{page,size}})
   },
   getFeaturedEventById(id:number):Promise<ApiResponse>  {
    return apiClient.get<any,ApiResponse>(`/featured-events/admin/${id}`)
   },
   
   createFeaturedEvent(
        eventId:number,
        priority:number,
        startDate:Date,
        endDate:Date
   ):Promise<ApiResponse>  {
    return apiClient.post<any,ApiResponse>('/featured-events',{
        eventId,
        priority,
        startDate,
        endDate
    })
   },

   updateFeaturedEvent(
        id:number,
        priority:number,
        startDate:Date,
        endDate:Date
   ):Promise<ApiResponse>  {
    return apiClient.put<any,ApiResponse>(`/featured-events/${id}`,{
        priority,
        startDate,
        endDate
    })
   },
   
   deleteFeaturedEvent(idArray:number[]):Promise<ApiResponse>  {
    return apiClient.delete<any,ApiResponse>(`/featured-events`,{data:idArray})
   }
}