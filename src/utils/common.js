export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const tripDurationFormat = (tripDuration) => {
  const MINUTES_IN_HOUR = 60;
  const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;
  if (tripDuration >= MINUTES_IN_DAY) {
    return 'DD[D] HH[H] mm[M]';
  } else if (tripDuration >= MINUTES_IN_HOUR) {
    return 'HH[H] mm[M]';
  } else {
    return 'mm[M]';
  }
};
