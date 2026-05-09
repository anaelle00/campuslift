import { describe, expect, it } from "vitest";

// Test the pure computation logic extracted from getHeroStats
function computeHeroStats(pledges: { amount: number; user_id: string }[]) {
  const recentPledgesCount = pledges.length;
  const uniqueSupporters = new Set(pledges.map((p) => p.user_id));
  const activeSupporters = uniqueSupporters.size;
  const totalAmount = pledges.reduce((sum, p) => sum + p.amount, 0);
  const averagePledge =
    recentPledgesCount > 0 ? Math.round(totalAmount / recentPledgesCount) : 0;

  return { recentPledgesCount, activeSupporters, averagePledge };
}

describe("hero stats computation", () => {
  it("returns zeroes for no pledges", () => {
    const result = computeHeroStats([]);
    expect(result).toEqual({
      recentPledgesCount: 0,
      activeSupporters: 0,
      averagePledge: 0,
    });
  });

  it("counts unique supporters correctly", () => {
    const result = computeHeroStats([
      { amount: 10, user_id: "user-a" },
      { amount: 20, user_id: "user-a" },
      { amount: 15, user_id: "user-b" },
    ]);

    expect(result.recentPledgesCount).toBe(3);
    expect(result.activeSupporters).toBe(2);
    expect(result.averagePledge).toBe(15);
  });

  it("rounds the average pledge correctly", () => {
    const result = computeHeroStats([
      { amount: 7, user_id: "user-a" },
      { amount: 8, user_id: "user-b" },
    ]);

    expect(result.averagePledge).toBe(8); // 15 / 2 = 7.5 → rounded to 8
  });
});
