import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FeaturedApi, FEATURED_EVENTS_QUERY_KEY } from "../../../../services/events-management/FeaturedEventsApi";
import { UserPackageApi } from "../../../../services/finance/UserPackageApi";
import type {
    FeaturedApproveRequest,
    FeaturedCreateRequest,
    FeaturedEventListParams,
    FeaturedUpdateRequest,
} from "../../../../types/featured.types";

/** Danh sách sự kiện nổi bật (phân trang server) + các thao tác Admin; thao tác xong tải lại danh sách. */
export function useFeaturedEvents(params: FeaturedEventListParams) {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: FEATURED_EVENTS_QUERY_KEY });

    const query = useQuery({
        queryKey: [...FEATURED_EVENTS_QUERY_KEY, params],
        queryFn: () => FeaturedApi.list(params),
        placeholderData: keepPreviousData,
    });

    const approve = useMutation({
        mutationFn: ({ id, body }: { id: string; body: FeaturedApproveRequest }) => FeaturedApi.approve(id, body),
        onSuccess: invalidate,
    });
    const reject = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => FeaturedApi.reject(id, reason),
        onSuccess: invalidate,
    });
    const revoke = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => FeaturedApi.revoke(id, reason),
        onSuccess: invalidate,
    });
    const create = useMutation({
        mutationFn: (body: FeaturedCreateRequest) => FeaturedApi.create(body),
        onSuccess: invalidate,
    });
    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: FeaturedUpdateRequest }) => FeaturedApi.update(id, body),
        onSuccess: invalidate,
    });
    const revokePackage = useMutation({
        mutationFn: ({ userPackageId, reason }: { userPackageId: string; reason: string }) =>
            UserPackageApi.revoke(userPackageId, reason),
        onSuccess: invalidate,
    });

    return {
        page: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        approve: approve.mutateAsync,
        reject: reject.mutateAsync,
        revoke: revoke.mutateAsync,
        create: create.mutateAsync,
        update: update.mutateAsync,
        revokePackage: revokePackage.mutateAsync,
    };
}
