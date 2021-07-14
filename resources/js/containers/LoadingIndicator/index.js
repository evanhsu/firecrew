import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class LoadingIndicator extends Component {
  render() {
    return (
      <RefreshIndicator left={125} top={5} size={30} status={this.props.loading ? 'loading' : 'hide'} />
    );
  }
}

LoadingIndicator.propTypes = {
  loading: PropTypes.bool,
};

LoadingIndicator.defaultProps = {
  loading: false,
};

function mapStateToProps(state) {
  return {
    loading: state.getIn(['items', 'loading']),
  };
}

export default connect(mapStateToProps)(LoadingIndicator);
