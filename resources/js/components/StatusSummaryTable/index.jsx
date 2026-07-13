import {
    Anchor,
    Badge,
    Box,
    Collapse,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { fromJS, Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DutyOfficer from './DutyOfficer';
import { isCrewStale } from './styles';
import Timestamp from './Timestamp';

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
    if (children === null || children === undefined || children === '') {
        return null;
    }

    return (
        <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={2}>
                {label}
            </Text>
            <Text size="sm" component="div">
                {children}
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
                            <Badge variant="light" color="gray" radius="sm">
                                {personnel}
                            </Badge>
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
    const showSpotter = Boolean(managerName || managerPhone);
    const showIncidents = hasStaffedIncidents(staffedIncidents);
    const showBoosters = boosters !== '';

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
                    <Badge size="lg" variant="light" color="blue" radius="sm">
                        {staffing} staffed
                    </Badge>
                )}
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                <Field label="Location">{location}</Field>
                <Field label="Current assignment">{assignment}</Field>
                {showSpotter && (
                    <Field label="Spotter">
                        <Stack gap={2}>
                            {managerName && <Text size="sm">{managerName}</Text>}
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
                    </Field>
                )}
                {showBoosters && <Field label="Boosters in">{boosters}</Field>}
                {showIncidents && (
                    <Field label="Staffed incidents">
                        <StaffedIncidentList jsonString={staffedIncidents} />
                    </Field>
                )}
                <Field label="Additional info">{comments2}</Field>
            </SimpleGrid>
        </Paper>
    );
};

HelicopterCard.propTypes = {
    resource: ImmutablePropTypes.map,
};

const OverviewCell = ({ label, children, flex = 1, hideBelow }) => (
    <Box
        style={{ flex, minWidth: 0 }}
        visibleFrom={hideBelow}
        miw={0}
    >
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} visibleFrom="md">
            {label}
        </Text>
        <Text size="sm" truncate="end" fw={500}>
            {children}
        </Text>
    </Box>
);

OverviewCell.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node,
    flex: PropTypes.number,
    hideBelow: PropTypes.string,
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

const CrewRow = ({ crewRow, isExpanded, onToggle }) => {
    if (typeof crewRow?.get('statusable_resources') === 'undefined') {
        return null;
    }

    const stale = isCrewStale(crewRow);
    const resources = crewRow.get('statusable_resources');
    const overview = getCrewOverview(crewRow);
    const phone = crewRow.get('phone');

    const backgroundColor = isExpanded
        ? 'var(--mantine-color-blue-0)'
        : 'var(--mantine-color-body)';

    return (
        <Paper
            component="article"
            withBorder
            radius="md"
            style={{
                backgroundColor,
                borderColor: isExpanded
                    ? 'var(--mantine-color-blue-3)'
                    : 'var(--mantine-color-gray-3)',
                borderLeftWidth: stale || isExpanded ? 4 : 1,
                borderLeftColor: isExpanded
                    ? 'var(--mantine-color-blue-5)'
                    : stale
                      ? 'var(--mantine-color-yellow-6)'
                      : undefined,
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
                <Group
                    gap="md"
                    wrap="nowrap"
                    align="center"
                    justify="space-between"
                >
                    <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                        <ExpandIcon expanded={isExpanded} />

                        <Box style={{ flex: '1.4 1 140px', minWidth: 0 }}>
                            <Text fw={700} size="sm" truncate="end" lh={1.3}>
                                {crewRow.get('name')}
                            </Text>
                            <Text size="xs" c="dimmed" truncate="end" hiddenFrom="sm">
                                {overview.identifiers.join(' · ') || 'No helicopter'}
                                {' · '}
                                {overview.location}
                            </Text>
                        </Box>

                        <Box style={{ flex: '0 0 auto' }}>
                            <Badge variant="light" color="blue" radius="sm">
                                {overview.totalStaffing || 0}
                            </Badge>
                        </Box>

                        <OverviewCell label="Helicopter" flex={1.1} hideBelow="sm">
                            {overview.identifiers.join(' · ') || '—'}
                        </OverviewCell>

                        <OverviewCell label="Location" flex={1.2} hideBelow="sm">
                            {overview.location}
                        </OverviewCell>

                        <OverviewCell label="Assignment" flex={1.3} hideBelow="md">
                            {overview.assignment}
                        </OverviewCell>
                    </Group>

                    {stale && (
                        <Badge
                            color="yellow"
                            variant="light"
                            radius="sm"
                            visibleFrom="sm"
                            style={{ flexShrink: 0 }}
                        >
                            Needs update
                        </Badge>
                    )}
                </Group>
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
                        <Group
                            justify="space-between"
                            align="flex-start"
                            gap="md"
                            wrap="wrap"
                        >
                            <Stack gap={6} style={{ flex: 1, minWidth: 180 }}>
                                {phone && (
                                    <Anchor
                                        href={`tel:${phone}`}
                                        size="sm"
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >
                                        {phone}
                                    </Anchor>
                                )}
                                <DutyOfficer
                                    dutyOfficer={crewRow.get(
                                        'status',
                                        new Map()
                                    )}
                                />
                                <Timestamp
                                    timestamp={crewRow.get('updated_at')}
                                />
                            </Stack>
                        </Group>

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
            expandedCrewId:
                prevState.expandedCrewId === crewId ? null : crewId,
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
                        <Group
                            gap="md"
                            wrap="nowrap"
                            px="md"
                            visibleFrom="sm"
                            pb={4}
                        >
                            <Box w={14} style={{ flexShrink: 0 }} />
                            <Text
                                size="xs"
                                c="dimmed"
                                tt="uppercase"
                                fw={600}
                                style={{ flex: '1.4 1 140px' }}
                            >
                                Crew
                            </Text>
                            <Box w={42} visibleFrom="xs" />
                            <Text
                                size="xs"
                                c="dimmed"
                                tt="uppercase"
                                fw={600}
                                style={{ flex: '1.1 1 0' }}
                                visibleFrom="sm"
                            >
                                Helicopter
                            </Text>
                            <Text
                                size="xs"
                                c="dimmed"
                                tt="uppercase"
                                fw={600}
                                style={{ flex: '1.2 1 0' }}
                                visibleFrom="sm"
                            >
                                Location
                            </Text>
                            <Text
                                size="xs"
                                c="dimmed"
                                tt="uppercase"
                                fw={600}
                                style={{ flex: '1.3 1 0' }}
                                visibleFrom="md"
                            >
                                Assignment
                            </Text>
                            <Box w={110} style={{ flexShrink: 0 }} />
                        </Group>

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
