import {
    Anchor,
    Box,
    Collapse,
    Stack,
    Text,
    Title,
    UnstyledButton,
    SimpleGrid,
    Paper,
    Group,
} from '@mantine/core';
import { fromJS, Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DutyOfficer from './DutyOfficer';
import NeedsUpdateLabel from './NeedsUpdateLabel';
import OnIncidentsLabel from './OnIncidentsLabel';
import PersonnelCountLabel from './PersonnelCountLabel';
import { isResourceStale } from './styles';
import Timestamp from './Timestamp';

/** Shared column template so header + nested aircraft rows stay aligned. */
const AIRCRAFT_GRID_COLUMNS = {
    base: 'minmax(0, 1fr) auto',
    sm: 'minmax(5rem, 1fr) 4.5rem minmax(0, 1.3fr) 2.5rem',
    md: 'minmax(5rem, 1fr) 4.5rem minmax(0, 1.1fr) minmax(0, 1.2fr) 2.5rem',
};

const aircraftGridStyle = (breakpoint) => ({
    display: 'grid',
    gridTemplateColumns:
        AIRCRAFT_GRID_COLUMNS[breakpoint] || AIRCRAFT_GRID_COLUMNS.base,
    alignItems: 'center',
    columnGap: 'var(--mantine-spacing-md)',
    width: '100%',
});

const HELICOPTER_MODELS = {
    '412epx': 'Bell 412EPX',
    '205a1': 'Bell 205A1++',
    superpuma: 'AS 332L1',
};

function getHelicopterModelLabel(model) {
    if (!model) {
        return '';
    }
    return HELICOPTER_MODELS[model.toLowerCase()] || model;
}

function parseStaffedIncidentsJson(value) {
    if (!value) {
        return null;
    }

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function staffingValues(resource) {
    if (resource.get('resource_type') === 'RappelHelicopter') {
        return resource.getIn(['latest_status', 'staffing_value1'], '-');
    }
    return '';
}

function boostersIn(resource) {
    if (resource.get('resource_type') === 'RappelHelicopter') {
        return resource.getIn(['latest_status', 'staffing_value2'], '0');
    }
    return '';
}

function getCrewTotalStaffing(crewRow) {
    const resources = crewRow.get('statusable_resources') || fromJS([]);

    return resources.reduce((total, resource) => {
        const staffing = parseInt(staffingValues(resource), 10);
        return Number.isNaN(staffing) ? total : total + staffing;
    }, 0);
}

function getResourcePersonnelOnIncidents(resource) {
    const staffedIncidents = resource.getIn(['latest_status', 'comments1'], '');
    if (!staffedIncidents) {
        return 0;
    }

    const incidentsArray = parseStaffedIncidentsJson(staffedIncidents);
    if (!incidentsArray || incidentsArray.length === 0) {
        return 0;
    }

    return incidentsArray.reduce((personnelTotal, incident) => {
        if (!incident.personnel) {
            return personnelTotal;
        }
        const personnel = parseInt(incident.personnel, 10);
        return Number.isNaN(personnel)
            ? personnelTotal
            : personnelTotal + personnel;
    }, 0);
}

function getCrewTotalOnIncidents(crewRow) {
    const resources = crewRow.get('statusable_resources') || fromJS([]);

    return resources.reduce(
        (total, resource) => total + getResourcePersonnelOnIncidents(resource),
        0
    );
}

function computeTotals(crews) {
    const helicopterRows = crews.flatMap((crew) =>
        crew.get('statusable_resources')
    );

    const totalStaffing = helicopterRows.reduce((total, helicopter) => {
        const staffing = parseInt(
            helicopter.getIn(['latest_status', 'staffing_value1'], 0),
            10
        );
        return Number.isNaN(staffing) ? total : total + staffing;
    }, 0);

    const totalBoosters = helicopterRows.reduce((total, helicopter) => {
        const boosters = parseInt(
            helicopter.getIn(['latest_status', 'staffing_value2'], 0) || 0,
            10
        );
        return Number.isNaN(boosters) ? total : total + boosters;
    }, 0);

    const totalPersonnelOnStaffedIncidents = helicopterRows.reduce(
        (total, helicopter) =>
            total + getResourcePersonnelOnIncidents(helicopter),
        0
    );

    return { totalStaffing, totalBoosters, totalPersonnelOnStaffedIncidents };
}

const Field = ({ label, children }) => {
    const isEmpty =
        children === null || children === undefined || children === '';

    return (
        <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={2}>
                {label}
            </Text>
            <Text size="sm" component="div" c={isEmpty ? 'dimmed' : undefined}>
                {isEmpty ? '—' : children}
            </Text>
        </Box>
    );
};

Field.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node,
};

const SummaryTotals = ({ crews }) => {
    const { totalStaffing, totalBoosters, totalPersonnelOnStaffedIncidents } =
        computeTotals(crews);

    const stats = [
        {
            label: 'Staffing',
            value: totalStaffing,
            legend: <PersonnelCountLabel />,
        },
        {
            label: 'On incidents',
            value: totalPersonnelOnStaffedIncidents,
            legend: <OnIncidentsLabel />,
        },
        { label: 'Boosters in', value: totalBoosters },
    ];

    return (
        <SimpleGrid cols={3} spacing="sm">
            {stats.map((stat) => (
                <Paper key={stat.label} withBorder p="md" radius="md">
                    <Group
                        justify="space-between"
                        align="flex-start"
                        gap="xs"
                        wrap="nowrap"
                    >
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                            {stat.label}
                        </Text>
                        {stat.legend ?? null}
                    </Group>
                    <Text size="xl" fw={700} lh={1.2} mt={4}>
                        {stat.value}
                    </Text>
                </Paper>
            ))}
        </SimpleGrid>
    );
};

SummaryTotals.propTypes = {
    crews: ImmutablePropTypes.list,
};

const StaffedIncidentList = ({ jsonString }) => {
    if (!jsonString) {
        return null;
    }

    const incidents = parseStaffedIncidentsJson(jsonString);
    if (!incidents) {
        return <Text size="sm">{jsonString}</Text>;
    }

    if (incidents.length === 0) {
        return null;
    }

    return (
        <Stack gap={6}>
            {incidents.map((incident, index) => {
                const personnel = incident.personnel || '';
                const incidentName = incident.incident_name || '';
                const demob = incident.demob || '';

                return (
                    <Group
                        key={`${incidentName}-${index}`}
                        gap="xs"
                        wrap="nowrap"
                        align="flex-start"
                    >
                        {personnel !== '' && (
                            <OnIncidentsLabel count={personnel} />
                        )}
                        <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text size="sm" fw={500} lh={1.3}>
                                {incidentName || '—'}
                            </Text>
                            {demob && (
                                <Text size="xs" c="dimmed">
                                    Est. demob {demob}
                                </Text>
                            )}
                        </Box>
                    </Group>
                );
            })}
        </Stack>
    );
};

StaffedIncidentList.propTypes = {
    jsonString: PropTypes.string,
};

const hasStaffedIncidents = (jsonString) => {
    if (!jsonString) {
        return false;
    }
    const incidents = parseStaffedIncidentsJson(jsonString);
    if (incidents) {
        return incidents.length > 0;
    }
    return Boolean(jsonString);
};

const HelicopterCard = ({ resource }) => {
    if (!resource) {
        return (
            <Text size="sm" c="dimmed">
                No helicopter reported
            </Text>
        );
    }

    const identifier = resource.get('identifier')?.toUpperCase();
    const model = getHelicopterModelLabel(resource.get('model'));
    const location = resource.getIn(['latest_status', 'location_name']);
    const assignment = resource.getIn(['latest_status', 'assigned_fire_name']);
    const managerName = resource.getIn(['latest_status', 'manager_name']);
    const managerPhone = resource.getIn(['latest_status', 'manager_phone']);
    const comments2 = resource.getIn(['latest_status', 'comments2']);
    const staffing = staffingValues(resource);
    const boosters = boostersIn(resource);
    const staffedIncidents = resource.getIn(['latest_status', 'comments1']);
    const hasSpotter = Boolean(managerName || managerPhone);
    const incidentsContent = hasStaffedIncidents(staffedIncidents) ? (
        <StaffedIncidentList jsonString={staffedIncidents} />
    ) : null;

    return (
        <Paper
            withBorder
            radius="md"
            p="md"
            bg="var(--mantine-color-body)"
            style={{ borderColor: 'var(--mantine-color-gray-3)' }}
        >
            <Group justify="space-between" align="flex-start" mb="sm" gap="sm">
                <Box>
                    <Text fw={700} size="md" lh={1.2}>
                        {identifier}
                    </Text>
                    {model && (
                        <Text size="sm" c="dimmed">
                            {model}
                        </Text>
                    )}
                </Box>
                {staffing !== '' && (
                    <PersonnelCountLabel count={staffing} size="lg" />
                )}
            </Group>

            {/* Fixed field order so sections stay in the same grid slot across aircraft */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                <Field label="Location">{location}</Field>
                <Field label="Current assignment">{assignment}</Field>
                <Field label="Spotter">
                    {hasSpotter ? (
                        <Stack gap={2}>
                            {managerName && (
                                <Text size="sm">{managerName}</Text>
                            )}
                            {managerPhone && (
                                <Anchor
                                    href={`tel:${managerPhone}`}
                                    size="sm"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {managerPhone}
                                </Anchor>
                            )}
                        </Stack>
                    ) : null}
                </Field>
                <Field label="Boosters in">
                    {boosters === '' ? null : boosters}
                </Field>
                <Field label="Staffed incidents">{incidentsContent}</Field>
                <Field label="Additional info">{comments2}</Field>
            </SimpleGrid>
        </Paper>
    );
};

HelicopterCard.propTypes = {
    resource: ImmutablePropTypes.map,
};

const OverviewCell = ({ children, stale = false }) => (
    <Text
        size="sm"
        truncate="end"
        fw={500}
        fs={stale ? 'italic' : undefined}
        c={stale ? 'dimmed' : undefined}
    >
        {children}
    </Text>
);

OverviewCell.propTypes = {
    children: PropTypes.node,
    stale: PropTypes.bool,
};

const ExpandIcon = ({ expanded }) => (
    <Text
        component="span"
        c="dimmed"
        size="sm"
        aria-hidden
        style={{
            display: 'inline-block',
            width: 14,
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 120ms ease',
            flexShrink: 0,
        }}
    >
        ▸
    </Text>
);

ExpandIcon.propTypes = {
    expanded: PropTypes.bool,
};

const OverviewHeader = () => (
    <>
        <Box px="md" pb={4} hiddenFrom="sm" />
        <Box
            px="md"
            pb={4}
            visibleFrom="sm"
            hiddenFrom="md"
            style={aircraftGridStyle('sm')}
        >
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Helicopter
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Staffing
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Location
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Status
            </Text>
        </Box>
        <Box px="md" pb={4} visibleFrom="md" style={aircraftGridStyle('md')}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Helicopter
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Staffing
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Location
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Assignment
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Status
            </Text>
        </Box>
    </>
);

const AircraftOverviewRow = ({ resource }) => {
    const identifier = resource.get('identifier')?.toUpperCase() || '—';
    const location =
        resource.getIn(['latest_status', 'location_name']) || '—';
    const assignment =
        resource.getIn(['latest_status', 'assigned_fire_name']) || '—';
    const staffing = staffingValues(resource);
    const staffingCount = parseInt(staffing, 10);
    const safeStaffing = Number.isNaN(staffingCount) ? 0 : staffingCount;
    const stale = isResourceStale(resource);

    return (
        <Box
            py="xs"
            style={{
                borderTop: '1px solid var(--mantine-color-gray-2)',
            }}
        >
            {/* Mobile */}
            <Box hiddenFrom="sm" style={aircraftGridStyle('base')}>
                <Box style={{ minWidth: 0 }}>
                    <Text
                        fw={600}
                        size="sm"
                        truncate="end"
                        lh={1.3}
                        fs={stale ? 'italic' : undefined}
                        c={stale ? 'dimmed' : undefined}
                    >
                        {identifier}
                    </Text>
                    <Text
                        size="xs"
                        c="dimmed"
                        truncate="end"
                        fs={stale ? 'italic' : undefined}
                    >
                        {location}
                    </Text>
                </Box>
                <Group gap={6} wrap="nowrap" justify="flex-end">
                    {stale ? <NeedsUpdateLabel /> : null}
                    <PersonnelCountLabel count={safeStaffing} />
                </Group>
            </Box>

            {/* Tablet */}
            <Box
                visibleFrom="sm"
                hiddenFrom="md"
                style={aircraftGridStyle('sm')}
            >
                <OverviewCell stale={stale}>{identifier}</OverviewCell>
                <PersonnelCountLabel count={safeStaffing} />
                <OverviewCell stale={stale}>{location}</OverviewCell>
                <Box style={{ justifySelf: 'end' }}>
                    {stale ? <NeedsUpdateLabel /> : null}
                </Box>
            </Box>

            {/* Desktop */}
            <Box visibleFrom="md" style={aircraftGridStyle('md')}>
                <OverviewCell stale={stale}>{identifier}</OverviewCell>
                <PersonnelCountLabel count={safeStaffing} />
                <OverviewCell stale={stale}>{location}</OverviewCell>
                <OverviewCell stale={stale}>{assignment}</OverviewCell>
                <Box style={{ justifySelf: 'end' }}>
                    {stale ? <NeedsUpdateLabel /> : null}
                </Box>
            </Box>
        </Box>
    );
};

AircraftOverviewRow.propTypes = {
    resource: ImmutablePropTypes.map.isRequired,
};

const CrewRow = ({ crewRow, isExpanded, onToggle }) => {
    if (typeof crewRow?.get('statusable_resources') === 'undefined') {
        return null;
    }

    const resources = crewRow.get('statusable_resources');
    const totalStaffing = getCrewTotalStaffing(crewRow);
    const totalOnIncidents = getCrewTotalOnIncidents(crewRow);
    const phone = crewRow.get('phone');

    return (
        <Paper
            component="article"
            withBorder
            radius="md"
            style={{
                backgroundColor: 'var(--mantine-color-body)',
                borderColor: 'var(--mantine-color-blue-3)',
                borderLeftWidth: 4,
                borderLeftColor: 'var(--mantine-color-blue-3)',
                transition:
                    'background-color 120ms ease, border-color 120ms ease',
                overflow: 'hidden',
            }}
        >
            <UnstyledButton
                onClick={onToggle}
                w="100%"
                px="md"
                pt="sm"
                pb="sm"
                aria-expanded={isExpanded}
                style={{
                    display: 'block',
                    textAlign: 'left',
                }}
            >
                <Group
                    justify="space-between"
                    align="center"
                    gap="sm"
                    wrap="nowrap"
                >
                    <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                        <ExpandIcon expanded={isExpanded} />
                        <Text fw={700} size="sm" truncate="end">
                            {crewRow.get('name')}
                        </Text>
                    </Group>
                    <Group gap={6} wrap="nowrap">
                        <PersonnelCountLabel count={totalStaffing || 0} />
                        <OnIncidentsLabel count={totalOnIncidents || 0} />
                    </Group>
                </Group>

                {!isExpanded &&
                    (resources.size === 0 ? (
                        <Box
                            pt="xs"
                            mt="xs"
                            style={{
                                borderTop:
                                    '1px solid var(--mantine-color-gray-2)',
                            }}
                        >
                            <Text size="sm" c="dimmed">
                                No helicopter reported
                            </Text>
                        </Box>
                    ) : (
                        <Box mt="xs">
                            {resources.map((resource) => (
                                <AircraftOverviewRow
                                    key={
                                        resource.get('id') ||
                                        resource.get('identifier')
                                    }
                                    resource={resource}
                                />
                            ))}
                        </Box>
                    ))}
            </UnstyledButton>

            <Collapse expanded={isExpanded}>
                <Box
                    px="md"
                    pb="md"
                    pt="xs"
                    style={{
                        borderTop: '1px solid var(--mantine-color-gray-2)',
                    }}
                >
                    <Stack gap="md">
                        <Stack gap={6} style={{ flex: 1, minWidth: 180 }}>
                            {phone && (
                                <Anchor
                                    href={`tel:${phone}`}
                                    size="sm"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {phone}
                                </Anchor>
                            )}
                            <DutyOfficer
                                dutyOfficer={crewRow.get('status', new Map())}
                            />
                            <Timestamp timestamp={crewRow.get('updated_at')} />
                        </Stack>

                        <Stack gap="sm">
                            {resources.size === 0 ? (
                                <Text size="sm" c="dimmed">
                                    No helicopter reported
                                </Text>
                            ) : (
                                resources.map((resource) => (
                                    <HelicopterCard
                                        key={
                                            resource.get('id') ||
                                            resource.get('identifier')
                                        }
                                        resource={resource}
                                    />
                                ))
                            )}
                        </Stack>
                    </Stack>
                </Box>
            </Collapse>
        </Paper>
    );
};

CrewRow.propTypes = {
    crewRow: ImmutablePropTypes.map,
    isExpanded: PropTypes.bool,
    onToggle: PropTypes.func,
};

class StatusSummaryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedCrewId: null,
        };
    }

    handleCrewToggle = (crewId) => () => {
        this.setState((prevState) => ({
            expandedCrewId: prevState.expandedCrewId === crewId ? null : crewId,
        }));
    };

    render() {
        const { crews } = this.props;

        return (
            <Box
                px={{ base: 'md', sm: 'lg' }}
                py={{ base: 'md', sm: 'lg' }}
                maw={1200}
                mx="auto"
                w="100%"
            >
                <Stack gap="lg">
                    <Box>
                        <Title order={2} size="h3" mb={4}>
                            Staffing summary
                        </Title>
                        <Text size="sm" c="dimmed">
                            Click to expand a crew for full detail
                        </Text>
                    </Box>

                    <SummaryTotals crews={crews} />

                    <Stack gap="xs">
                        <OverviewHeader />

                        {crews.map((crew) => (
                            <CrewRow
                                key={crew.get('id')}
                                crewRow={crew}
                                isExpanded={
                                    parseInt(this.state.expandedCrewId, 10) ===
                                    parseInt(crew.get('id'), 10)
                                }
                                onToggle={this.handleCrewToggle(crew.get('id'))}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        );
    }
}

StatusSummaryTable.propTypes = {
    crews: ImmutablePropTypes.list,
};

StatusSummaryTable.defaultProps = {
    crews: fromJS([]),
};

export default StatusSummaryTable;
