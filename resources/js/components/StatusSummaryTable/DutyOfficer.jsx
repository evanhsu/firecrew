import { Anchor, Text } from '@mantine/core';
import ImmutablePropTypes from 'react-immutable-proptypes';

const DutyOfficer = ({ dutyOfficer }) => {
    if (!dutyOfficer) {
        return null;
    }

    const name = dutyOfficer.get('duty_officer_name');
    const phone = dutyOfficer.get('duty_officer_phone');

    if (!name && !phone) {
        return null;
    }

    return (
        <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Operations
            </Text>
            {name && (
                <Text size="sm" lh={1.3}>
                    {name}
                </Text>
            )}
            {phone && (
                <Anchor href={`tel:${phone}`} size="sm">
                    {phone}
                </Anchor>
            )}
        </div>
    );
};

DutyOfficer.propTypes = {
    dutyOfficer: ImmutablePropTypes.map,
};

export default DutyOfficer;
