import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PackageApi } from "../../../../services/finance/PackageApi";
import { getErrorMessage } from "../../../../services/apiError";
import type { PageResponse } from "../../../../types/api.types";
import type { PackageListParams, PackageResponse, PackageUpsertRequest } from "../../../../types/package.types";

const PACKAGES_QUERY_KEY = ["admin-packages"] as const;

export interface SavePackageInput {
    id: string | null;
    payload: PackageUpsertRequest;
}

interface UseAdminPackagesResult {
    page: PageResponse<PackageResponse> | undefined;
    isLoading: boolean;
    error: string | null;
    isMutating: boolean;
    savePackage: (input: SavePackageInput) => Promise<PackageResponse>;
    publishPackage: (id: string) => Promise<PackageResponse>;
    hidePackage: (id: string) => Promise<PackageResponse>;
    deletePackage: (id: string) => Promise<void>;
}

/** Danh sách gói (server-side filter + phân trang) và các thao tác của Admin. */
export function useAdminPackages(params: PackageListParams): UseAdminPackagesResult {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: PACKAGES_QUERY_KEY });

    const query = useQuery({
        queryKey: [...PACKAGES_QUERY_KEY, params],
        queryFn: () => PackageApi.getPackages(params),
    });

    const save = useMutation({
        mutationFn: ({ id, payload }: SavePackageInput) =>
            id ? PackageApi.updatePackage(id, payload) : PackageApi.createPackage(payload),
        onSuccess: invalidate,
    });
    const publish = useMutation({ mutationFn: PackageApi.publishPackage, onSuccess: invalidate });
    const hide = useMutation({ mutationFn: PackageApi.hidePackage, onSuccess: invalidate });
    const remove = useMutation({ mutationFn: PackageApi.deletePackage, onSuccess: invalidate });

    return {
        page: query.data,
        isLoading: query.isLoading,
        error: query.error ? getErrorMessage(query.error, "Không tải được danh sách gói") : null,
        isMutating: save.isPending || publish.isPending || hide.isPending || remove.isPending,
        savePackage: save.mutateAsync,
        publishPackage: publish.mutateAsync,
        hidePackage: hide.mutateAsync,
        deletePackage: remove.mutateAsync,
    };
}
