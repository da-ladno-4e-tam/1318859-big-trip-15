import {createElement} from '../utils.js';

const createTripInfoSectionTemplate = () => (
  '<section class="trip-main__trip-info  trip-info"></section>'
);

export default class TripInfoSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfoSectionTemplate();
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
