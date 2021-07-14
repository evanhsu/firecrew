import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import DispatchCenter from './DispatchCenter';

const ExtraInfoRow = (props) => (
    <span className="col-xs-12">
      <span className="col-xs-7"><DispatchCenter crew={props.crew} /></span>
      <span className="col-xs-5">Additional notes here</span>
    </span>
);

ExtraInfoRow.propTypes = {
	crew: ImmutablePropTypes.map,
};

export default ExtraInfoRow;
