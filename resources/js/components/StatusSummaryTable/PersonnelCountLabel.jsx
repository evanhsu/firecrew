import { Badge, Tooltip } from '@mantine/core';
import PropTypes from 'prop-types';
import { FlightHelmetIcon } from '../FlightHelmetIcon';

const ICON_SIZE_BY_BADGE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
};

const ICON_ONLY_BADGE_STYLES = {
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
 * Tag-style label for rappel personnel counts.
 * Omit `count` to render an icon-only key/legend badge.
 */
export function PersonnelCountLabel({ count, size = 'lg', ...badgeProps }) {
    const iconOnly = count === undefined || count === null;
    const value = iconOnly ? null : Number.parseInt(count, 10);
    const safeCount = value === null || Number.isNaN(value) ? 0 : value;
    const iconSize = ICON_SIZE_BY_BADGE[size] ?? ICON_SIZE_BY_BADGE.sm;
    const unit = safeCount === 1 ? 'person' : 'personnel';
    const tooltipLabel = iconOnly
        ? 'Personnel currently staffing'
        : `${safeCount} ${unit} currently staffing`;
    const ariaLabel = iconOnly ? 'Staffing' : `${safeCount} ${unit}`;

    const icon = (
        <FlightHelmetIcon
            size={iconSize}
            weight="bold"
            aria-hidden
            style={iconOnly ? { display: 'block' } : undefined}
        />
    );

    return (
        <Tooltip label={tooltipLabel} withArrow openDelay={200}>
            <Badge
                variant="light"
                color="blue"
                radius="sm"
                size={size}
                aria-label={ariaLabel}
                leftSection={iconOnly ? undefined : icon}
                px={iconOnly ? 6 : undefined}
                bd="2px solid var(--badge-color)"
                styles={
                    iconOnly
                        ? ICON_ONLY_BADGE_STYLES
                        : {
                              root: {
                                  '--badge-border-width': '2px',
                              },
                              label: {
                                  minWidth: '2ch',
                                  textAlign: 'center',
                                  fontVariantNumeric: 'tabular-nums',
                              },
                          }
                }
                {...badgeProps}
            >
                {iconOnly ? icon : safeCount}
            </Badge>
        </Tooltip>
    );
}

PersonnelCountLabel.propTypes = {
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    size: PropTypes.string,
};

export default PersonnelCountLabel;
