import type { ImgHTMLAttributes, CSSProperties } from 'react';

export type HelicopterIconState = 'fresh' | 'stale';

export type HelicopterIconProps = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'children'
> & {
    /** Fresh = recently updated (dark); stale = older position (gray). */
    state?: HelicopterIconState;
    /** Convenience alias for `state={fresh ? 'fresh' : 'stale'}`. */
    fresh?: boolean;
    /** When true, draw a red equilateral triangle stroke around the icon. */
    mechanical?: boolean;
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

/** Equilateral triangle points centered in a 100×100 viewBox (tip up). */
const MECHANICAL_TRIANGLE_POINTS = '50,4 96,88 4,88';

/**
 * Top-down rappel helicopter marker. Uses transparent PNGs; switches
 * fresh vs stale via `state` / `fresh`. Optionally frames the icon with a
 * red equilateral triangle when `mechanical` is true.
 */
export function HelicopterIcon({
    state,
    fresh,
    mechanical = false,
    width = 65,
    height = 65,
    alt,
    style,
    ...rest
}: HelicopterIconProps) {
    const resolved: HelicopterIconState =
        state ?? (fresh === false ? 'stale' : 'fresh');

    const img = (
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

    if (!mechanical) {
        return img;
    }

    const wrapperStyle: CSSProperties = {
        position: 'relative',
        width,
        height,
        display: 'block',
    };

    return (
        <div style={wrapperStyle}>
            {img}
            <svg
                viewBox="0 0 100 100"
                width={width}
                height={height}
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'visible',
                    pointerEvents: 'none',
                }}
            >
                <polygon
                    points={MECHANICAL_TRIANGLE_POINTS}
                    fill="none"
                    stroke="var(--mantine-color-red-9)"
                    strokeWidth={5}
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
