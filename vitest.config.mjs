const vitestConfig = {
  test: {
    include: ["src/**/*.test.ts"],
    pool: "threads",
  },
};

export default vitestConfig;
