import { Alert, Button, Group, Text } from '@mantine/core';
import type { SummaryUiMode } from '../containers/StatusSummary/summaryUiPreference';

export type SummaryUiMigrationBannerProps = {
    uiMode: SummaryUiMode;
    onTryNewUi: () => void;
    onRevertToLegacy: () => void;
    onDismiss: () => void;
};

export const SummaryUiMigrationBanner = ({
    uiMode,
    onTryNewUi,
    onRevertToLegacy,
    onDismiss,
}: SummaryUiMigrationBannerProps) => {
    const isLegacy = uiMode === 'legacy';

    return (
        <Alert
            role="status"
            color="yellow"
            variant="light"
            radius={0}
            styles={{
                root: {
                    borderBottom: '1px solid var(--mantine-color-yellow-3)',
                },
                message: { width: '100%' },
            }}
        >
            <Group justify="space-between" align="center" gap="md" wrap="wrap">
                <Text size="sm" fw={500} maw={720}>
                    {isLegacy
                        ? "A redesigned staffing summary page is available that's mobile-friendly and fits on your screen better. Try it out before it becomes the default."
                        : "🎉 You're using a preview of the new staffing summary page! It's mobile-friendly and fits on your screen better. You can switch back to the old layout temporarily, but this one will become the default soon."}
                </Text>
                <Group gap="sm" wrap="nowrap">
                    {isLegacy ? (
                        <Button size="compact-sm" onClick={onTryNewUi}>
                            Try the new design
                        </Button>
                    ) : (
                        <Button
                            size="compact-sm"
                            variant="default"
                            onClick={onRevertToLegacy}
                        >
                            Use previous design
                        </Button>
                    )}
                    <Button
                        size="compact-sm"
                        variant="subtle"
                        color="gray"
                        onClick={onDismiss}
                    >
                        Dismiss
                    </Button>
                </Group>
            </Group>
        </Alert>
    );
};
