import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition} from '../utils/render.js';
import EventPresenter from './event.js';

export default class Route {
  constructor(routeContainer) {
    this._routeContainer = routeContainer;
    this._eventPresenter = new Map();
    this._eventsListViewComponent = new EventsListView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();

    this._handleEventChange = this._handleEventChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
    this._renderRoute();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._routeContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(point) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
    const eventPresenter = new EventPresenter(this._eventsListViewComponent, this._handleEventChange);
    eventPresenter.init(point);
    this._eventPresenter.set(point.id, eventPresenter);
  }

  _renderEvents() {
    // Метод для рендеринга N-задач за раз
    render(this._routeContainer, this._eventsListViewComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < this._points.length; i++) {
      this._renderEvent(this._points[i]);
    }
  }

  _renderNoEvents() {
    // Метод для рендеринга заглушки
    render(this._routeContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _clearEventList() {
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();
  }

  _handleEventChange(updatedEvent) {
    this._points = updateItem(this._points, updatedEvent);
    this._eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  _renderRoute() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    if (this._points.length === 0) {
      this._renderNoEvents();
    } else {
      this._renderSort();
      this._renderEvents();
    }
  }
}
