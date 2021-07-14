import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import momentTz from 'moment-timezone';

const localDateString = (utcDateString) => {
  const localTimeZone = momentTz.tz.guess();
  const localTimeZoneAbbr = momentTz.tz.zone(localTimeZone).abbr(Moment.now());

  return `${Moment.utc(utcDateString).tz(localTimeZone).calendar()} ${localTimeZoneAbbr}`;
};

const Timestamp = ({ timestamp }) => (
  timestamp === undefined ? null :
    (<span style={{ fontSize: 11 }}>Update: {localDateString(timestamp)} ({Moment.utc(timestamp).fromNow()})</span>)
);

Timestamp.propTypes = {
  timestamp: PropTypes.node,
};
Timestamp.defaultProps = {
  timestamp: null,
};

export default Timestamp;
