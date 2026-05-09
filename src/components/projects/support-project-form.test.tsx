import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SupportProjectForm from "./support-project-form";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: vi.fn() }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SupportProjectForm", () => {
  it("renders the amount input and submit button", () => {
    render(<SupportProjectForm projectId="abc" isLoggedIn={true} />);
    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /support this project/i })).toBeInTheDocument();
  });

  it("shows an error when submitting with empty amount", async () => {
    render(<SupportProjectForm projectId="abc" isLoggedIn={true} />);
    await userEvent.click(screen.getByRole("button", { name: /support this project/i }));
    expect(screen.getByText(/valid amount greater than 0/i)).toBeInTheDocument();
  });

  it("does not show an error message on initial render", () => {
    render(<SupportProjectForm projectId="abc" isLoggedIn={true} />);
    expect(screen.queryByText(/valid amount/i)).not.toBeInTheDocument();
  });

  it("redirects to login when user is not logged in", async () => {
    render(<SupportProjectForm projectId="abc" isLoggedIn={false} />);
    await userEvent.click(screen.getByRole("button", { name: /support this project/i }));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("does not redirect to login when user is logged in and amount is empty", async () => {
    render(<SupportProjectForm projectId="abc" isLoggedIn={true} />);
    await userEvent.click(screen.getByRole("button", { name: /support this project/i }));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows the button label as 'Support this project' initially", () => {
    render(<SupportProjectForm projectId="abc" isLoggedIn={true} />);
    expect(screen.getByRole("button", { name: /support this project/i })).not.toBeDisabled();
  });
});
