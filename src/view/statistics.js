// import dayjs from 'dayjs';
// import flatpickr from 'flatpickr';
import SmartView from './smart.js';

const createStatisticsTemplate = () => {
  const tripEventsCount = 0; // Нужно посчитать количество завершенных задач за период

  return `<section class="statistic container">
    <div class="statistic__line">
      <div class="statistic__period">
        <h2 class="statistic__period-title">Trip DIAGRAM</h2>

<!--        <div class="statistic-input-wrap">-->
<!--          <input class="statistic__period-input" type="text" placeholder="">-->
<!--        </div>-->

        <p class="statistic__period-result">
          There were a total of
          <span class="statistic__task-found">${tripEventsCount}</span>
          events during the trip.
        </p>
      </div>
      <div class="statistic__line-graphic">
        <canvas class="statistic__days" width="550" height="150"></canvas>
      </div>
    </div>

    <div class="statistic__circle">
      <div class="statistic__colors-wrap">
        <canvas class="statistic__colors" width="400" height="300"></canvas>
      </div>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    // this._data = {
    //   points,
    //   // По условиям техзадания по умолчанию интервал - неделя от текущей даты
    //   dateFrom: (() => {
    //     const daysToFullWeek = 6;
    //     return dayjs().subtract(daysToFullWeek, 'day').toDate();
    //   })(),
    //   dateTo: dayjs().toDate(),
    // };

    this._data = points;

    // this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
    // this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    // if (this._datepicker) {
    //   this._datepicker.destroy();
    //   this._datepicker = null;
    // }
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    // this._setDatepicker();
  }

  // _dateChangeHandler([dateFrom, dateTo]) {
  //   if (!dateFrom || !dateTo) {
  //     return;
  //   }
  //
  //   this.updateData({
  //     dateFrom,
  //     dateTo,
  //   });
  // }

  // _setDatepicker() {
  //   if (this._datepicker) {
  //     this._datepicker.destroy();
  //     this._datepicker = null;
  //   }
  //
  //   this._datepicker = flatpickr(
  //     this.getElement().querySelector('.statistic__period-input'),
  //     {
  //       mode: 'range',
  //       dateFormat: 'j F',
  //       defaultDate: [this._data.dateFrom, this._data.dateTo],
  //       onChange: this._dateChangeHandler,
  //     },
  //   );
  // }

  _setCharts() {
    // Нужно отрисовать два графика
  }
}
