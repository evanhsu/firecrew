import {
    forwardRef,
    useContext,
    type CSSProperties,
    type HTMLAttributes,
} from 'react';
import { IconContext } from '@phosphor-icons/react/dist/lib/context';
import type { IconWeight } from '@phosphor-icons/react';
import flightHelmetSrc from './flight-helmet.png';

export type { IconWeight };

export type FlightHelmetIconProps = Omit<
    HTMLAttributes<HTMLSpanElement>,
    'children' | 'color'
> & {
    alt?: string;
    color?: string;
    size?: string | number;
    weight?: IconWeight;
    mirrored?: boolean;
};

/**
 * Flight helmet icon with a Phosphor-compatible props interface
 * (`size`, `color`, `weight`, `mirrored`, `alt`).
 *
 * Weight is accepted for API parity but has no effect — only one glyph is provided.
 */
export const FlightHelmetIcon = forwardRef<
    HTMLSpanElement,
    FlightHelmetIconProps
>(
    (
        {
            alt,
            color,
            size,
            weight: _weight,
            mirrored,
            style,
            className,
            ...rest
        },
        ref,
    ) => {
        const {
            color: contextColor = 'currentColor',
            size: contextSize = '1em',
            mirrored: contextMirrored = false,
        } = useContext(IconContext);

        const resolvedColor = color ?? contextColor;
        const resolvedSize = size ?? contextSize;
        const resolvedMirrored = mirrored ?? contextMirrored;

        const maskStyles: CSSProperties = {
            display: 'inline-block',
            flexShrink: 0,
            width: resolvedSize,
            height: resolvedSize,
            backgroundColor: resolvedColor,
            verticalAlign: 'middle',
            transform: resolvedMirrored ? 'scaleX(-1)' : undefined,
            WebkitMaskImage: `url(${flightHelmetSrc})`,
            maskImage: `url(${flightHelmetSrc})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            ...style,
        };

        return (
            <span
                ref={ref}
                className={className}
                role={alt ? 'img' : undefined}
                aria-label={alt || undefined}
                aria-hidden={alt ? undefined : true}
                style={maskStyles}
                {...rest}
            />
        );
    },
);

FlightHelmetIcon.displayName = 'FlightHelmetIcon';

/** @deprecated Use FlightHelmetIcon */
export const FlightHelmet = FlightHelmetIcon;

/** @deprecated Use FlightHelmetIconProps */
export type IconProps = FlightHelmetIconProps;

export default FlightHelmetIcon;
