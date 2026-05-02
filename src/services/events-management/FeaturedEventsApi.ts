import apiClient from "../apiClient";

export const FeaturedApi = {
   getAllFeaturedEvents(
    page:number=0,
    size:number=20,
   )   {
    return apiClient.get('/featured-events/admin',{params:{page,size}})
   },
   getFeaturedEventById(id:number){
    return apiClient.get(`/featured-events/admin/${id}`)
   },
   
   createFeaturedEvent(
        eventId:number,
        priority:number,
        startDate:Date,
        endDate:Date
   ){
    return apiClient.post('/featured-events',{
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
   ){
    return apiClient.put(`/featured-events/${id}`,{
        priority,
        startDate,
        endDate
    })
   },
   
   deleteFeaturedEvent(idArray:number[]){
    return apiClient.delete(`/featured-events`,{data:{ids:idArray}})
   }
}