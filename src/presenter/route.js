import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import LoadingView from '../view/loading.js';
import NoEventsView from '../view/no-events.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import EventPresenter from './event.js';
import NewEventFormPresenter from './event-new.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import NewEventButtonView from '../view/new-event-button.js';

export default class Route {
  constructor(routeContainer, pointsModel, offersModel, destinationsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filterModel = filterModel;
    this._routeContainer = routeContainer;
    this._eventPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;
    this._api = api;

    this._sortComponent = null;
    this._noEventsComponent = null;

    this._eventsListViewComponent = new EventsListView();
    this._newEventButtonComponent = new NewEventButtonView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._newEventFormPresenter = new NewEventFormPresenter(
      this._eventsListViewComponent,
      this._handleViewAction,
      this._offersModel,
      this._destinationsModel,
      this._pointsModel,
    );
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderRoute();
    this._newEventButtonComponent.setNewPointClickHandler();
  }

  destroy() {
    this._clearRoute({resetSortType: true});

    remove(this._eventsListViewComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._newEventFormPresenter.init();
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._filterType](points);
    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return filteredPoints.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
      case SortType.TIME:
        return filteredPoints.sort((a, b) => (a.dateFrom.getTime() - a.dateTo.getTime()) - (b.dateFrom.getTime() - b.dateTo.getTime()));
      case SortType.PRICE:
        return filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
    }

    return filteredPoints;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearRoute();
    this._renderRoute();
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
    const eventPresenter = new EventPresenter(this._eventsListViewComponent, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel, this._pointsModel);
    eventPresenter.init(point);
    this._eventPresenter.set(point.id, eventPresenter);
  }

  _renderLoading() {
    render(this._routeContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvents(points) {
    render(this._routeContainer, this._eventsListViewComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < points.length; i++) {
      this._renderEvent(points[i]);
    }
  }

  _renderNoEvents() {
    this._noEventsComponent = new NoEventsView(this._filterType);
    render(this._routeContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        });
        break;
      case UserAction.DELETE_POINT:
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        /*        this._clearHeader({resetSortType: true});
                this._renderHeader();*/
        this._eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        /*        this._clearHeader({resetSortType: true});
                this._renderHeader();*/
        // фильтры
        this._clearRoute({resetSortType: true});
        this._renderRoute();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderRoute();
        break;
    }
  }

  _handleModeChange() {
    this._newEventFormPresenter.destroy();
    this._eventPresenter.forEach((presenter) => presenter.resetMode());
  }

  _clearRoute({resetSortType = false} = {}) {

    this._newEventFormPresenter.destroy();
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();

    remove(this._sortComponent);
    remove(this._loadingComponent);

    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderRoute() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
