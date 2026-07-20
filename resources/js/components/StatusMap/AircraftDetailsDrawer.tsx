import { Drawer, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import MechanicalProblemLabel from '../StatusSummaryTable/MechanicalProblemLabel';
import {
    AircraftDetailsContent,
    aircraftDetailsTitle,
} from './AircraftDetailsContent';
import {
    DESKTOP_DRAWER_WIDTH_PX,
    MOBILE_DRAWER_SIZE,
} from './detailsLayout';
import { HelicopterProps, isMechanicalUnavailable } from './Helicopter';

export type AircraftDetailsDrawerProps = {
    helicopter: HelicopterProps | null;
    opened: boolean;
    onClose: () => void;
    onZoomToRange?: () => void;
};

/**
 * No-overlay drawer so the map stays pannable/zoomable while details are open.
 * Desktop: right side. Mobile: short bottom sheet with scrollable body.
 */
export const AircraftDetailsDrawer = ({
    helicopter,
    opened,
    onClose,
    onZoomToRange,
}: AircraftDetailsDrawerProps) => {
    const isDesktop = useMediaQuery('(min-width: 62em)');
    const mechanical =
        helicopter !== null && isMechanicalUnavailable(helicopter);

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position={isDesktop ? 'right' : 'bottom'}
            size={isDesktop ? DESKTOP_DRAWER_WIDTH_PX : MOBILE_DRAWER_SIZE}
            padding="md"
            withOverlay={false}
            lockScroll={false}
            trapFocus={false}
            closeOnClickOutside={false}
            title={
                helicopter ? (
                    <Group gap="sm" wrap="nowrap" align="center">
                        <span>{aircraftDetailsTitle(helicopter)}</span>
                        {mechanical ? <MechanicalProblemLabel /> : null}
                    </Group>
                ) : (
                    'Aircraft'
                )
            }
            styles={{
                content: {
                    borderLeft: isDesktop
                        ? '1px solid var(--mantine-color-gray-4)'
                        : undefined,
                    borderTop: isDesktop
                        ? undefined
                        : '1px solid var(--mantine-color-gray-4)',
                },
                body: {
                    height: 'calc(100% - 60px)',
                    overflow: 'hidden',
                    paddingTop: 0,
                },
                header: {
                    minHeight: 48,
                    paddingBottom: 8,
                },
            }}
        >
            {helicopter && (
                <AircraftDetailsContent
                    helicopter={helicopter}
                    withHeader={false}
                    onZoomToRange={onZoomToRange}
                />
            )}
        </Drawer>
    );
};
