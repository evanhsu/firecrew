import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter } from 'react-router-dom';
import { List } from 'immutable';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

function CategoryMenu(props) {
  const handleClick = (category) => () => props.history.push(`/crew/${props.match.params.crewId}/inventory/${category}`);

  const renderRows = () => props.categories.map((category) => (<MenuItem key={category} primaryText={category} onTouchTap={handleClick(category)} />));

  return (
    <Menu>
      { renderRows() }
    </Menu>
  );
}

CategoryMenu.propTypes = {
  categories: ImmutablePropTypes.list,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

CategoryMenu.defaultProps = {
  categories: new List(),
};

export default withRouter(CategoryMenu);
