import AbstractObserver from '../utils/abstract-observer.js';
import dayjs from 'dayjs';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  parsePointToData(point) {
    const data = Object.assign(
      {},
      JSON.parse(JSON.stringify(point)),
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
    data.dateFrom = dayjs(data.dateFrom).toDate();
    data.dateTo = dayjs(data.dateTo).toDate();
    return data;
  }

  parseDataToPoint(data) {
    const point = JSON.parse(JSON.stringify(data));
    point.dateFrom = dayjs(point.dateFrom).toDate();
    point.dateTo = dayjs(point.dateTo).toDate();

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return point;
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        dateFrom: dayjs(point['date_from']).toDate(),
        dateTo: dayjs(point['date_to']).toDate(),
        basePrice: point['base_price'],
        isFavorite: point['is_favorite'],
      },
    );
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.dateFrom.toISOString(),
        'date_to': point.dateTo.toISOString(),
        'base_price': point.basePrice,
        'is_favorite': point.isFavorite,
      },
    );
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
