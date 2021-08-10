import AbstractView from './abstract.js';

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

export default class TripTitle extends AbstractView {
  constructor(towns) {
    super();
    this._towns = towns;
  }

  getTemplate() {
    return createTripTitleTemplate(this._towns);
  }
}
