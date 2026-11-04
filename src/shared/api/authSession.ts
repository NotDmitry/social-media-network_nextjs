import { accessToken } from './accessToken';
import { BackendResponseError } from './backendResponseError';
import { isRefreshTokenErrorCode } from './backendErrorCode';

interface AuthSessionActions {
  refresh: () => Promise<{ token: string }>;
  invalidate: () => void;
}

class AuthSession {
  static #instance: AuthSession | null = null;

  #actions: AuthSessionActions | null;

  private constructor() {
    this.#actions = null;
  }

  public static getInstance(): AuthSession {
    AuthSession.#instance ??= new AuthSession();

    return AuthSession.#instance;
  }

  public registerActions(actions: AuthSessionActions) {
    this.#actions = actions;
  }

  #getActions(): AuthSessionActions {
    if (this.#actions === null) {
      throw new Error('Auth session actions are not initialized');
    }

    return this.#actions;
  }

  public invalidate() {
    this.#getActions().invalidate();
  }

  public getSavedAccessToken(): string {
    const savedAccessToken = accessToken.get();

    if (savedAccessToken === null) {
      this.invalidate();

      throw new Error('Access token is missing');
    }

    return savedAccessToken;
  }

  public async refreshExpiredAccessToken(providedAccessToken: string) {
    if (accessToken.get() !== providedAccessToken) {
      return;
    }

    try {
      const refreshResponsePayload = await this.#getActions().refresh();

      if (accessToken.get() === providedAccessToken) {
        accessToken.set(refreshResponsePayload.token);
      }
    } catch (error) {
      if (error instanceof BackendResponseError && isRefreshTokenErrorCode(error.code)) {
        this.invalidate();
      }

      throw error;
    }
  }
}

export const authSession = AuthSession.getInstance();
