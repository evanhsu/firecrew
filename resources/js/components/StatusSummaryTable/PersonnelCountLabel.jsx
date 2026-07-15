import { Badge } from '@mantine/core';
import PropTypes from 'prop-types';
import { FlightHelmetIcon } from '../FlightHelmetIcon';

const ICON_SIZE_BY_BADGE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
};

/**
 * Tag-style label for rappel personnel counts.
 */
export function PersonnelCountLabel({ count, size = 'lg', ...badgeProps }) {
    const value = Number.parseInt(count, 10);
    const safeCount = Number.isNaN(value) ? 0 : value;
    const iconSize = ICON_SIZE_BY_BADGE[size] ?? ICON_SIZE_BY_BADGE.sm;
    const unit = safeCount === 1 ? 'person' : 'people';

    return (
        <Badge
            variant="light"
            color="blue"
            radius="sm"
            size={size}
            aria-label={`${safeCount} ${unit}`}
            leftSection={
                <FlightHelmetIcon size={iconSize} weight="bold" aria-hidden />
            }
            bd="2px solid var(--badge-color)"
            styles={{
                root: {
                    '--badge-border-width': '2px',
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
    );
}

PersonnelCountLabel.propTypes = {
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    size: PropTypes.string,
};

export default PersonnelCountLabel;
