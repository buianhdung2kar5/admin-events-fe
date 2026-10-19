import apiClient from "../apiClient";
import { ApiResponse } from "../apiClient";

export const financeApi= {

    getAllFinance: (page:number=0, size:number=10, sort?:string[]):Promise<ApiResponse>=>{
        const params = {
            page,
            size,
            sort
        }
        return apiClient.get<any, ApiResponse>("/finance/transactions",{params})
    }
    
}