'use strict';

import 'whatwg-fetch';

import queries from './queries';
import {PLACES} from './const';


export function fetching(place, fetching) {
    return {
        type: 'FETCHING',
        place, fetching
    };
};


export function fetched(place, sets) {
    return {
        type: 'FETCHED',
        place, sets
    };
};


export function fetchAction() {
    return dispatch => {
        PLACES.map((place) => {
            dispatch(fetching(place, true));

            fetch('/api/sets', {
                  method:'POST',
                  headers: {'Content-Type': 'application/graphql'},
                  body: queries.sets(place)})
                .then(resp => resp.json())
                .then(json => {
                    if (json.errors) {
                        dispatch(fetching(place, false));
                    } else {
                        dispatch(fetched(place, json.data.sets[0]))
                            .then(dispatch(fetching(place, false)));
                    }
            }).catch(() => {
                dispatch(fetching(place, false));
            });
        })
    };
};
