import { beforeEach, describe, expect, test, vi } from 'vitest';
import enPostsTranslations from '@/shared/i18n/locales/en/posts.json';
import { createComment } from '@/entities/Comment/api/createComment';
import type { CommentCreationPayload, CommentModel } from '@/entities/Comment/types';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import { testComment } from '@/test/commentFixtures';
import { renderWithI18nQueryClient as renderWithQueryClient } from '@/test/renderWithI18nQueryClient';
import CreateCommentForm from './index';

vi.mock(import('@/entities/Comment/api/createComment'), () => ({
  createComment: vi.fn(),
}));

describe('CreateCommentForm', () => {
  const commentInputLabel = enPostsTranslations.comment.create.input.comment.label;
  const submitButtonLabel = enPostsTranslations.comment.create.button.default;

  const mockOnCommentCreated = vi.fn();

  beforeEach(() => {
    mockOnCommentCreated.mockReset();
    vi.mocked(createComment).mockReset();
    useAlertStore.setState({ alerts: [] });
  });

  test('rejects an empty comment submission with a visible error', async () => {
    // Arrange
    const commentRequiredErrorMessage = enPostsTranslations.comment.create.input.comment.validation.required;
    const screen = await renderWithQueryClient(
      <CreateCommentForm postId={testComment.postId} onCommentCreated={mockOnCommentCreated} />
    );
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const visibleCommentRequiredErrorMessage = screen.getByText(commentRequiredErrorMessage);

    // Act
    await commentInput.fill('');
    await submitButton.click();

    // Assert
    await expect.element(visibleCommentRequiredErrorMessage).toBeVisible();
    expect(mockOnCommentCreated).not.toHaveBeenCalled();
    expect(createComment).not.toHaveBeenCalled();
  });

  test('creates new comment and shows success alert with field reset', async () => {
    // Arrange
    const successAlertMessage = enPostsTranslations.comment.create.alert.success;
    const expectedPayload: CommentCreationPayload = {
      postId: testComment.postId,
      text: testComment.text,
    };
    vi.mocked(createComment).mockResolvedValue(testComment);
    const screen = await renderWithQueryClient(
      <>
        <CreateCommentForm postId={testComment.postId} onCommentCreated={mockOnCommentCreated} />
        <AlertStack />
      </>
    );
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await commentInput.fill(testComment.text);
    await submitButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    await expect.element(commentInput).toHaveValue('');
    expect(mockOnCommentCreated).toHaveBeenCalledOnce();
    expect(createComment).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });

  test('disables the form during a pending comment creation request', async () => {
    // Arrange
    let resolvePendingCommentCreation!: (comment: CommentModel) => void;

    vi.mocked(createComment).mockReturnValue(new Promise<CommentModel>((resolve) => {
      resolvePendingCommentCreation = resolve;
    }));

    const pendingSubmitButtonLabel = enPostsTranslations.comment.create.button.pending;
    const screen = await renderWithQueryClient(
      <CreateCommentForm postId={testComment.postId} onCommentCreated={mockOnCommentCreated} />
    );
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const pendingSubmitButton = screen.getByRole('button', { name: pendingSubmitButtonLabel });

    // Act
    await commentInput.fill(testComment.text);
    await submitButton.click();

    // Assert
    await expect.element(commentInput).toBeDisabled();
    await expect.element(pendingSubmitButton).toBeDisabled();

    // Act
    resolvePendingCommentCreation(testComment);

    // Assert
    await expect.element(commentInput).toBeEnabled();
    await expect.element(submitButton).toBeEnabled();
  });

  test('shows error alert on failed comment creation request without field reset', async () => {
    // Arrange
    const errorAlertMessage = enPostsTranslations.comment.create.alert.error;
    vi.mocked(createComment).mockRejectedValue(new Error('Network connection lost'));
    const screen = await renderWithQueryClient(
      <>
        <CreateCommentForm postId={testComment.postId} onCommentCreated={mockOnCommentCreated} />
        <AlertStack />
      </>
    );
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const errorAlert = screen.getByText(errorAlertMessage);

    // Act
    await commentInput.fill(testComment.text);
    await submitButton.click();

    // Assert
    await expect.element(errorAlert).toBeVisible();
    await expect.element(commentInput).toHaveValue(testComment.text);
    expect(mockOnCommentCreated).not.toHaveBeenCalled();
    expect(createComment).toHaveBeenCalledOnce();
  });

  test('accepts a comment of exactly 200 characters', async () => {
    // Arrange
    const testLongComment = '1'.repeat(200);
    const successAlertMessage = enPostsTranslations.comment.create.alert.success;
    const expectedPayload: CommentCreationPayload = {
      postId: testComment.postId,
      text: testLongComment,
    };
    vi.mocked(createComment).mockResolvedValue({ ...testComment, text: testLongComment });
    const screen = await renderWithQueryClient(
      <>
        <CreateCommentForm postId={testComment.postId} onCommentCreated={mockOnCommentCreated} />
        <AlertStack />
      </>
    );
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await commentInput.fill(testLongComment);
    await submitButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(mockOnCommentCreated).toHaveBeenCalledOnce();
    expect(createComment).toHaveBeenCalledExactlyOnceWith(expectedPayload);
  });

  test('rejects a comment of 201 characters with visible error', async () => {
    // Arrange
    const testLongComment = '1'.repeat(201);
    const commentMaxLengthErrorMessage = enPostsTranslations.comment.create.input.comment.validation.maxLength;
    const screen = await renderWithQueryClient(
      <CreateCommentForm postId={testComment.postId} onCommentCreated={mockOnCommentCreated} />
    );
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const submitButton = screen.getByRole('button', { name: submitButtonLabel });
    const visibleCommentMaxLengthErrorMessage = screen.getByText(commentMaxLengthErrorMessage);

    // Act
    await commentInput.fill(testLongComment);
    await submitButton.click();

    // Assert
    await expect.element(visibleCommentMaxLengthErrorMessage).toBeVisible();
    expect(mockOnCommentCreated).not.toHaveBeenCalled();
    expect(createComment).not.toHaveBeenCalled();
  });
});
