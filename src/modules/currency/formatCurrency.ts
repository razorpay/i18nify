const CURRENCIES = {
  INR: {
    name: "Indian Rupee",
  },
  USD: {
    name: "United States Dollar",
  },
};

export default function (
  currency: keyof typeof CURRENCIES,
  amount: number,
  options?: Record<string, unknown>
) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    amount
  );
}
