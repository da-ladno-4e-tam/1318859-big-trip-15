import {createDestinationTemplate} from './destination.js';
import {createOffersTemplate} from './offers.js';
import dayjs from 'dayjs';
import {createElement} from '../utils.js';

const createEventFormTemplate = (point) => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  const towns = ['Chamonix', 'Amsterdam', 'Geneva', 'London', 'Paris', 'Oslo', 'Bratislava'];
  const {
    type = '',
    id = 0,
    basePrice = 0,
    dateFrom = dayjs().toDate(),
    dateTo = dayjs().toDate(),
    offers = {},
    destination = {},
  } = point;
  const town = destination.name ? destination.name : '';
  const eventTypeItemTemplate = (eventType = '') => {
    const isChecked = (eventType === type) ? 'checked' : '';

    return `<div class="event__type-item">
                          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
                          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
                        </div>`;
  };
  const eventTypeItems = types.map((eventType) => eventTypeItemTemplate(eventType)).join('');

  const townItemTemplate = (townItem = '') => (`<option value="${townItem}"></option>`);
  const townItems = towns.map((townItem) => townItemTemplate(townItem)).join('');

  const formButtonsTemplate = id
    ? `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`
    : `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>`;

  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypeItems}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${town}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${townItems}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  ${formButtonsTemplate}

                </header>
                <section class="event__details">

                  ${createOffersTemplate(offers)}
                  ${createDestinationTemplate(destination)}
                </section>
              </form>
</li>`;
};

export default class EventForm {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createEventFormTemplate(this._point);
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
