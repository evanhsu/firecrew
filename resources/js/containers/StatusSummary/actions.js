import { fromJS } from 'immutable';
// import { Summary } from '../objectDefinitions/Summary';

export const fetchSummary = () =>
  // Requires the `redux-thunk` library for making asynchronous calls.
  function (dispatch) {
    dispatch(requestSummary());

    return fetch('/api/summary', { credentials: 'same-origin' })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Bad HTTP Status: ${response.status}`);
      })
      .then((response) => {
        dispatch(receiveSummarySuccess(response));
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
        dispatch(receiveSummaryFailure(error));
      });
  };

/*
 * Don't call requestSummary() directly - it's dispatched from within `fetchSummary()`
 */
export const REQUEST_SUMMARY = 'REQUEST_SUMMARY';
export const requestSummary = () => ({
  type: REQUEST_SUMMARY,
});

/*
 * Don't call receiveSummarySuccess() directly - it's dispatched from within `fetchSummary()`
 */
export const RECEIVE_SUMMARY_SUCCESS = 'RECEIVE_SUMMARY_SUCCESS';
export const receiveSummarySuccess = (response) => ({
  type: RECEIVE_SUMMARY_SUCCESS,
  payload: fromJS(response),
});

export const RECEIVE_SUMMARY_FAILURE = 'RECEIVE_SUMMARY_FAILURE';
export const receiveSummaryFailure = (error) => ({
  type: RECEIVE_SUMMARY_FAILURE,
  error,
});

export const RECEIVE_CREW_STATUS_UPDATE = 'RECEIVE_CREW_STATUS_UPDATE';
export const receiveCrewStatusUpdate = (payload) => ({
  type: RECEIVE_CREW_STATUS_UPDATE,
  payload: fromJS(payload),
});

export const RECEIVE_RESOURCE_STATUS_UPDATE = 'RECEIVE_RESOURCE_STATUS_UPDATE';
export const receiveResourceStatusUpdate = (payload) => ({
  type: RECEIVE_RESOURCE_STATUS_UPDATE,
  payload: fromJS(payload),
});
