import dayjs from 'dayjs';
import SmartView from './smart.js';
import {towns, types, destinations, generateOffersList} from '../mock/task.js';
import OffersView from './offers.js';
import DestinationView from './destination.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEventFormButtonsTemplate = (id, isSubmitDisabled) => (
  id
    ? `<button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`
    : `<button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>`
);

const createEventTypeItemTemplate = (eventType, isChecked) => (
  `<div class="event__type-item">
                          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
                        </div>`
);

const createEventFormTemplate = (data) => {
  const {
    type = '',
    id = 0,
    basePrice = 0,
    dateFrom = dayjs().toDate(),
    dateTo = dayjs().toDate(),
    destination = {},
    isSubmitDisabled,
  } = data;
  const town = destination.name ? destination.name : '';
  const eventTypeItems = types.map((eventType) => createEventTypeItemTemplate(eventType, type === eventType)).join('');
  const townItemTemplate = (townItem = '') => (`<option value="${townItem}"></option>`);
  const townItems = towns.map((townItem) => townItemTemplate(townItem)).join('');
  const offersComponent = new OffersView(data.offers);
  const offersDescription = new DestinationView(data.destination);
  const offerItems = data.offers.length ? offersComponent.getTemplate() : '';
  const description = Object.keys(data.destination).length > 1 ? offersDescription.getTemplate() : '';

  const formButtonsTemplate = createEventFormButtonsTemplate(id, isSubmitDisabled);

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
                ${offerItems}
                ${description}
                </section>
              </form>
</li>`;
};

export default class EventForm extends SmartView {
  constructor(point) {
    super();
    // point = JSON.parse(JSON.stringify(point));
    this._data = EventForm.parsePointToData(point);
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);


    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._townToggleHandler = this._townToggleHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
  }

  reset(point) {
    this.updateData(
      EventForm.parsePointToData(point),
    );
  }

  getTemplate() {
    return createEventFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        maxDate: this._data.dateTo,
        ['time_24hr']: true,
        onClose: this._dateFromChangeHandler,
      },
    );
  }


  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        minDate: this._data.dateFrom,
        ['time_24hr']: true,
        onClose: this._dateToChangeHandler,
      },
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._typeToggleHandler);
    this.getElement()
      .querySelector('#event-destination-1')
      .addEventListener('change', this._townToggleHandler);
    this.getElement()
      .querySelector('#event-price-1')
      .addEventListener('input', this._priceInputHandler);
    if (this._data.offers.length) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offerChangeHandler);
    }
  }

  _dateFromChangeHandler([userDateFrom]) {
    this.updateData({
      dateFrom: userDateFrom,
    });
  }

  _dateToChangeHandler([userDateTo]) {
    this.updateData({
      dateTo: userDateTo,
    });
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    const changedElementIndex = Number(evt.target.dataset.index);
    // this._data.offers[changedElementIndex].isAdded = evt.target.checked;
    this.updateData({
      offers: Object.assign(
        [],
        this._data.offers,
        this._data.offers[changedElementIndex].isAdded = evt.target.checked,
      ),
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: Number(evt.target.value) && Number(evt.target.value) > 0 ? Number(evt.target.value) : 0,
    }, true);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: Object.assign(
        [],
        [],
        generateOffersList(evt.target.value),
      ),
    });
  }

  _townToggleHandler(evt) {
    evt.preventDefault();
    if (towns.indexOf(evt.target.value) !== -1) {
      this.updateData({
        destination: destinations.find((item) => item['name'] === evt.target.value),
      });
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventForm.parseDataToPoint(this._data));
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    return data;
  }
}
