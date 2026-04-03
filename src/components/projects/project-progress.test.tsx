import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectProgress from "./project-progress";

describe("ProjectProgress", () => {
  it("renders current and target amounts", () => {
    render(<ProjectProgress current={50} target={200} />);
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("$200 goal")).toBeInTheDocument();
  });

  it("renders the progress bar with correct width percentage", () => {
    const { container } = render(<ProjectProgress current={100} target={200} />);
    const bar = container.querySelector(".bg-primary.rounded-full") as HTMLElement;
    expect(bar.style.width).toBe("50%");
  });

  it("caps the bar at 100% when funded over goal", () => {
    const { container } = render(<ProjectProgress current={300} target={200} />);
    const bar = container.querySelector(".bg-primary.rounded-full") as HTMLElement;
    expect(bar.style.width).toBe("100%");
  });

  it("renders 0% bar when nothing is funded", () => {
    const { container } = render(<ProjectProgress current={0} target={200} />);
    const bar = container.querySelector(".bg-primary.rounded-full") as HTMLElement;
    expect(bar.style.width).toBe("0%");
  });

  it("renders exact amounts as text", () => {
    render(<ProjectProgress current={75} target={150} />);
    expect(screen.getByText("$75")).toBeInTheDocument();
    expect(screen.getByText("$150 goal")).toBeInTheDocument();
  });
});
