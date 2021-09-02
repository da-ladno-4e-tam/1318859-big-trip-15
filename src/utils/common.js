export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const tripDurationFormat = (tripDuration) => {
  if (tripDuration > 23 * 60 + 59) {
    return 'DD[D] HH[H] mm[M]';
  } else if (tripDuration > 59) {
    return 'HH[H] mm[M]';
  } else {
    return 'mm[M]';
  }
};
