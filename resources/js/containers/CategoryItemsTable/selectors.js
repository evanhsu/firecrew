import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { getRouteParam } from '../../helpers/routing';

const selectItems = () => (state) => state.getIn(['items', 'data'], new Map());
const selectLoading = () => (state) => state.getIn(['items', 'loading'], false);
const selectSelectedItemRow = () => (state) => parseInt(state.get('selectedItemRow'), 10);
const selectCategories = () => (state) => state.getIn(['categories', 'data'], new Map());

// const selectItems = () => createSelector(
//         [selectRawItems()],
//         (rawItems) => rawItems.map((item) => new Item(item))
// );

const selectActiveCategory = () => createSelector(
  [selectCategories(), (state, props) => getRouteParam(props, 'category', false)],
  (categories, selectedCategory) => (selectedCategory === null) ? categories.keySeq().first() : selectedCategory
);

const selectActiveCategoryItems = () => createSelector(
  [selectItems(), selectActiveCategory()],
  (items, activeCategory) => items.filter(
    (item) => item.getIn(['attributes', 'category']).toLowerCase() === activeCategory.toLowerCase()
  )
);

const selectAccountableItems = () => createSelector(
  [selectActiveCategoryItems()],
  (items) => items.filter(
    (item) => item.getIn(['attributes', 'type']) === 'accountable'
  )
);


const selectBulkItems = () => createSelector(
  [selectActiveCategoryItems()],
  (items) => items.filter(
    (item) => item.getIn(['attributes', 'type']) === 'bulk'
  )
);


const selectBulkIssuedItems = () => createSelector(
  [selectActiveCategoryItems()],
  (items) => items.filter(
    (item) => item.getIn(['attributes', 'type']) === 'bulk_issued'
  )
);

const selectCategoryItemsTable = () => createSelector(
  [
    selectLoading(),
    selectSelectedItemRow(),
    selectActiveCategory(),
    selectAccountableItems(),
    selectBulkItems(),
    selectBulkIssuedItems(),
  ],
  (loading, selectedItemRow, category, accountableItems, bulkItems, bulkIssuedItems) => ({
    loading,
    selectedItemRow,
    category,
    accountableItems,
    bulkItems,
    bulkIssuedItems,
  })
);

export default selectCategoryItemsTable;
export {
  selectItems,
  selectLoading,
  selectCategories,
  selectSelectedItemRow,
  selectActiveCategory,
  selectActiveCategoryItems,
  selectAccountableItems,
  selectBulkItems,
  selectBulkIssuedItems,
};
