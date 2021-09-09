import AbstractView from './abstract.js';

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
    this._callback.newPointClick();
  }

  setNewPointClickHandler(callback) {
    this._callback.newPointClick = callback;
    this.getElement().addEventListener('click', this._newPointClickHandler);
  }
}
