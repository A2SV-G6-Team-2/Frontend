export const sanitizeText = (value: string) => {
  return value.replace(/[<>]/g, "");
};

export const validateAmount = (amount: number) => {
  return amount >= 0 && amount <= 1000000;
};