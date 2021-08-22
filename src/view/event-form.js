import dayjs from 'dayjs';
import AbstractView from './abstract.js';
import {towns, types, offers, destinations} from '../mock/task.js';
import OffersView from './offers.js';
import DestinationView from './destination.js';

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
    basePrice = '0',
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
  console.log(data);
  const offerItems = data.offers.offers.length ? offersComponent.getTemplate() : '';
  const description = (data.destination.description || data.destination.pictures.length) ? offersDescription.getTemplate() : '';

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

export default class EventForm extends AbstractView {
  constructor(point) {
    super();
    this._data = EventForm.parsePointToData(point);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);


    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._townToggleHandler = this._townToggleHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventFormTemplate(this._data);
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }
    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
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
    if (this._data.offers.offers.length) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offerChangeHandler);
    }
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    const changedElementIndex = Number(evt.target.id.toString().slice(-1));
    this._data.offers.offers[changedElementIndex].isAdded = evt.target.checked;
    this.updateData({
      offers: Object.assign(
        {},
        this._data.offers,
        this._data.offers.offers[changedElementIndex].isAdded,
      ),
    }, true);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
      isSubmitDisabled: !evt.target.value,
    }, !!evt.target.value);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.updateData({
      type: evt.target.value,
      offers: offers.filter((item) => item['type'] === evt.target.value)[0],
    });
  }

  _townToggleHandler(evt) {
    this.updateData({
      destination: destinations.filter((item) => item['name'] === evt.target.value)[0],
    });
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
