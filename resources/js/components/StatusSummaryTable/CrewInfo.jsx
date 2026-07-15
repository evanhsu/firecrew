import { Anchor, Stack, Text } from '@mantine/core';
import ImmutablePropTypes from 'react-immutable-proptypes';

const CrewInfo = ({ crew }) => (
    <Stack gap={2}>
        <Text fw={700} size="lg" lh={1.2}>
            {crew.get('name')}
        </Text>
        {crew.get('phone') && (
            <Anchor href={`tel:${crew.get('phone')}`} size="sm" c="dimmed">
                {crew.get('phone')}
            </Anchor>
        )}
    </Stack>
);

CrewInfo.propTypes = {
    crew: ImmutablePropTypes.map,
};

export default CrewInfo;
