import { fromJS, Map } from 'immutable';
// import { Summary } from '../../objectDefinitions/Summary';

import {
  REQUEST_SUMMARY,
  RECEIVE_SUMMARY_SUCCESS,
  RECEIVE_SUMMARY_FAILURE,
  RECEIVE_CREW_STATUS_UPDATE,
  RECEIVE_RESOURCE_STATUS_UPDATE,
} from './actions';

const indexOfCrew = (state, crewId) => (state.get('data').findLastKey((crew) => (
  crew.get('id') === crewId
)));

const indexOfResource = (state, crewIndex, resourceId) => (state.getIn(['data', crewIndex, 'statusable_resources']).findLastKey((resource) => (
  resource.get('id') === resourceId
)));

const initialState = new Map({
  data: fromJS([]),
  loading: false,
});

export const summaryReducer = (state = initialState, action) => {
  let crewIndex;
  switch (action.type) {
    case RECEIVE_SUMMARY_SUCCESS:
      return state
        .set('loading', false)
        .set('data', action.payload);

    case RECEIVE_SUMMARY_FAILURE:
      return state.set('loading', false);

    case REQUEST_SUMMARY:
      return state.set('loading', true);

    case RECEIVE_CREW_STATUS_UPDATE:
      crewIndex = indexOfCrew(state, action.payload.getIn(['status', 'crew_id']));
      return state
        .mergeDeepIn([
          'data',
          crewIndex,
        ], action.payload)
        .setIn(['data', crewIndex, 'updated_at'], action.payload.getIn(['status', 'updated_at']));

    case RECEIVE_RESOURCE_STATUS_UPDATE:
      crewIndex = indexOfCrew(state, action.payload.get('crewId'));
      return state
        .mergeDeepIn([
          'data',
          crewIndex,
          'statusable_resources',
          indexOfResource(state, crewIndex, action.payload.getIn(['resourceStatus', 'statusable_resource_id'])),
          'latest_status',
        ], action.payload.get('resourceStatus'))
        .setIn(['data', crewIndex, 'updated_at'], action.payload.getIn(['resourceStatus', 'updated_at']));

    default:
      return state;
  }
};

