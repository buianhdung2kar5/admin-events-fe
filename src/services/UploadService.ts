import { http } from "./apiClient";

/** Khớp backend MediaResponse (POST /files) — giữ `mediaId` nếu cần xóa file sau. */
export interface MediaResult {
    mediaId: string;
    fileUrl: string;
    publicId: string;
    contentType: string;
    fileSize: number;
    folder: string;
    fileName: string;
}

export const UploadService = {
    /** POST /files (multipart) — `folder` là thư mục lưu trên Cloudinary */
    uploadImage: (file: File, folder: string): Promise<MediaResult> => {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<MediaResult>("/files", formData, {
            params: { folder },
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    /** DELETE /files/{mediaId} — chỉ xóa được file do chính mình upload (khác → 404) */
    deleteFile: (mediaId: string): Promise<void> => http.delete(`/files/${mediaId}`),
};
