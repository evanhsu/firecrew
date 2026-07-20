import {
    Button,
    CloseButton,
    Group,
    ScrollArea,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import type { ReactNode } from 'react';
import MechanicalProblemLabel from '../StatusSummaryTable/MechanicalProblemLabel';
import {
    getMakeModelLabel,
    getRangeStatuteMiles,
    HelicopterProps,
    isMechanicalUnavailable,
} from './Helicopter';

export type AircraftDetailsContentProps = {
    helicopter: HelicopterProps;
    onClose?: () => void;
    /** When false, omit the title/close row (e.g. Drawer already provides a header). */
    withHeader?: boolean;
    onZoomToRange?: () => void;
};

const DetailRow = ({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) => (
    <div>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {label}
        </Text>
        <Text size="sm">{value || '—'}</Text>
    </div>
);

export const aircraftDetailsTitle = (helicopter: HelicopterProps) =>
    `${helicopter.tailnumber} · ${getMakeModelLabel(helicopter.makeModel)}`;

export const AircraftDetailsContent = ({
    helicopter,
    onClose,
    withHeader = true,
    onZoomToRange,
}: AircraftDetailsContentProps) => {
    const range = getRangeStatuteMiles(helicopter.makeModel);
    const mechanical = isMechanicalUnavailable(helicopter);

    return (
        <Stack gap="md" h="100%">
            {withHeader && (
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group
                        gap="sm"
                        wrap="nowrap"
                        align="center"
                        style={{ minWidth: 0 }}
                    >
                        <Title order={4} m={0}>
                            {aircraftDetailsTitle(helicopter)}
                        </Title>
                        {mechanical ? <MechanicalProblemLabel /> : null}
                    </Group>
                    {onClose && (
                        <CloseButton
                            aria-label="Close aircraft details"
                            onClick={onClose}
                        />
                    )}
                </Group>
            )}

            {onZoomToRange && range > 0 && (
                <Button variant="light" onClick={onZoomToRange} fullWidth>
                    Zoom to IA range
                </Button>
            )}

            <ScrollArea flex={1} offsetScrollbars type="auto">
                <Stack gap="md" pb="sm">
                    <DetailRow label="Crew" value={helicopter.crewName} />
                    <DetailRow
                        label="Assigned Fire"
                        value={helicopter.assignedFireName}
                    />
                    <DetailRow
                        label={helicopter.staffingCategory1 || 'Staffing'}
                        value={helicopter.staffingValue1}
                    />
                    <DetailRow
                        label="Spotter"
                        value={helicopter.managerName}
                    />
                    <DetailRow
                        label="Phone"
                        value={
                            helicopter.managerPhone ? (
                                <a href={`tel:${helicopter.managerPhone}`}>
                                    {helicopter.managerPhone}
                                </a>
                            ) : null
                        }
                    />
                    <DetailRow
                        label="IA Range (mi)"
                        value={range ? range.toFixed(0) : null}
                    />
                    <DetailRow
                        label="Updated"
                        value={helicopter.updatedAt.toLocaleString()}
                    />
                </Stack>
            </ScrollArea>
        </Stack>
    );
};
