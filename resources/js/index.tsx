import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { RouterProvider } from 'react-router-dom';
import { fromJS } from 'immutable';
import rootReducer from './reducers';
import router from './routes';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle
const initialState = fromJS({});

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
);

const container = document.getElementById('react-root');
if (container) {
    ReactDOMClient.createRoot(container).render(
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}
