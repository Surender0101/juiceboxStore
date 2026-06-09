export const formatINR = (price) => {
  const amount = Number(price) || 0;
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};
