import { apolloClient } from '@/repositories/graphql/client';
import { GET_LIVE_GRAND_PRIX_BY_ID } from '@/repositories/graphql/queries/liveGrandPrix';
import { LiveGrandPrix } from '@/models/features/LiveGrandPrix';

interface LiveGrandPrixByIdResponse {
  liveGrandPrixById: LiveGrandPrix;
}

export const liveGrandPrixCatalogService = {
  async getById(id: string | undefined | null): Promise<LiveGrandPrix | null> {
    if (!id) return null;
    const { data } = await apolloClient.query<LiveGrandPrixByIdResponse>({
      query: GET_LIVE_GRAND_PRIX_BY_ID,
      variables: { id },
      fetchPolicy: 'cache-first',
    });
    return data.liveGrandPrixById ?? null;
  },
};
