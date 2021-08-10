import AbstractView from './abstract.js';

const createDestinationTemplate = (destination) => {
  const {
    description = '',
    pictures = [],
  } = destination;

  const destinationPictureTemplate = (picture = {}) => {
    const src = picture.src ? picture.src : '';
    const pictureDescription = picture.description ? picture.description : '';

    return `<img class="event__photo" src="${src}" alt="${pictureDescription}">`;
  };
  const destinationGallery = pictures.map((picture) => destinationPictureTemplate(picture)).join('');

  return (description || pictures.length) ? `<section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${description}</p>

                  <div class="event__photos-container">
                    <div class="event__photos-tape">
                      ${destinationGallery}
                    </div>
                  </div>
                </section>` : '';
};

export default class Destination extends AbstractView {
  constructor(destination) {
    super();
    this._destination = destination;
  }

  getTemplate() {
    return createDestinationTemplate(this._destination);
  }
}
