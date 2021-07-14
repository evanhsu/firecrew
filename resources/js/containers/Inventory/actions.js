export const SELECT_ITEM_CATEGORY = 'SELECT_ITEM_CATEGORY';
export const selectItemCategory = (categoryName) => ({
  type: SELECT_ITEM_CATEGORY,
  categoryName,
});

export const TOGGLE_CATEGORY_MENU_DRAWER = 'TOGGLE_CATEGORY_MENU_DRAWER';
export const toggleCategoryMenuDrawer = () => ({
  type: TOGGLE_CATEGORY_MENU_DRAWER,
});

// export const SET_BOTTOM_DRAWER_STATE = 'SET_BOTTOM_DRAWER_STATE';
// export const setBottomDrawerState = (open) => {
//  return {
//    type: SET_BOTTOM_DRAWER_STATE,
//    open,
//  }
// }
