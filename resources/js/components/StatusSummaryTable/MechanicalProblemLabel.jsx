import { Badge, Tooltip } from '@mantine/core';
import { WrenchIcon } from '@phosphor-icons/react/dist/csr/Wrench';
import PropTypes from 'prop-types';

const ICON_SIZE_BY_BADGE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
};

const BADGE_STYLES = {
    root: {
        '--badge-border-width': '2px',
        // Darken the light-variant text/icon for WCAG AA contrast on red tint
        '--badge-color': 'var(--mantine-color-red-9)',
        '--badge-bg': 'var(--mantine-color-red-1)',
    },
    label: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
    },
};

/**
 * Compact badge indicating an aircraft has a mechanical problem.
 */
export function MechanicalProblemLabel({ size = 'lg', ...badgeProps }) {
    const iconSize = ICON_SIZE_BY_BADGE[size] ?? ICON_SIZE_BY_BADGE.sm;

    return (
        <Tooltip label="Unavailable: Mechanical" withArrow openDelay={200}>
            <Badge
                variant="light"
                color="red"
                radius="sm"
                size={size}
                aria-label="Unavailable due to mechanical problem"
                px={6}
                bd="2px solid var(--badge-color)"
                styles={BADGE_STYLES}
                {...badgeProps}
            >
                <WrenchIcon
                    size={iconSize}
                    weight="bold"
                    aria-hidden
                    style={{ display: 'block' }}
                />
            </Badge>
        </Tooltip>
    );
}

MechanicalProblemLabel.propTypes = {
    size: PropTypes.string,
};

export default MechanicalProblemLabel;
