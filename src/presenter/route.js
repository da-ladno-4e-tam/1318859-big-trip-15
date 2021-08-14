import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import EventFormView from '../view/event-form.js';
import EventView from '../view/event.js';
import NoEventsView from '../view/no-events.js';
import OffersView from '../view/offers.js';
import DestinationView from '../view/destination.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class Route {
  constructor(routeContainer) {
    this._routeContainer = routeContainer;
    this._eventsListViewComponent = new EventsListView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();
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
    const eventComponent = new EventView(point);
    const eventFormComponent = new EventFormView(point);
    const formOffersContainer = eventFormComponent.getElement().querySelector('.event__details');

    if (point.offers.offers.length) {
      render(formOffersContainer, new OffersView(point.offers), RenderPosition.BEFOREEND);
    }
    if (point.destination.description || point.destination.pictures.length) {
      render(formOffersContainer, new DestinationView(point.destination), RenderPosition.BEFOREEND);
    }

    const replaceEventToForm = () => {
      replace(eventFormComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventFormComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    eventComponent.setEditClickHandler(() => {
      replaceEventToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });
    eventFormComponent.setFormSubmitHandler(() => {
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });
    eventFormComponent.setEditClickHandler(() => {
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(this._eventsListViewComponent, eventComponent, RenderPosition.BEFOREEND);
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
