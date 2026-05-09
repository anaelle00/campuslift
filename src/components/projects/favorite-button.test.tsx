import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoriteButton from "./favorite-button";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("FavoriteButton", () => {
  it("renders with add-to-favorites label when not favorited", () => {
    render(
      <FavoriteButton projectId="p1" initialIsFavorite={false} isLoggedIn={true} />,
    );
    expect(screen.getByRole("button", { name: /add to favorites/i })).toBeInTheDocument();
  });

  it("renders with remove-from-favorites label when favorited", () => {
    render(
      <FavoriteButton projectId="p1" initialIsFavorite={true} isLoggedIn={true} />,
    );
    expect(screen.getByRole("button", { name: /remove from favorites/i })).toBeInTheDocument();
  });

  it("redirects to login when not logged in", async () => {
    render(
      <FavoriteButton projectId="p1" initialIsFavorite={false} isLoggedIn={false} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("does not redirect when user is logged in", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { isFavorite: true } }),
    });

    render(
      <FavoriteButton projectId="p1" initialIsFavorite={false} isLoggedIn={true} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows an error message if the API call fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ success: false, message: "Server error" }),
    });

    render(
      <FavoriteButton projectId="p1" initialIsFavorite={false} isLoggedIn={true} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  it("is not disabled initially", () => {
    render(
      <FavoriteButton projectId="p1" initialIsFavorite={false} isLoggedIn={true} />,
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
