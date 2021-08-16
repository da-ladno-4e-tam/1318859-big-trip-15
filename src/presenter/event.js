import EventFormView from '../view/event-form.js';
import EventView from '../view/event.js';
import OffersView from '../view/offers.js';
import DestinationView from '../view/destination.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventsContainer, changeData, changeMode) {
    this._eventsContainer = eventsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormEsc = this._handleFormEsc.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventComponent = new EventView(point);
    this._eventFormComponent = new EventFormView(point);
    this._formOffersContainer = this._eventFormComponent.getElement().querySelector('.event__details');

    if (this._point.offers.offers.length) {
      this._renderOffers();
    }
    if (this._point.destination.description || this._point.destination.pictures.length) {
      this._renderDescription();
    }

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setEditClickHandler(this._handleFormEsc);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._reinit(prevEventComponent, prevEventFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }

  resetMode() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _reinit(prevEventComponent, prevEventFormComponent) {
    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventsContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToEvent();
  }

  _handleFormEsc() {
    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _renderOffers() {
    render(this._formOffersContainer, new OffersView(this._point.offers), RenderPosition.BEFOREEND);
  }

  _renderDescription() {
    render(this._formOffersContainer, new DestinationView(this._point.destination), RenderPosition.BEFOREEND);
  }
}
