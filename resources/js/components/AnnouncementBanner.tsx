/**
 * Hard-coded announcement shown at the top of the Summary and Map pages.
 * Edit `message` below, or set `enabled` to false to hide the banner.
 */
export const ANNOUNCEMENT = {
    enabled: false,
    message: '📢 Site updates are coming on Wednesday, July 15th 📢',
    /** Approximate rendered height; keep in sync with banner styles for map layout. */
    heightPx: 64,
} as const;

export const AnnouncementBanner = () => {
    if (!ANNOUNCEMENT.enabled || !ANNOUNCEMENT.message) {
        return null;
    }

    return (
        <div
            role="alert"
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: ANNOUNCEMENT.heightPx,
                marginBottom: 0,
                padding: '10px 15px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 600,
                color: '#8a6d3b',
                backgroundColor: '#fcf8e3',
                borderBottom: '1px solid #faebcc',
            }}
        >
            {ANNOUNCEMENT.message}
        </div>
    );
};
