import he from 'he';
import dayjs from 'dayjs';
import SmartView from './smart.js';
import OffersView from './offers.js';
import DestinationView from './destination.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEventFormButtonsTemplate = (id, isSubmitDisabled, isDisabled, isSaving, isDeleting) => (
  id
    ? `<button class="event__save-btn  btn  btn--blue" type="submit" ${(isSubmitDisabled || isDisabled) ? 'disabled' : ''}>
${isSaving ? 'saving...' : 'save'}
</button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
                  ${isDeleting ? 'deleting...' : 'delete'}
</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`
    : `<button class="event__save-btn  btn  btn--blue" type="submit" ${(isSubmitDisabled || isDisabled) ? 'disabled' : ''}>
${isSaving ? 'saving...' : 'save'}
</button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`
);

const createEventTypeItemTemplate = (eventType, isChecked, isDisabled) => (
  `<div class="event__type-item">
                          <input
                          id="event-type-${eventType}-1"
                          class="event__type-input  visually-hidden"
                          type="radio" name="event-type"
                          value="${eventType}"
                          ${isChecked ? 'checked' : ''}
                          ${isDisabled ? 'disabled' : ''}>
                          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
                        </div>`
);

const createEventFormTemplate = (data, towns, types, offers, point) => {
  const {
    type = '',
    id = 0,
    basePrice = 0,
    dateFrom = dayjs().toDate(),
    dateTo = dayjs().toDate(),
    destination = {},
    isSubmitDisabled,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;
  const town = destination.name ? destination.name : '';
  const eventTypeItems = types.map((eventType) => createEventTypeItemTemplate(eventType, type === eventType), isDisabled).join('');
  const createTownItemTemplate = (townItem = '') => (`<option value="${townItem}"></option>`);
  const townItems = towns.map((townItem) => createTownItemTemplate(townItem)).join('');
  const offersComponent = new OffersView(offers, point);
  const offersDescription = new DestinationView(data.destination);
  const offerItems = offers.length ? offersComponent.getTemplate() : '';
  const description = Object.keys(data.destination).length > 1 ? offersDescription.getTemplate() : '';

  const formButtonsTemplate = createEventFormButtonsTemplate(id, isSubmitDisabled, isDisabled, isSaving, isDeleting);

  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input
                    class="event__type-toggle  visually-hidden"
                    id="event-type-toggle-1"
                    type="checkbox"
                    ${isDisabled ? 'disabled' : ''}>

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
                    <input
                    class="event__input  event__input--destination"
                    id="event-destination-1"
                    type="text"
                    name="event-destination"
                    value="${he.encode(town)}"
                    list="destination-list-1"
                    ${isDisabled ? 'disabled' : ''}>
                    <datalist id="destination-list-1">
                      ${townItems}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input
                    class="event__input  event__input--time"
                    id="event-start-time-1"
                    type="text"
                    name="event-start-time"
                    value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}"
                    ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input
                    class="event__input  event__input--time"
                    id="event-end-time-1"
                    type="text"
                    name="event-end-time"
                    value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}"
                    ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input
                    class="event__input  event__input--price"
                    id="event-price-1"
                    type="number"
                    min="1" step="1"
                    name="event-price"
                    value="${basePrice}"
                    ${isDisabled ? 'disabled' : ''}>
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
  constructor(point, offersModel, destinationsModel, pointsModel) {
    super();
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._pointsModel = pointsModel;
    this._point = point;
    this._towns = this._destinationsModel.getDestinations().map((item) => item['name']);
    this._types = this._offersModel.getOffers().map((item) => item['type']);
    this._offers = this._offersModel.getOffers().find((item) => item.type === point.type).offers;
    this._data = this._pointsModel.parsePointToData(point);
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
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

  removeElement() {
    super.removeElement();

    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
  }

  reset(point) {
    this.updateData(
      this._pointsModel.parsePointToData(point),
    );
  }

  getTemplate() {
    return createEventFormTemplate(this._data, this._towns, this._types, this._offers, this._point);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
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
      .addEventListener('input', this._townToggleHandler);
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
    // const changedElementId = evt.target.id;
    // console.log(evt.target.id);
    // this._data.offers.push(this._offers[changedElementId]);
    this.updateData({
      offers: Object.assign(
        [],
        [],
        this._data.offers,
        // this._data.offers,
        // this._data.offers[changedElementId].isAdded = evt.target.checked,
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
        this._offers,
      ),
    });
  }

  _townToggleHandler(evt) {
    evt.preventDefault();
    if (this._towns.indexOf(evt.target.value) !== -1) {
      this.getElement().querySelector('.event__save-btn').removeAttribute('disabled');
      this.updateData({
        destination: this._destinationsModel.getDestinations().find((item) => item['name'] === evt.target.value),
      });
    } else {
      this.getElement().querySelector('.event__save-btn').setAttribute('disabled', 'disabled');
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._pointsModel.parseDataToPoint(this._data));
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
    if (this._data.id) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._pointsModel.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }
}
