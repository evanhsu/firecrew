import './legacy-ui';
import './crews-edit';

import '@mantine/core/styles.css';

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import { MantineProvider } from '@mantine/core';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { RouterProvider } from 'react-router/dom';
import { fromJS } from 'immutable';
import rootReducer from './reducers';
import router from './routes';
import { AppFooter } from './layout/AppFooter';
import { AppHeader } from './layout/AppHeader';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}

window.Pusher = Pusher;

const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

if (pusherKey) {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: pusherKey,
        cluster: pusherCluster,
        forceTLS: true,
    });
} else {
    window.Echo = {
        channel: () => ({
            listen: () => window.Echo,
        }),
    } as Echo;
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle
const initialState = fromJS({});

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
);

const shellContainer = document.getElementById('react-shell');
if (shellContainer) {
    ReactDOMClient.createRoot(shellContainer).render(
        <MantineProvider>
            <AppHeader />
            <AppFooter />
        </MantineProvider>
    );
}

const pageContainer = document.getElementById('react-root');
if (pageContainer) {
    ReactDOMClient.createRoot(pageContainer).render(
        <MantineProvider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </MantineProvider>
    );
}
