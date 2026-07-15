import { useCallback, useState } from 'react';
import { trackSummaryUiMigrationEvent } from '../../helpers/analytics';
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
        trackSummaryUiMigrationEvent('try_new_layout');
        persist({ status: 'new' });
    }, [persist]);

    const revertToLegacyUi = useCallback(() => {
        trackSummaryUiMigrationEvent('revert_to_legacy');
        persist({ status: 'legacy' });
    }, [persist]);

    const dismissBanner = useCallback(() => {
        const mode = getSummaryUiMode(preference);
        if (mode === 'legacy') {
            trackSummaryUiMigrationEvent('dismiss_legacy');
            persist({ status: 'legacy', dismissedAt: Date.now() });
            return;
        }
        trackSummaryUiMigrationEvent('keep_new_layout');
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
