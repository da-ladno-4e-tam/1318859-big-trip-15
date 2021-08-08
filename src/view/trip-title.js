import {createElement} from '../utils.js';

const createTripTitleTemplate = (towns) => {
  const firstTown = towns[0];
  const lastTown = towns[towns.length - 1];
  const route = (townsList) => {
    if (townsList.length > 3) {
      return `${firstTown} &mdash; ... &mdash; ${lastTown}`;
    } else {
      return `${townsList.map((town) => town).join(' &mdash; ')}`;
    }
  };

  return `<h1 class="trip-info__title">${route(towns)}</h1>`;
};

export default class TripTitle {
  constructor(towns) {
    this._towns = towns;
    this._element = null;
  }

  getTemplate() {
    return createTripTitleTemplate(this._towns);
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
