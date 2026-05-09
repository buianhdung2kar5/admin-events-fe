import apiClient, { ApiResponse } from "../apiClient";

export interface NewsItem {
    newsId: number;
    title: string;
    content: string;
    banner: string;
    tag: string;
    targetType: string;
    targetId: number | null;
    totalRewardCoin: number;
    remainingRewardCoin: number;
    rewardPerMinute: number;
    viewCount: number;
    createdTime: string;
}

export interface NewsResponse {
    content: NewsItem[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface createNewsData {
    title: string,
    content: string,
    bannerId:number,
    tag: string,
    targetType: string,
    targetId: number | null,
    totalRewardCoin:number,
    rewardPerMinute:number,
}

export const NewApi = {
    getAllNews:(page:number=0, size:number=20, sort:string[]):Promise<ApiResponse> => {
        return apiClient.get<any,ApiResponse>(`/news`,{params:{page,size,sort}})
    },

    createNews:(data:createNewsData):Promise<ApiResponse> => {
        return apiClient.post<any,ApiResponse>(`/news`,data)
    },


    deleteNews:(id:number):Promise<ApiResponse> => {
        return apiClient.delete<any,ApiResponse>(`/news/${id}`)
    },

    getNewsDetail:(id:number):Promise<ApiResponse> => {
        return apiClient.get<any,ApiResponse>(`/news/${id}`)
    },
    
}