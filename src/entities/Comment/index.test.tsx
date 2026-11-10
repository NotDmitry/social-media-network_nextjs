import { beforeEach, describe, expect, test, vi } from 'vitest';
import enPostsTranslations from '@/shared/i18n/locales/en/posts.json';
import { deleteComment } from '@/entities/Comment/api/deleteComment';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import { currentUser } from '@/test/userFixtures';
import { testComment } from '@/test/commentFixtures';
import { renderWithI18nQueryClient as renderWithQueryClient } from '@/test/renderWithI18nQueryClient';
import Comment from './index';

vi.mock(import('@/entities/Comment/api/deleteComment'), () => ({
  deleteComment: vi.fn(),
}));

describe('Comment', () => {
  const deleteButtonLabel = enPostsTranslations.comment.delete.action;

  beforeEach(() => {
    vi.mocked(deleteComment).mockReset();
    useAlertStore.setState({ alerts: [] });
  });

  test('requests comment deletion with success alert', async () => {
    // Arrange
    const successAlertMessage = enPostsTranslations.comment.delete.alert.success;
    const screen = await renderWithQueryClient(
      <>
        <Comment author={currentUser} comment={testComment} canDelete={true} />
        <AlertStack />
      </>
    );
    const deleteButton = screen.getByRole('button', { name: deleteButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await deleteButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(deleteComment).toHaveBeenCalledExactlyOnceWith(testComment.id);
  });

  test('disables the delete button during a pending deletion request', async () => {
    // Arrange
    let resolvePendingDeletion!: () => void;

    vi.mocked(deleteComment).mockReturnValue(new Promise<void>((resolve) => {
      resolvePendingDeletion = resolve;
    }));

    const screen = await renderWithQueryClient(
      <Comment author={currentUser} comment={testComment} canDelete={true} />
    );
    const deleteButton = screen.getByRole('button', { name: deleteButtonLabel });

    // Act
    await deleteButton.click();

    // Assert
    await expect.element(deleteButton).toBeDisabled();

    // Act
    resolvePendingDeletion();

    // Assert
    await expect.element(deleteButton).toBeEnabled();
  });

  test('shows error alert on a failed comment deletion', async () => {
    // Arrange
    const errorAlertMessage = enPostsTranslations.comment.delete.alert.error;
    vi.mocked(deleteComment).mockRejectedValue(new Error('Network connection lost'));
    const screen = await renderWithQueryClient(
      <>
        <Comment author={currentUser} comment={testComment} canDelete={true} />
        <AlertStack />
      </>
    );
    const deleteButton = screen.getByRole('button', { name: deleteButtonLabel });
    const errorAlert = screen.getByText(errorAlertMessage);

    // Act
    await deleteButton.click();

    // Assert
    await expect.element(errorAlert).toBeVisible();
    await expect.element(deleteButton).toBeEnabled();
    expect(deleteComment).toHaveBeenCalledOnce();
  });

  test('doesn\'t render delete button when deletion is explicitly forbidden', async () => {
    // Arrange
    const screen = await renderWithQueryClient(
      <Comment author={currentUser} comment={testComment} canDelete={false} />
    );
    const deleteButton = screen.getByRole('button', { name: deleteButtonLabel, includeHidden: true });

    // Assert
    await expect.element(deleteButton).not.toBeInTheDocument();
  });
});
