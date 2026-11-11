class AccessToken {
  static #instance: AccessToken | null = null;

  static readonly #STORAGE_KEY = 'accessToken';

  private constructor() { }

  public static getInstance(): AccessToken {
    AccessToken.#instance ??= new AccessToken();

    return AccessToken.#instance;
  }

  public get() {
    return localStorage.getItem(AccessToken.#STORAGE_KEY);
  }

  public set(token: string) {
    localStorage.setItem(AccessToken.#STORAGE_KEY, token);
  }

  public clear() {
    localStorage.removeItem(AccessToken.#STORAGE_KEY);
  }
}

export const accessToken = AccessToken.getInstance();
