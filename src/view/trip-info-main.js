import AbstractView from './abstract.js';

const createTripInfoMainTemplate = () => (
  '<div class="trip-info__main"></div>'
);

export default class TripInfoSection extends AbstractView{
  getTemplate() {
    return createTripInfoMainTemplate();
  }
}
