import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import type { BackendResponseError } from '@/shared/api/backendResponseError';
import { apiRequest } from './apiRequest';

describe('apiRequest', () => {
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

  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('accepts successful response', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => testUser,
    });

    // Act
    const responseBody = await apiRequest(
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
    expect(responseBody).toEqual(testUser);
  });

  test('throws error on failed fetch', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error('Unable to fetch'));

    // Act
    const request = apiRequest(
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
    await expect(request).rejects.toThrow();
  });


  test('throws fallback error message for a non-JSON response', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('Unable to parse response');
      },
    });

    // Act
    const request = apiRequest(
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
    await expect(request).rejects.toThrow(fallbackErrorMessage);
  });

  test('throws with backend error details on unsuccessful response', async () => {
    // Arrange
    const testBackendError: Required<Pick<BackendResponseError, 'message' | 'code'>> = {
      message: 'Not authenticated',
      code: 'UNAUTHENTICATED',
    };

    const expectedError: Pick<BackendResponseError, 'message' | 'status' | 'code'> = {
      message: testBackendError.message,
      status: 401,
      code: testBackendError.code,
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => testBackendError,
    });

    // Act
    const request = apiRequest(
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
  });

  test('accepts successful response without a body (No Content)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => {
        throw new Error('Unable to parse response');
      },
    });

    // Act
    const responseBody = await apiRequest(
      '/api/test-user',
      {
        method: 'DELETE',
      },
      {
        responseValidationSchema: z.void(),
        fallbackErrorMessage,
      }
    );

    // Assert
    expect(responseBody).toBeUndefined();
  });

  test('throws on successful response with malformed body', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ...testUser, id: 'oops' }),
    });

    // Act
    const request = apiRequest(
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
    await expect(request).rejects.toThrow();
  });
});
