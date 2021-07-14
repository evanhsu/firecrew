import { Map, List } from 'immutable';

import {
  REQUEST_ITEMS,
  RECEIVE_ITEMS_SUCCESS,
  RECEIVE_ITEMS_FAILURE,
} from './actions';

const initialState = new Map({
  data: List(),
  loading: false,
});

export const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ITEMS_SUCCESS:
      return state
        .set('loading', false)
        .set('data',
          action.payload.get('data')
            .map((item) => item.getIn(['attributes', 'category']))
            .toSet()
            .toList()
            .sort()
        );

    case RECEIVE_ITEMS_FAILURE:
      return state;

    case REQUEST_ITEMS:
      return state.set('loading', true);

    default:
      return state;
  }
};
