import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import {render, RenderPosition} from '../utils/render.js';
import EventPresenter from './event.js';
import {SortType} from '../const.js';

export default class Route {
  constructor(routeContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._routeContainer = routeContainer;
    this._eventPresenter = new Map();
    this._eventsListViewComponent = new EventsListView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {

    this._renderRoute();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.DEFAULT:
        this._pointsModel.getPoints().slice().sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
        break;
      case SortType.TIME:
        this._pointsModel.getPoints().slice().sort((a, b) => (a.dateFrom.getTime() - a.dateTo.getTime()) - (b.dateFrom.getTime() - b.dateTo.getTime()));
        break;
      case SortType.PRICE:
        this._pointsModel.getPoints().slice().sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
    }

    return this._pointsModel.getPoints();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEventList();
    this._renderEvents(this._getPoints());
  }

  _renderSort() {
    render(this._routeContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(point) {
    const eventPresenter = new EventPresenter(this._eventsListViewComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(point);
    this._eventPresenter.set(point.id, eventPresenter);
  }

  _renderEvents(points) {
    render(this._routeContainer, this._eventsListViewComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < points.length; i++) {
      this._renderEvent(points[i]);
    }
  }

  _renderNoEvents() {
    render(this._routeContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _clearEventList() {
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();
  }

  _handleEventChange(updatedEvent) {
    // Здесь будем вызывать обновление модели
    this._eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  _handleModeChange() {
    this._eventPresenter.forEach((presenter) => presenter.resetMode());
  }

  _renderRoute() {
    if (this._getPoints().length === 0) {
      this._renderNoEvents();
    } else {
      this._renderSort();
      this._renderEvents(this._getPoints());
    }
  }
}
