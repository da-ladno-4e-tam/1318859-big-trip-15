import {createElement} from '../utils.js';

const createTripCostTemplate = (points) => {
  const baseSum = points.map((point) => point.basePrice);
  const offersSum = () => {
    const activeOffers = [];
    points.forEach((point) => {
      if (point.offers.offers) {
        point.offers.offers.forEach((offer) => {
          if (offer.isAdded) {
            activeOffers.push(offer.price);
          }
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

export default class TripCost {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
