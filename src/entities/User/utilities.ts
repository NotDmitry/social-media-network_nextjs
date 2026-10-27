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

/**
 * Checks the availability of non-empty URL and returns stubbed images to use without backend.
 * If no URL is provided - returns default_user.png.
 * For provided URL string returns test_user_walter.jpg for current authenticated
 * and test_user_hank.jpg for any other user.
 */
export function getProfileImageFallbackUrl(isCurrentUser: boolean, providedImageUrl?: string | null) {
  if (!providedImageUrl) {
    return '/images/default_user.png';
  }

  return isCurrentUser ? '/images/test_user_walter.jpg' : '/images/test_user_hank.jpg';
}
