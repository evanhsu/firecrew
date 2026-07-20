import { Badge, Tooltip } from '@mantine/core';
import { ClockCountdownIcon } from '@phosphor-icons/react/dist/csr/ClockCountdown';
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
    },
    label: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
    },
};

/**
 * Compact badge indicating aircraft status data is stale (more than 18 hours old).
 */
export function NeedsUpdateLabel({ size = 'lg', ...badgeProps }) {
    const iconSize = ICON_SIZE_BY_BADGE[size] ?? ICON_SIZE_BY_BADGE.sm;

    return (
        <Tooltip
            label="This data is more than 18 hours old"
            withArrow
            openDelay={200}
        >
            <Badge
                variant="light"
                color="yellow"
                radius="sm"
                size={size}
                aria-label="Needs update: this data is more than 18 hours old"
                px={6}
                bd="2px solid var(--badge-color)"
                styles={BADGE_STYLES}
                {...badgeProps}
            >
                <ClockCountdownIcon
                    size={iconSize}
                    weight="bold"
                    aria-hidden
                    style={{ display: 'block' }}
                />
            </Badge>
        </Tooltip>
    );
}

NeedsUpdateLabel.propTypes = {
    size: PropTypes.string,
};

export default NeedsUpdateLabel;
