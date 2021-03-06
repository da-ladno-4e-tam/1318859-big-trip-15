import EventFormView from '../view/event-form.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {isEscKey} from '../utils/common';
import {NEW_POINT, UserAction, UpdateType} from '../const.js';

export default class NewEventForm {
  constructor(eventsContainer, changeData, offersModel, destinationsModel, pointsModel) {
    this._eventsContainer = eventsContainer;
    this._changeData = changeData;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._eventFormComponent !== null) {
      return;
    }
    this._eventFormComponent = new EventFormView(NEW_POINT, this._offersModel, this._destinationsModel, this._pointsModel);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventsContainer, this._eventFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventFormComponent === null) {
      return;
    }

    remove(this._eventFormComponent);
    this._eventFormComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._eventFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._eventFormComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
  }

  _handleDeleteClick() {
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt)) {
      this.destroy();
      document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
    }
  }
}
