import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const DutyOfficer = (props) => {
  if(props.dutyOfficer === null) {
    return null;
  }

  if(props.dutyOfficer.get('duty_officer_name') && props.dutyOfficer.get('duty_officer_phone')) { 
    return (
      <span>
        <b>Operations:</b><br />
        {props.dutyOfficer.get('duty_officer_name')}<br />
        {props.dutyOfficer.get('duty_officer_phone')}<br />
      </span>
    );
  }
  if(props.dutyOfficer.get('duty_officer_name')) {
    return (
      <span>
        <b>Operations:</b><br />
        {props.dutyOfficer.get('duty_officer_name')}<br />
      </span>
    );
  }
  if(props.dutyOfficer.get('duty_officer_phone')) {
    return (
      <span>
        <b>Operations:</b><br />
        {props.dutyOfficer.get('duty_officer_phone')}<br />
      </span>
    );
  }
  return null;
};

DutyOfficer.propTypes = {
  dutyOfficer: ImmutablePropTypes.map,
};

export default DutyOfficer;