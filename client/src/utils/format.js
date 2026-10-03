const taka = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatTaka = (value) => `৳${taka.format(Number(value) || 0)}`;

// Cheapest bookable room, or null when a hotel has no rooms yet.
export const lowestRoomPrice = (rooms = []) => {
  const prices = rooms.map((r) => Number(r?.price)).filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : null;
};

export const pluralize = (count, word, plural = `${word}s`) => `${count} ${count === 1 ? word : plural}`;
