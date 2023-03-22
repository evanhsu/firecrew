import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux-immutable';
import { summaryReducer } from '../containers/StatusSummary/summaryReducer';

const rootReducer = combineReducers({
    router: routerReducer,
    summary: summaryReducer,
});

export default rootReducer;
