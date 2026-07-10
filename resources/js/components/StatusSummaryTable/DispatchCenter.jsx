import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const renderDispatch24HourPhone = (crew) => (
  crew.get('dispatch_center_24_hour_phone') === null ? null : <div style={{ paddingLeft: 15 }}>24-hour: {crew.get('dispatch_center_24_hour_phone')}</div>
);

const renderDispatchDaytimePhone = (crew) => (
  crew.get('dispatch_center_daytime_phone') === null ? null : <div style={{ paddingLeft: 15 }}>Daytime: {crew.get('dispatch_center_daytime_phone')}</div>
);

const DispatchCenter = (props) => (
  props.crew.get('dispatch_center_name') ? (
    <span>
      {props.crew.get('dispatch_center_name')} ({props.crew.get('dispatch_center_identifier')})<br />
      {renderDispatchDaytimePhone(props.crew)}
      {renderDispatch24HourPhone(props.crew)}
    </span>
  ) : null
);

DispatchCenter.propTypes = {
	crew: ImmutablePropTypes.map,
}

export default DispatchCenter;
