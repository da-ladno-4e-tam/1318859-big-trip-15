import dayjs from 'dayjs';
import {createElement} from '../utils.js';

const createTripDatesTemplate = (startDates, finishDates) => {
  const tripStart = startDates.sort((a, b) => a.getTime() - b.getTime())[0];
  const tripFinish = finishDates.sort((a, b) => a.getTime() - b.getTime())[finishDates.length - 1];
  const tripStartFormat = 'MMM DD';
  const tripFinishFormat = (dayjs(tripStart).month() === dayjs(tripFinish).month()) ? 'DD' : 'MMM DD';

  return `<p class="trip-info__dates">${dayjs(tripStart).format(tripStartFormat)}&nbsp;&mdash;&nbsp;${dayjs(tripFinish).format(tripFinishFormat)}</p>`;
};

export default class TripDates {
  constructor(startDates, finishDates) {
    this._startDates = startDates;
    this._finishDates = finishDates;
    this._element = null;
  }

  getTemplate() {
    return createTripDatesTemplate(this._startDates, this._finishDates);
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
