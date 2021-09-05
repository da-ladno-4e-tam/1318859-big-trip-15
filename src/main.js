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
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';
import Api from './api.js';

import {getData} from './mock/task.js';
import {render, RenderPosition, remove} from './utils/render.js';

const AUTHORIZATION = 'Basic daladno4etamschasvsyobudet';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const points = getData();
const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((points) => {
  console.log(points);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const towns = points.map((point) => point.destination.name);
const startDates = points.map((point) => point.dateFrom);
const finishDates = points.map((point) => point.dateTo);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const tripInfoContainer = headerElement.querySelector('.trip-main');
const menuContainer = headerElement.querySelector('.trip-controls__navigation');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainContentContainer = mainElement.querySelector('.trip-events');

const menuComponent = new MenuView();

const newEventButton = new NewEventButtonView();
render(tripInfoContainer, newEventButton, RenderPosition.BEFOREEND);
render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
const tripInfoSection = new TripInfoSectionView();
render(tripInfoContainer, tripInfoSection, RenderPosition.AFTERBEGIN);
render(tripInfoSection, new TripCostView(points), RenderPosition.BEFOREEND);
const tripInfoMain = new TripInfoMainView();
render(tripInfoSection, tripInfoMain, RenderPosition.AFTERBEGIN);
render(tripInfoMain, new TripTitleView(towns), RenderPosition.BEFOREEND);
render(tripInfoMain, new TripDatesView(startDates, finishDates), RenderPosition.BEFOREEND);

export const routePresenter = new RoutePresenter(mainContentContainer, pointsModel, filterModel);
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

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
routePresenter.init();
