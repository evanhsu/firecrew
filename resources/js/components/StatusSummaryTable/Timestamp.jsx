import { Text } from '@mantine/core';
import PropTypes from 'prop-types';
import Moment from 'moment';
import momentTz from 'moment-timezone';

const localDateString = (utcDateString) => {
    const localTimeZone = momentTz.tz.guess();
    const localTimeZoneAbbr = momentTz.tz.zone(localTimeZone).abbr(Moment.now());

    return `${Moment.utc(utcDateString).tz(localTimeZone).calendar()} ${localTimeZoneAbbr}`;
};

const Timestamp = ({ timestamp }) => {
    if (timestamp === undefined || timestamp === null) {
        return null;
    }

    return (
        <Text size="xs" c="dimmed">
            Updated {localDateString(timestamp)} ({Moment.utc(timestamp).fromNow()})
        </Text>
    );
};

Timestamp.propTypes = {
    timestamp: PropTypes.node,
};

Timestamp.defaultProps = {
    timestamp: null,
};

export default Timestamp;
