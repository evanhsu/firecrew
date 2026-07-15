export const SUMMARY_UI_STORAGE_KEY = 'firecrew.summaryUiMigration';

export const BANNER_SNOOZE_MS = 24 * 60 * 60 * 1000;

export type SummaryUiPreference =
    | { status: 'migrated' }
    | { status: 'new' }
    | { status: 'legacy'; dismissedAt?: number };

export type SummaryUiMode = 'new' | 'legacy';

export function readSummaryUiPreference(): SummaryUiPreference | null {
    try {
        const raw = localStorage.getItem(SUMMARY_UI_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw) as SummaryUiPreference;
        if (parsed?.status === 'migrated') {
            return { status: 'migrated' };
        }
        if (parsed?.status === 'new') {
            return { status: 'new' };
        }
        if (parsed?.status === 'legacy') {
            return {
                status: 'legacy',
                ...(typeof parsed.dismissedAt === 'number'
                    ? { dismissedAt: parsed.dismissedAt }
                    : {}),
            };
        }
        return null;
    } catch {
        return null;
    }
}

export function writeSummaryUiPreference(
    preference: SummaryUiPreference
): void {
    try {
        localStorage.setItem(SUMMARY_UI_STORAGE_KEY, JSON.stringify(preference));
    } catch {
        // Ignore quota / private-mode failures; in-memory state still works for the session.
    }
}

export function getSummaryUiMode(
    preference: SummaryUiPreference | null
): SummaryUiMode {
    if (preference?.status === 'legacy') {
        return 'legacy';
    }
    return 'new';
}

export function shouldShowMigrationBanner(
    preference: SummaryUiPreference | null,
    now = Date.now()
): boolean {
    if (preference?.status === 'migrated') {
        return false;
    }
    if (preference?.status === 'legacy' && preference.dismissedAt != null) {
        return now - preference.dismissedAt >= BANNER_SNOOZE_MS;
    }
    return true;
}
