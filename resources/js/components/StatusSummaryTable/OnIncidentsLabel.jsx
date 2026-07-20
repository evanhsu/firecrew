import { Badge, Tooltip } from '@mantine/core';
import PropTypes from 'prop-types';
import { PulaskiIcon } from '../PulaskiIcon';

const ICON_SIZE_BY_BADGE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
};

/**
 * Tag-style label for personnel currently on staffed incidents.
 * Uses a dark fire-red on a light tint so text/icon stay readable.
 */
export function OnIncidentsLabel({ count, size = 'lg', ...badgeProps }) {
    const value = Number.parseInt(count, 10);
    const safeCount = Number.isNaN(value) ? 0 : value;
    const iconSize = ICON_SIZE_BY_BADGE[size] ?? ICON_SIZE_BY_BADGE.sm;
    const unit = safeCount === 1 ? 'person' : 'personnel';

    return (
        <Tooltip
            label={`${safeCount} ${unit} currently on incidents`}
            withArrow
            openDelay={200}
        >
            <Badge
                variant="light"
                color="red"
                radius="sm"
                size={size}
                aria-label={`${safeCount} ${unit} on incidents`}
                leftSection={
                    <PulaskiIcon size={iconSize} weight="bold" aria-hidden />
                }
                bd="2px solid var(--badge-color)"
                styles={{
                    root: {
                        '--badge-border-width': '2px',
                        // Darken the light-variant text/icon for WCAG AA contrast on red tint
                        '--badge-color': 'var(--mantine-color-red-9)',
                        '--badge-bg': 'var(--mantine-color-red-1)',
                    },
                    label: {
                        minWidth: '2ch',
                        textAlign: 'center',
                        fontVariantNumeric: 'tabular-nums',
                    },
                }}
                {...badgeProps}
            >
                {safeCount}
            </Badge>
        </Tooltip>
    );
}

OnIncidentsLabel.propTypes = {
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    size: PropTypes.string,
};

export default OnIncidentsLabel;
