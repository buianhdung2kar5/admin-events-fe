import apiClient, { ApiResponse } from "../apiClient";

export const VerificationDocumentApi={
    getAllDocumentVerify(
        page:number,
        size:number,
        sort:string[],
        status?:string,
    ):Promise<ApiResponse>{
        return apiClient.get<any, ApiResponse>('/verification-documents',{params:{page,size,sort,status}})
    },
    getDocumentVerifyById(id:number):Promise<ApiResponse>{
        return apiClient.get<any, ApiResponse>(`/verification-documents/${id}`) 
    },

    approvedDocumentVerify(id:number):Promise<ApiResponse>{
        return apiClient.put<any, ApiResponse>(`/verification-documents/${id}/approve`,
            {status:"APPROVED"}
        )
    },

    
}