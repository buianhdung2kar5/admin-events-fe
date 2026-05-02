import apiClient, { ApiResponse } from "../apiClient";

export const SystemManagementApi= {

    getActivityAccount(
        page:number=0,
        size:number=20,
        sort:string[],        
    ){
        return apiClient.get('/admin/users/activity', {params: {page,size,sort}})
    },

    getHeapStatistics(){
        return apiClient.get("/admin/statistics")
    },

    buldSuspend(data:any): Promise<ApiResponse>{
        return apiClient.post<any, ApiResponse>("/admin/bulk-action",data)
    }

}