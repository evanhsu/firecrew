import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { fromJS } from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Perf from 'react-addons-perf';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import rootReducer from './reducers';
import Routes from './routes';

require('./bootstrap');

// Needed for onTouchTap (Material-UI)
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// React perf addon - for debugging performance issues
window.Perf = Perf;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle
const initialState = fromJS({});

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
);

if (document.getElementById('react-root')) {
    console.log('found react-root');
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <MuiThemeProvider>
                    <Routes />
                </MuiThemeProvider>
            </BrowserRouter>
        </Provider>,
        document.getElementById('react-root')
    );
}
