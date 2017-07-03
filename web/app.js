'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import configure from './store';
import Sets from './sets';

import {PLACES} from './const';


const store = configure();


export default (elem) => render(
    <Provider store={store}><Sets /></Provider>, elem);
