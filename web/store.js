'use strict';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers';
import {PLACES} from './const';


const store = configure({
    sets: PLACES.reduce((o, k) => ({...o, [k]: {}}), {}),
    fetching: false
});


export default function configure(initialState) {
    return createStore(
        reducer,
        initialState,
        applyMiddleware(thunk)
    );
};
