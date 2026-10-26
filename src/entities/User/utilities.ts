import type { User } from '@/entities/User/types';

/**
 * Returns a displayName for user derived from one of the combinations:
 * firstName, firstName + secondName, secondName or username (fallback)
 */
export function getUserDisplayName(user: User) {
  const displayName = `${user.firstName ?? ''} ${user.secondName ?? ''}`.trim();

  return displayName || user.username;
}

/**
 * Returns a user view object with additional displayName
 */
export function toUserView<T extends User>(user: T) {
  return {
    ...user,
    displayName: getUserDisplayName(user),
  }
}
