import { combineReducers } from 'redux-immutable';
import { summaryReducer } from '../containers/StatusSummary/summaryReducer';

const rootReducer = combineReducers({
    summary: summaryReducer,
});

export default rootReducer;
