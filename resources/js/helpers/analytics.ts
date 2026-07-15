declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

/**
 * Sends a Google Analytics event for the summary UI migration banner.
 * No-ops when gtag is unavailable (non-production / blocked).
 */
export function trackSummaryUiMigrationEvent(
    action: 'revert_to_legacy' | 'try_new_layout' | 'keep_new_layout' | 'dismiss_legacy',
    label?: string
): void {
    if (typeof window.gtag !== 'function') {
        return;
    }

    window.gtag('event', action, {
        event_category: 'Summary UI Migration',
        event_label: label,
    });
}
