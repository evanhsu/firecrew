import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const CrewInfo = (props) => (
  <span style={{ display: 'block' }}>
    <span style={{ fontWeight: 'bold', display: 'block' }}>{ props.crew.get('name') }</span>
    { props.crew.get('phone') }
  </span>
);

CrewInfo.propTypes = {
	crew: ImmutablePropTypes.map,
};

export default CrewInfo;