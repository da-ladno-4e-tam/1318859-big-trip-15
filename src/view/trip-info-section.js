import AbstractView from './abstract.js';

const createTripInfoSectionTemplate = () => (
  '<section class="trip-main__trip-info  trip-info"></section>'
);

export default class TripInfoSection extends AbstractView {
  getTemplate() {
    return createTripInfoSectionTemplate();
  }
}
