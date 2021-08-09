import {createElement} from '../utils.js';

const createTripInfoMainTemplate = () => (
  '<div class="trip-info__main"></div>'
);

export default class TripInfoSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfoMainTemplate();
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
