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
import PersonnelCountLabel from './PersonnelCountLabel';
import { isCrewStale } from './styles';
import Timestamp from './Timestamp';

/** Shared column template so header + collapsed rows stay aligned. */
const OVERVIEW_GRID_COLUMNS = {
    base: '14px minmax(0, 1fr) auto',
    sm: '14px minmax(9rem, 1.5fr) 4.5rem minmax(0, 1.1fr) minmax(0, 1.2fr) 2.5rem',
    md: '14px minmax(9rem, 1.4fr) 4.5rem minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 1.2fr) 2.5rem',
};

const overviewGridStyle = (breakpoint) => ({
    display: 'grid',
    gridTemplateColumns:
        OVERVIEW_GRID_COLUMNS[breakpoint] || OVERVIEW_GRID_COLUMNS.base,
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

function uniqueNonEmpty(values) {
    return [...new Set(values.filter(Boolean))];
}

function getCrewOverview(crewRow) {
    const resources = crewRow.get('statusable_resources') || fromJS([]);

    const totalStaffing = resources.reduce((total, resource) => {
        const staffing = parseInt(staffingValues(resource), 10);
        return Number.isNaN(staffing) ? total : total + staffing;
    }, 0);

    const identifiers = resources
        .map((resource) => resource.get('identifier')?.toUpperCase())
        .filter(Boolean)
        .toArray();

    const locations = uniqueNonEmpty(
        resources
            .map((resource) =>
                resource.getIn(['latest_status', 'location_name'])
            )
            .toArray()
    );

    const assignments = uniqueNonEmpty(
        resources
            .map((resource) =>
                resource.getIn(['latest_status', 'assigned_fire_name'])
            )
            .toArray()
    );

    return {
        totalStaffing,
        identifiers,
        location: locations.join(' · ') || '—',
        assignment: assignments.join(' · ') || '—',
        helicopterCount: resources.size,
    };
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
        (total, helicopter) => {
            const staffedIncidents = helicopter.getIn(
                ['latest_status', 'comments1'],
                ''
            );
            if (!staffedIncidents) {
                return total;
            }

            const incidentsArray = parseStaffedIncidentsJson(staffedIncidents);
            if (!incidentsArray || incidentsArray.length === 0) {
                return total;
            }

            const personnelCount = incidentsArray.reduce(
                (personnelTotal, incident) => {
                    if (!incident.personnel) {
                        return personnelTotal;
                    }
                    const personnel = parseInt(incident.personnel, 10);
                    return Number.isNaN(personnel)
                        ? personnelTotal
                        : personnelTotal + personnel;
                },
                0
            );

            return total + personnelCount;
        },
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
        { label: 'Staffing', value: totalStaffing },
        { label: 'On incidents', value: totalPersonnelOnStaffedIncidents },
        { label: 'Boosters in', value: totalBoosters },
    ];

    return (
        <SimpleGrid cols={3} spacing="sm">
            {stats.map((stat) => (
                <Paper key={stat.label} withBorder p="md" radius="md">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                        {stat.label}
                    </Text>
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
                            <PersonnelCountLabel count={personnel} />
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

const OverviewCell = ({ children }) => (
    <Text size="sm" truncate="end" fw={500}>
        {children}
    </Text>
);

OverviewCell.propTypes = {
    children: PropTypes.node,
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
            style={overviewGridStyle('sm')}
        >
            <Box />
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Crew
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Personnel
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Helicopter
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Location
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Status
            </Text>
        </Box>
        <Box px="md" pb={4} visibleFrom="md" style={overviewGridStyle('md')}>
            <Box />
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Crew
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Personnel
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Helicopter
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

const CrewRow = ({ crewRow, isExpanded, onToggle }) => {
    if (typeof crewRow?.get('statusable_resources') === 'undefined') {
        return null;
    }

    const stale = isCrewStale(crewRow);
    const resources = crewRow.get('statusable_resources');
    const overview = getCrewOverview(crewRow);
    const phone = crewRow.get('phone');

    const backgroundColor = 'var(--mantine-color-body)';
    // const backgroundColor = isExpanded
    //     ? 'var(--mantine-color-blue-0)'
    //     : 'var(--mantine-color-body)';

    const statusBadge = stale ? <NeedsUpdateLabel /> : null;

    return (
        <Paper
            component="article"
            withBorder
            radius="md"
            style={{
                backgroundColor,
                borderColor: stale
                    ? 'var(--mantine-color-yellow-6)'
                    : 'var(--mantine-color-blue-3)',
                // Always use a 4px left border so columns stay aligned across rows
                borderLeftWidth: 4,
                borderLeftColor: stale
                    ? 'var(--mantine-color-yellow-6)'
                    : 'var(--mantine-color-blue-3)',
                transition:
                    'background-color 120ms ease, border-color 120ms ease',
                overflow: 'hidden',
            }}
        >
            <UnstyledButton
                onClick={onToggle}
                w="100%"
                px="md"
                py="sm"
                aria-expanded={isExpanded}
                style={{
                    display: 'block',
                    textAlign: 'left',
                }}
            >
                {/* Mobile overview */}
                <Box hiddenFrom="sm" style={overviewGridStyle('base')}>
                    <ExpandIcon expanded={isExpanded} />
                    <Box style={{ minWidth: 0 }}>
                        <Text fw={700} size="sm" truncate="end" lh={1.3}>
                            {crewRow.get('name')}
                        </Text>
                        <Text size="xs" c="dimmed" truncate="end">
                            {overview.identifiers.join(' · ') ||
                                'No helicopter'}
                            {' · '}
                            {overview.location}
                        </Text>
                    </Box>
                    <Group gap={6} wrap="nowrap" justify="flex-end">
                        {statusBadge}
                        <PersonnelCountLabel
                            count={overview.totalStaffing || 0}
                        />
                    </Group>
                </Box>

                {/* Tablet overview */}
                <Box
                    visibleFrom="sm"
                    hiddenFrom="md"
                    style={overviewGridStyle('sm')}
                >
                    <ExpandIcon expanded={isExpanded} />
                    <Text fw={700} size="sm" truncate="end">
                        {crewRow.get('name')}
                    </Text>
                    <PersonnelCountLabel count={overview.totalStaffing || 0} />
                    <OverviewCell>
                        {overview.identifiers.join(' · ') || '—'}
                    </OverviewCell>
                    <OverviewCell>{overview.location}</OverviewCell>
                    <Box style={{ justifySelf: 'end' }}>{statusBadge}</Box>
                </Box>

                {/* Desktop overview */}
                <Box visibleFrom="md" style={overviewGridStyle('md')}>
                    <ExpandIcon expanded={isExpanded} />
                    <Text fw={700} size="sm" truncate="end">
                        {crewRow.get('name')}
                    </Text>
                    <PersonnelCountLabel count={overview.totalStaffing || 0} />
                    <OverviewCell>
                        {overview.identifiers.join(' · ') || '—'}
                    </OverviewCell>
                    <OverviewCell>{overview.location}</OverviewCell>
                    <OverviewCell>{overview.assignment}</OverviewCell>
                    <Box style={{ justifySelf: 'end' }}>{statusBadge}</Box>
                </Box>
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
                                        key={resource.get('identifier')}
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
                            Scan the list, then expand a crew for full detail
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
