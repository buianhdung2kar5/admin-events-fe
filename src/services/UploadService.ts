import apiClient, { ApiResponse } from "./apiClient";

export const UploadService = {
    uploadImage: (file: File, type: string) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post<any, ApiResponse>(`/upload`, formData, {
            params: { type },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
}