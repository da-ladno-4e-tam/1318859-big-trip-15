import {createEventTemplate} from './event.js';
import {createEventFormTemplate} from './event-form.js';

export const createRouteTemplate = (points) => {
  const formTemplate = createEventFormTemplate(points[0]);
  const eventsTemplate = points.map((point) => createEventTemplate(point)).join('');

  return `<ul class="trip-events__list">
${formTemplate}
${eventsTemplate}
</ul>`;
};
