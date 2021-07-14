import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import StatusSummaryTable from '../../components/StatusSummaryTable';
import { selectSummary } from './selectors';
import {
  fetchSummary,
  receiveCrewStatusUpdate,
  receiveResourceStatusUpdate,
} from './actions';

class StatusSummary extends Component {
  componentDidMount() {
    this.props.fetchSummary();

    window.Echo.channel('publicStatusUpdates').listen('CrewStatusUpdated', (event) => {
      this.props.receiveCrewStatusUpdate(event);
    });

    window.Echo.channel('publicStatusUpdates').listen('ResourceStatusUpdated', (event) => {
      this.props.receiveResourceStatusUpdate(event);
    });

    this.timeout();
  }

  reRender() {
    this.forceUpdate();
    this.timeout();
  }

  timeout() {
    setTimeout(this.reRender, 10000);
  }

  render() {
    return (
      <StatusSummaryTable crews={this.props.crews} />
    );
  }
}

StatusSummary.propTypes = {
  crews: ImmutablePropTypes.list,
  fetchSummary: PropTypes.func.isRequired,
  receiveCrewStatusUpdate: PropTypes.func.isRequired,
  receiveResourceStatusUpdate: PropTypes.func.isRequired,
};

StatusSummary.defaultProps = {
  crews: fromJS([]),
};

function mapStateToProps(state) {
  return {
    crews: selectSummary()(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSummary: () => dispatch(fetchSummary()),
    receiveCrewStatusUpdate: (payload) => dispatch(receiveCrewStatusUpdate(payload)),
    receiveResourceStatusUpdate: (payload) => dispatch(receiveResourceStatusUpdate(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusSummary);
