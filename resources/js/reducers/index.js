import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import { routerReducer } from 'react-router-redux';
import { categoryMenuDrawerOpen, selectedItemCategory } from '../containers/Inventory/reducer';
import { items } from '../containers/CategoryItemsTable/itemsReducer';
import { categoriesReducer } from '../containers/CategoryItemsTable/categoriesReducer';
import { selectedItemRowReducer } from '../containers/CategoryItemsTable/selectedItemRowReducer';
import { summaryReducer } from '../containers/StatusSummary/summaryReducer';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  categoryMenuDrawerOpen,
  form: formReducer,
  items,
  router: routerReducer,
  selectedItemCategory,
  selectedItemRow: selectedItemRowReducer,
  summary: summaryReducer,
});

export default rootReducer;
