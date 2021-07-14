import { Map } from 'immutable';
// import { Item } from '../../objectDefinitions/Item';

import {
  REQUEST_ITEMS,
  RECEIVE_ITEMS_SUCCESS,
  RECEIVE_ITEMS_FAILURE,
  UPDATE_ITEM_REQUEST,
  UPDATE_ITEM_SUCCESS,
  UPDATE_ITEM_FAILURE,
  DECREMENT_ITEM_REQUEST,
  DECREMENT_ITEM_SUCCESS,
  DECREMENT_ITEM_FAILURE,
  INCREMENT_ITEM_REQUEST,
  INCREMENT_ITEM_SUCCESS,
  INCREMENT_ITEM_FAILURE,
} from './actions';

const initialState = new Map({
  data: new Map(),
  loading: false,
});

export const items = (state = initialState, action) => {
  const currentQty = Map.isMap(action.payload) ? state.getIn(['data', action.payload.get('id'), 'quantity']) : null;

  switch (action.type) {
    case RECEIVE_ITEMS_SUCCESS:
      return state
        .set('loading', false)
        .set('data', action.payload.get('data').reduce(
          (lookup, item) => (
            lookup.set(item.get('id'), item)
          ), new Map()
        )
        );
      // .reduce(
      //  (lookup, item) => lookup.set(item.get('id'), new Item(item)),
      //  Map()
      // ));

    case RECEIVE_ITEMS_FAILURE:
      return state.set('loading', false);

    case REQUEST_ITEMS:
      return state.set('loading', true);

    case UPDATE_ITEM_REQUEST:
      return state
        .set('loading', true);

    case UPDATE_ITEM_SUCCESS:
      return state
        .set('loading', false)
        .setIn(['data', action.payload.getIn(['data', 'id']), 'attributes'], action.payload.getIn(['data', 'attributes']));

    case UPDATE_ITEM_FAILURE:
      return state
        .set('loading', false);

    case INCREMENT_ITEM_REQUEST:
      return state
        .set('loading', true)
        .setIn(['data', action.itemId, 'quantity'], currentQty + 1);

    case INCREMENT_ITEM_SUCCESS:
      return state.set('loading', false);

    case INCREMENT_ITEM_FAILURE:
      return state
        .set('loading', false)
        .setIn(['data', action.itemId, 'quantity'], currentQty - 1);

    case DECREMENT_ITEM_REQUEST:
      return state
        .set('loading', true)
        .setIn(['data', action.itemId, 'quantity'], currentQty - 1);

    case DECREMENT_ITEM_SUCCESS:
      return state.set('loading', false);

    case DECREMENT_ITEM_FAILURE:
      return state
        .set('loading', false)
        .setIn(['data', action.itemId, 'quantity'], currentQty + 1);

    default:
      return state;
  }
};
