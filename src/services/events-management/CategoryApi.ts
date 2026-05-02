import apiClient, { ApiResponse } from '../apiClient'

export const CategoryApi = {
    getAllCategory(
        page:number=0,
        size:number=20
    ):Promise<ApiResponse>{      
        return apiClient.get<any, ApiResponse>('/categories', { params: { page, size } });
    },
    getCategoryById(id:number):Promise<ApiResponse>{
        return apiClient.get<any, ApiResponse>(`/categories/${id}`)
    },
    getCategoryOptions(id:number):Promise<ApiResponse>{
        return apiClient.get<any, ApiResponse>(`/categories/${id}/options`)
    },

    createCategory(data:{
        name:string,
        type:string
    }):Promise<ApiResponse>{
        return apiClient.post('/categories',data)
    },
    createCategoryOption(value:string, id:number):Promise<ApiResponse>{
        return apiClient.post(`/categories/${id}/options`,{value:value})
    },

    updateCategory(id:number, data:{
        name:string,
        type:string
    }):Promise<ApiResponse>{
        return apiClient.put(`/categories/${id}`,data)
    },
    updateCategoryOption(data:{
        value:string,
        idCategory:number,
        idOption:number
    }):Promise<ApiResponse>{
        const {value, idCategory, idOption}= data
        return apiClient.put<any, ApiResponse>(`/categories/${idCategory}/options/${idOption}`,{value:value})
    },
    deleteCategory(idArray:number[]):Promise<ApiResponse>{
        return apiClient.delete<any, ApiResponse>(`/categories`, { data: idArray })
    },
    deleteCategoryOption(idArray:number[], idCategory:number):Promise<ApiResponse>{
        return apiClient.delete<any, ApiResponse>(`/categories/${idCategory}/options`, { data: idArray})
    }
}