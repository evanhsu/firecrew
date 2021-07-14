import {
  ITEM_ROW_SELECTED,
  ITEM_ROW_DESELECTED,
} from './actions';

const initialState = null;

export function selectedItemRowReducer(state = initialState, action) {
  switch (action.type) {
    case ITEM_ROW_SELECTED:
      return action.itemId;
    case ITEM_ROW_DESELECTED:
      return null;
    default:
      return state;
  }
}
