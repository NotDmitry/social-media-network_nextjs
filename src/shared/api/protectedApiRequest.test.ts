import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import { BackendResponseError } from './backendResponseError';
import { apiRequest } from './apiRequest';
import { authSession } from './authSession';
import { protectedApiRequest } from './protectedApiRequest';

vi.mock(import('./apiRequest'), () => ({
  apiRequest: vi.fn(),
}));

describe('protectedApiRequest', () => {
  const fallbackErrorMessage = 'User fetch is unavailable';
  const testUserResponseSchema = z.object({
    id: z.int().nonnegative(),
    username: z.string(),
  });

  type TestUser = z.infer<typeof testUserResponseSchema>;

  const testUser = Object.freeze<TestUser>({
    id: 123,
    username: '@john',
  });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authSession, 'getSavedAccessToken');
    vi.spyOn(authSession, 'refreshExpiredAccessToken').mockResolvedValue(undefined);
    vi.spyOn(authSession, 'invalidate').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('sends saved access token over protected request', async () => {
    // Arrange
    const testValidAccessToken = 'valid-access-token';
    const expectedHeader = `Bearer ${testValidAccessToken}`;
    vi.mocked(authSession.getSavedAccessToken).mockReturnValue(testValidAccessToken);
    vi.mocked(apiRequest).mockResolvedValueOnce(testUser);

    // Act
    await protectedApiRequest(
      '/api/test-user',
      {
        method: 'GET',
      },
      {
        responseValidationSchema: testUserResponseSchema,
        fallbackErrorMessage,
      }
    );

    // Assert
    expect(apiRequest).toHaveBeenCalledOnce();
    const requestArgs = vi.mocked(apiRequest).mock.calls[0];
    const actualHeader = new Headers(requestArgs[1].headers).get('Authorization');
    expect(actualHeader).toEqual(expectedHeader);
  });

  test('refreshes expired access token and retries the request once', async () => {
    // Arrange
    const testExpiredAccessToken = 'expired-access-token';
    const testRenewedAccessToken = 'renewed-access-token';
    const expectedInitialRequestHeader = `Bearer ${testExpiredAccessToken}`;
    const expectedRetryRequestHeader = `Bearer ${testRenewedAccessToken}`;

    const testExpiredTokenError = new BackendResponseError({
      message: 'Token expired',
      status: 401,
      code: 'TOKEN_EXPIRED',
    });

    vi.mocked(authSession.getSavedAccessToken)
      .mockReturnValueOnce(testExpiredAccessToken)
      .mockReturnValueOnce(testRenewedAccessToken);
    vi.mocked(apiRequest)
      .mockRejectedValueOnce(testExpiredTokenError)
      .mockResolvedValueOnce(testUser);

    // Act
    await protectedApiRequest(
      '/api/test-user',
      {
        method: 'GET',
      },
      {
        responseValidationSchema: testUserResponseSchema,
        fallbackErrorMessage,
      }
    );

    // Assert
    expect(apiRequest).toHaveBeenCalledTimes(2);
    expect(authSession.refreshExpiredAccessToken).toHaveBeenCalledExactlyOnceWith(testExpiredAccessToken);
    const initialRequestArgs = vi.mocked(apiRequest).mock.calls[0];
    const retryRequestArgs = vi.mocked(apiRequest).mock.calls[1];
    const actualInitialHeader = new Headers(initialRequestArgs[1].headers).get('Authorization');
    const actualRetryHeader = new Headers(retryRequestArgs[1].headers).get('Authorization');
    expect(actualInitialHeader).toEqual(expectedInitialRequestHeader);
    expect(actualRetryHeader).toEqual(expectedRetryRequestHeader);
  });

  test('invalidates session without refreshing for unauthenticated access', async () => {
    // Arrange
    const testInvalidAccessToken = 'invalid-access-token';

    const expectedError: Pick<BackendResponseError, 'status' | 'code'> = {
      status: 401,
      code: 'UNAUTHENTICATED',
    };

    const testBackendResponseError = new BackendResponseError({
      message: 'Not authenticated',
      ...expectedError,
    });

    vi.mocked(authSession.getSavedAccessToken).mockReturnValue(testInvalidAccessToken);
    vi.mocked(apiRequest).mockRejectedValueOnce(testBackendResponseError);

    // Act
    const request = protectedApiRequest(
      '/api/test-user',
      {
        method: 'GET',
      },
      {
        responseValidationSchema: testUserResponseSchema,
        fallbackErrorMessage,
      }
    );

    // Assert
    await expect(request).rejects.toMatchObject(expectedError);
    expect(apiRequest).toHaveBeenCalledOnce();
    expect(authSession.invalidate).toHaveBeenCalledOnce();
    expect(authSession.refreshExpiredAccessToken).not.toHaveBeenCalled();
  });
});
