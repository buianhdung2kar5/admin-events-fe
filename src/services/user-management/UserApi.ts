import apiClient, { ApiResponse } from "../apiClient";

const UserApi = {
  getAllUsers(
    page: number = 0,
    size: number = 20,
    search?: string,
    sortBy: string='createdTime',
    sortDirection?: string,
    role?: string,
    status?: string,
  ): Promise<ApiResponse> {
    return apiClient.get<any, ApiResponse>("/users", { params: { page, size, search, sortBy, sortDirection, role, status } });
  },
  getUserById(id: string): Promise<ApiResponse> {
    return apiClient.get<any, ApiResponse>(`/users/${id}`);
  },
  updateUser(id: string, data: any): Promise<ApiResponse> {
    return apiClient.put<any, ApiResponse>(`/users/${id}`, data);
  },

  deleteUser(id: string): Promise<ApiResponse> {
    return apiClient.delete<any, ApiResponse>(`/users/${id}`);
  }
  
};

export default UserApi;