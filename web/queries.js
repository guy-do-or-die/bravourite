'use strict';

export default {
    sets: (place) => {
        return `
            {
                sets(place: "${place}") {
                    id,
                    artist,
                    location
                    thumb,
                    tags
                }
            }
        `;
    }
};
