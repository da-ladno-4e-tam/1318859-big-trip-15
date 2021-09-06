import AbstractObserver from '../utils/abstract-observer.js';

export default class Destinations extends AbstractObserver {
  constructor() {
    super();
    this._destinations = [];
  }

  setOffers(destinations) {
    this._destinations = destinations.slice();
  }

  getOffers() {
    return this._destinations;
  }
}
