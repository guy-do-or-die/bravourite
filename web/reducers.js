'use strict'

import {combineReducers} from 'redux';


export function fetching(state={}, action) {
    switch(action.type) {
        case 'FETCHING':
            return {...state, [action.place]: action.fetching};
        default:
            return state;
    };
};


export function sets(state={}, action) {
    switch(action.type) {
        case 'FETCHED':
            return {...state, [action.place]: action.sets};
        default:
            return state;
    };
};


export default combineReducers(
    {fetching, sets}
);
