import { apolloClient } from '@/repositories/graphql/client';
import { GET_GRADE_CHALLENGE_BY_ID } from '@/repositories/graphql/queries/gradeChallenge';
import { GradeChallenge } from '@/models/grade-challenge/GradeChallenge';

interface GradeChallengeByIdResponse {
  gradeChallengeById: GradeChallenge;
}

export const gradeChallengeCatalogService = {
  async getById(id: string | undefined | null): Promise<GradeChallenge | null> {
    if (!id) return null;
    const { data } = await apolloClient.query<GradeChallengeByIdResponse>({
      query: GET_GRADE_CHALLENGE_BY_ID,
      variables: { id },
      fetchPolicy: 'cache-first',
    });
    return data.gradeChallengeById ?? null;
  },
};
