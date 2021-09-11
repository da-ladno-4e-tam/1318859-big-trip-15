export const getTripDurationFormat = (tripDuration) => {
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

export const generateOffersList = (offers, offerType) => {
  const typeOffers = offers.find((item) => item['type'] === offerType).offers;
  typeOffers.forEach((offer) => offer.isAdded = false);
  return typeOffers;
};
