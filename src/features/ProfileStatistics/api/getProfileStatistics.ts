import { protectedGraphqlFetch } from '@/shared/api/protectedGraphqlFetch';
import { profileStatisticsResponseSchema, profileStatisticsSchema } from '../schema';
import type { ProfileStatisticsQueryData } from '../types';

const GET_PROFILE_STATISTICS_QUERY = `
  query GetProfileStatistics {
    mePosts {
      id
      creationDate
    }

    meLikes {
      id
      creationDate
    }

    meComments {
      id
      creationDate
    }
  }
`;

export async function getProfileStatistics(signal?: AbortSignal): Promise<ProfileStatisticsQueryData> {
  const response = await protectedGraphqlFetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: GET_PROFILE_STATISTICS_QUERY }),
    signal,
  });

  const responseBody: unknown = await response.json();
  const parsedResponseBody = profileStatisticsResponseSchema.safeParse(responseBody);

  if (!parsedResponseBody.success) {
    throw new Error('Response body is malformed', {
      cause: parsedResponseBody.error,
    });
  }

  if (!response.ok || parsedResponseBody.data.errors?.length) {
    throw new Error('Unable to load profile statistics');
  }

  const parsedStatistics = profileStatisticsSchema.safeParse(parsedResponseBody.data.data);

  if (!parsedStatistics.success) {
    throw new Error('Statistics shape is malformed', {
      cause: parsedStatistics.error,
    });
  }

  return parsedStatistics.data;
}
