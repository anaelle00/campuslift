import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentItem from "./comment-item";
import type { CommentNode } from "@/features/comments/queries";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

function makeComment(overrides: Partial<CommentNode> = {}): CommentNode {
  return {
    id: "c1",
    body: "Great project!",
    createdAt: "2026-04-03T10:00:00Z",
    deletedAt: null,
    parentId: null,
    isReportedByCurrentUser: false,
    reactions: { likes: 0, dislikes: 0, userReaction: null },
    author: {
      id: "u1",
      displayName: "Anaelle",
      username: "anaelle",
      avatarUrl: null,
    },
    children: [],
    ...overrides,
  };
}

const noop = vi.fn();

const baseProps = {
  depth: 0,
  currentUserId: null,
  isLoggedIn: false,
  replyTargetId: null,
  deletingCommentId: null,
  reportTargetId: null,
  onReply: noop,
  onDelete: noop,
  onReaction: noop,
  onReport: noop,
  replyForm: null,
  reportForm: null,
};

describe("CommentItem", () => {
  it("renders the comment body", () => {
    render(<CommentItem comment={makeComment()} {...baseProps} />);
    expect(screen.getByText("Great project!")).toBeInTheDocument();
  });

  it("renders the author display name", () => {
    render(<CommentItem comment={makeComment()} {...baseProps} />);
    expect(screen.getByText("Anaelle")).toBeInTheDocument();
  });

  it("renders deleted placeholder when comment is deleted", () => {
    render(
      <CommentItem
        comment={makeComment({ deletedAt: "2026-04-03T11:00:00Z", body: "hidden" })}
        {...baseProps}
      />,
    );
    expect(screen.getByText(/this comment was deleted/i)).toBeInTheDocument();
    expect(screen.queryByText("hidden")).not.toBeInTheDocument();
  });

  it("shows Reply button when logged in and comment is not deleted", () => {
    render(
      <CommentItem comment={makeComment()} {...baseProps} isLoggedIn={true} currentUserId="u2" />,
    );
    expect(screen.getByRole("button", { name: /reply/i })).toBeInTheDocument();
  });

  it("does not show Reply button when not logged in", () => {
    render(<CommentItem comment={makeComment()} {...baseProps} isLoggedIn={false} />);
    expect(screen.queryByRole("button", { name: /reply/i })).not.toBeInTheDocument();
  });

  it("shows Delete button when user owns the comment", () => {
    render(
      <CommentItem
        comment={makeComment()}
        {...baseProps}
        isLoggedIn={true}
        currentUserId="u1"
      />,
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("does not show Delete button for other users", () => {
    render(
      <CommentItem
        comment={makeComment()}
        {...baseProps}
        isLoggedIn={true}
        currentUserId="u2"
      />,
    );
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("shows Report button when logged in as a different user", () => {
    render(
      <CommentItem
        comment={makeComment()}
        {...baseProps}
        isLoggedIn={true}
        currentUserId="u2"
      />,
    );
    expect(screen.getByRole("button", { name: /report/i })).toBeInTheDocument();
  });

  it("does not show Report button for own comment", () => {
    render(
      <CommentItem
        comment={makeComment()}
        {...baseProps}
        isLoggedIn={true}
        currentUserId="u1"
      />,
    );
    expect(screen.queryByRole("button", { name: /report/i })).not.toBeInTheDocument();
  });

  it("calls onReply when Reply button is clicked", async () => {
    const onReply = vi.fn();
    render(
      <CommentItem
        comment={makeComment()}
        {...baseProps}
        isLoggedIn={true}
        currentUserId="u2"
        onReply={onReply}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /reply/i }));
    expect(onReply).toHaveBeenCalledWith("c1");
  });

  it("calls onDelete when Delete button is clicked", async () => {
    const onDelete = vi.fn();
    render(
      <CommentItem
        comment={makeComment()}
        {...baseProps}
        isLoggedIn={true}
        currentUserId="u1"
        onDelete={onDelete}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("c1");
  });

  it("renders Like and Dislike buttons for non-deleted comments", () => {
    render(
      <CommentItem comment={makeComment()} {...baseProps} isLoggedIn={true} currentUserId="u2" />,
    );
    expect(screen.getByRole("button", { name: /^like/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^dislike/i })).toBeInTheDocument();
  });

  it("shows reaction counts", () => {
    render(
      <CommentItem
        comment={makeComment({ reactions: { likes: 3, dislikes: 1, userReaction: null } })}
        {...baseProps}
      />,
    );
    expect(screen.getByText(/like \(3\)/i)).toBeInTheDocument();
    expect(screen.getByText(/dislike \(1\)/i)).toBeInTheDocument();
  });

  it("renders the reply form slot when provided", () => {
    render(
      <CommentItem
        comment={makeComment()}
        {...baseProps}
        replyTargetId="c1"
        replyForm={<div data-testid="reply-form">reply form</div>}
      />,
    );
    expect(screen.getByTestId("reply-form")).toBeInTheDocument();
  });
});
