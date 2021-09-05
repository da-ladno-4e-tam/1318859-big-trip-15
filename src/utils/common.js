export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const tripDurationFormat = (tripDuration) => {
  const minutesInHour = 60;
  const minutesInDay = 24 * minutesInHour;
  if (tripDuration >= minutesInDay) {
    return 'DD[D] HH[H] mm[M]';
  } else if (tripDuration >= minutesInHour) {
    return 'HH[H] mm[M]';
  } else {
    return 'mm[M]';
  }
};
