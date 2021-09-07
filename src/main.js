import MenuView from './view/menu.js';
import NewEventButtonView from './view/new-event-button.js';
import TripInfoSectionView from './view/trip-info-section.js';
import TripInfoMainView from './view/trip-info-main.js';
import TripTitleView from './view/trip-title.js';
import TripDatesView from './view/trip-dates.js';
import TripCostView from './view/trip-cost.js';
import StatisticsView from './view/statistics.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType, END_POINT, AUTHORIZATION} from './const.js';
import Api from './api.js';
// import {getData} from './mock/task.js';
import {render, RenderPosition, remove} from './utils/render.js';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');

// const points = getData();
const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const menuComponent = new MenuView();

const newEventButton = new NewEventButtonView();
render(tripInfoContainer, newEventButton, RenderPosition.BEFOREEND);
const tripInfoSection = new TripInfoSectionView();
render(tripInfoContainer, tripInfoSection, RenderPosition.AFTERBEGIN);
const tripInfoMain = new TripInfoMainView();
render(tripInfoSection, tripInfoMain, RenderPosition.AFTERBEGIN);

export const routePresenter = new RoutePresenter(mainContentContainer, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filtersContainer, filterModel, pointsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      routePresenter.init();
      remove(statisticsComponent);
      menuComponent.setMenuItem(MenuItem.POINTS);
      document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
      break;
    case MenuItem.STATISTICS:
      routePresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(mainContentContainer, statisticsComponent, RenderPosition.BEFOREEND);
      menuComponent.setMenuItem(MenuItem.STATISTICS);
      document.querySelector('.trip-main__event-add-btn').setAttribute('disabled', 'disabled');
      break;
  }
};

routePresenter.init();

/*api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);

    const tripTowns = points.map((point) => point.destination.name);
    const startDates = points.map((point) => point.dateFrom);
    const finishDates = points.map((point) => point.dateTo);

    render(tripInfoSection, new TripCostView(points), RenderPosition.BEFOREEND);
    render(tripInfoMain, new TripTitleView(tripTowns), RenderPosition.BEFOREEND);
    render(tripInfoMain, new TripDatesView(startDates, finishDates), RenderPosition.BEFOREEND);
    render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
    filterPresenter.init();
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.init();
  });*/

const points = api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

const offers = api.getOffers()
  .then((offers) => {
    console.log(offers);
    offersModel.setOffers(offers);
    console.log(offersModel.getOffers());
  })
  .catch(() => {
    offersModel.setOffers([]);
  });

const destinations = api.getDestinations()
  .then((destinations) => {
    console.log(destinations);
    destinationsModel.setDestinations(destinations);
    console.log(destinationsModel.getDestinations());
  })
  .catch(() => {
    destinationsModel.setDestinations([]);
  });

Promise.all([offers, destinations, points])
  .then((points) => {
    const tripTowns = points.map((point) => point.destination.name);
    const startDates = points.map((point) => point.dateFrom);
    const finishDates = points.map((point) => point.dateTo);

    render(tripInfoSection, new TripCostView(points), RenderPosition.BEFOREEND);
    render(tripInfoMain, new TripTitleView(tripTowns), RenderPosition.BEFOREEND);
    render(tripInfoMain, new TripDatesView(startDates, finishDates), RenderPosition.BEFOREEND);
    render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
    filterPresenter.init();
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.init();
  });
