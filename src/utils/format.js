export const fmtINR = (n) => "₹" + n.toLocaleString("en-IN");

export const fmtINRk = (n) =>
  "₹" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
