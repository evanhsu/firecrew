import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CategoryMenu from '../CategoryMenu';
import CategoryItemsTable from '../CategoryItemsTable';
import LoadingIndicator from '../LoadingIndicator';

import { selectCategories } from '../CategoryItemsTable/selectors';
import { toggleCategoryMenuDrawer } from './actions';
import { fetchItems } from '../CategoryItemsTable/actions';

class Inventory extends Component {
  componentDidMount() {
    this.props.fetchItems();
  }
  
  render() {
    return (
      <div className="col-xs-12">
        <div className="drawer-toggle-button">
          <RaisedButton label="Categories" primary onClick={this.props.toggleCategoryMenuDrawer} />
        </div>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h1 className="panel-title">Inventory</h1>
            <LoadingIndicator />
          </div>
          <div className="panel-body">
            <Drawer
              docked={false}
              width={350}
              open={this.props.categoryMenuDrawerOpen}
              onRequestChange={this.props.toggleCategoryMenuDrawer}
            >
              <CategoryMenu categories={this.props.categories} />
            </Drawer>
            <Route path={`${this.props.match.url}/:category`} component={CategoryItemsTable} />
          </div>
        </div>
      </div>
    );
  }
}

Inventory.propTypes = {
  categories: ImmutablePropTypes.list,
  categoryMenuDrawerOpen: PropTypes.bool,
  fetchItems: PropTypes.func,
  toggleCategoryMenuDrawer: PropTypes.func.isRequired,
};

Inventory.defaultProps = {
  categories: new List(),
  categoryMenuDrawerOpen: false,
};

function mapStateToProps(state) {
  return {
    categories: selectCategories()(state),
    categoryMenuDrawerOpen: state.get('categoryMenuDrawerOpen'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleCategoryMenuDrawer: () => dispatch(toggleCategoryMenuDrawer()),
    fetchItems: () => dispatch(fetchItems()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
