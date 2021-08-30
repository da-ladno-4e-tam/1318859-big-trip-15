import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import EventPresenter from './event.js';
import {SortType, UpdateType, UserAction} from '../const.js';

export default class Route {
  constructor(routeContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._routeContainer = routeContainer;
    this._eventPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;

    this._eventsListViewComponent = new EventsListView();
    // this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
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
    this._clearRoute({resetSortType: true});
    this._renderRoute();
    /*    this._clearEventList();
        this._renderEvents(this._getPoints());*/
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._routeContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(point) {
    const eventPresenter = new EventPresenter(this._eventsListViewComponent, this._handleViewAction, this._handleModeChange);
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        /*        this._clearHeader({resetSortType: true});
                this._renderHeader();*/
        this._eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MIDDLE:
        /*        this._clearHeader({resetSortType: true});
                this._renderHeader();*/
        // фильтры
        this._eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        /*        this._clearHeader({resetSortType: true});
                this._renderHeader();*/
        // фильтры
        this._clearRoute({resetSortType: true});
        this._renderRoute();
        break;
    }
  }

  _handleModeChange() {
    this._eventPresenter.forEach((presenter) => presenter.resetMode());
  }

  _clearRoute({resetSortType = false} = {}) {

    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();

    remove(this._sortComponent);
    remove(this._noEventsComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderRoute() {
    const points = this._getPoints();
    const pointCount = points.length;

    if (pointCount === 0) {
      this._renderNoEvents();
    } else {
      this._renderSort();
      this._renderEvents(this._getPoints());
    }
  }
}
