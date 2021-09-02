import AbstractView from './abstract.js';
import {routePresenter} from '../main.js';

const createNewEventButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewEventButton extends AbstractView {
  constructor() {
    super();

    this._newPointClickHandler = this._newPointClickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButtonTemplate();
  }

  _newPointClickHandler(evt) {
    evt.preventDefault();
    routePresenter.createPoint();
    document.querySelector('.event__save-btn').disabled = true;
  }

  setNewPointClickHandler() {
    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this._newPointClickHandler);
  }
}
