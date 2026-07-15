import { useCallback, useState } from 'react';
import {
    getSummaryUiMode,
    readSummaryUiPreference,
    shouldShowMigrationBanner,
    type SummaryUiMode,
    type SummaryUiPreference,
    writeSummaryUiPreference,
} from './summaryUiPreference';

export type UseSummaryUiPreferenceResult = {
    uiMode: SummaryUiMode;
    showBanner: boolean;
    switchToNewUi: () => void;
    revertToLegacyUi: () => void;
    dismissBanner: () => void;
};

export function useSummaryUiPreference(): UseSummaryUiPreferenceResult {
    const [preference, setPreference] = useState<SummaryUiPreference | null>(
        () => readSummaryUiPreference()
    );

    const persist = useCallback((next: SummaryUiPreference) => {
        writeSummaryUiPreference(next);
        setPreference(next);
    }, []);

    const switchToNewUi = useCallback(() => {
        persist({ status: 'new' });
    }, [persist]);

    const revertToLegacyUi = useCallback(() => {
        persist({ status: 'legacy' });
    }, [persist]);

    const dismissBanner = useCallback(() => {
        const mode = getSummaryUiMode(preference);
        if (mode === 'legacy') {
            persist({ status: 'legacy', dismissedAt: Date.now() });
            return;
        }
        persist({ status: 'migrated' });
    }, [persist, preference]);

    return {
        uiMode: getSummaryUiMode(preference),
        showBanner: shouldShowMigrationBanner(preference),
        switchToNewUi,
        revertToLegacyUi,
        dismissBanner,
    };
}
