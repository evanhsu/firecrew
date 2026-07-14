import type { ImgHTMLAttributes } from 'react';

export type HelicopterIconState = 'fresh' | 'stale';

export type HelicopterIconProps = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'children'
> & {
    /** Fresh = recently updated (dark); stale = older position (gray). */
    state?: HelicopterIconState;
    /** Convenience alias for `state={fresh ? 'fresh' : 'stale'}`. */
    fresh?: boolean;
};

const ICON_PATH = '/images/symbols';

export const HELICOPTER_ICON_URLS = {
    fresh: `${ICON_PATH}/rappelhelicopter-fresh-transparent.png`,
    stale: `${ICON_PATH}/rappelhelicopter-stale-transparent.png`,
} as const;

export function getHelicopterIconSrc(
    state: HelicopterIconState = 'fresh'
): string {
    return HELICOPTER_ICON_URLS[state];
}

/**
 * Top-down rappel helicopter marker. Uses transparent PNGs; switches
 * fresh vs stale via `state` / `fresh`.
 */
export function HelicopterIcon({
    state,
    fresh,
    width = 65,
    height = 65,
    alt,
    style,
    ...rest
}: HelicopterIconProps) {
    const resolved: HelicopterIconState =
        state ?? (fresh === false ? 'stale' : 'fresh');

    return (
        <img
            src={getHelicopterIconSrc(resolved)}
            alt={alt ?? ''}
            width={width}
            height={height}
            draggable={false}
            style={{ display: 'block', ...style }}
            {...rest}
        />
    );
}
