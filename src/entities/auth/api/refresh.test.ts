import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { RefreshResponsePayload } from '@/entities/auth/types';
import { apiRequest } from '@/shared/api/apiRequest';
import { refresh } from './refresh';

vi.mock(import('@/shared/api/apiRequest'), () => ({
  apiRequest: vi.fn(),
}));

describe('refresh', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('provides a single refresh request on simultaneous calls', async () => {
    // Arrange
    const testRefreshResponse: RefreshResponsePayload = {
      token: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiresIn: 7200,
      refreshTokenExpiresAt: '2026-11-27T00:00:00.000Z',
    };
    const expectedRefreshResponses = [testRefreshResponse, testRefreshResponse];

    let resolvePendingRefresh!: (response: RefreshResponsePayload) => void;

    vi.mocked(apiRequest).mockReturnValueOnce(new Promise<RefreshResponsePayload>((resolve) => {
      resolvePendingRefresh = resolve;
    }));

    // Act
    const firstRefreshRequest = refresh();
    const secondRefreshRequest = refresh();

    // Assert
    expect(secondRefreshRequest).toBe(firstRefreshRequest);
    expect(apiRequest).toHaveBeenCalledExactlyOnceWith('/api/refresh', expect.anything(), expect.anything());

    // Act
    resolvePendingRefresh(testRefreshResponse);
    const responses = await Promise.all([firstRefreshRequest, secondRefreshRequest]);

    // Assert
    expect(responses).toEqual(expectedRefreshResponses);
  });
});
