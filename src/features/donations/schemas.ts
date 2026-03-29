export function validateSupportAmount(rawAmount: unknown) {
  const parsedAmount = Number(rawAmount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return {
      amount: null,
      error: "Please enter a valid amount greater than 0.",
    };
  }

  return {
    amount: parsedAmount,
    error: null,
  };
}
