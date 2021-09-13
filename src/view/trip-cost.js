import AbstractView from './abstract.js';

const createTripCostTemplate = (points) => {
  const baseSum = points.map((point) => point.basePrice);
  const offersSum = () => {
    const activeOffers = [];
    points.forEach((point) => {
      if (point.offers) {
        point.offers.forEach((offer) => {
          activeOffers.push(offer.price);
        });
      }
    });
    return activeOffers;
  };

  const totalSum = (baseSum.concat(offersSum())).reduce((sum, item) => sum + item, 0);

  return `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalSum}</span>
            </p>`;
};

export default class TripCost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }
}
