import {createEventTemplate} from './event.js';
import {createEditingEventFormTemplate} from './editing-event-form.js';
import {createAddingEventFormTemplate} from './adding-event-form.js';

export const createRouteTemplate = (points) => {
  const editingFormTemplate = createEditingEventFormTemplate();
  const addingFormTemplate = createAddingEventFormTemplate();
  const eventsTemplate = points.map((point) => createEventTemplate(point)).join('');

  return `<ul class="trip-events__list">
${addingFormTemplate}
${editingFormTemplate}
${eventsTemplate}
</ul>`;
};
