import { fromJS, Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { logger } from '../../helpers/logger';
import { Helicopter } from '../StatusMap/Helicopter';
import CrewInfo from './CrewInfo';
import DutyOfficer from './DutyOfficer';
import * as styles from './styles';
import Timestamp from './Timestamp';

const HelicopterIdentifier = ({ resource }) => {
    const identifier = resource.get('identifier').toUpperCase();
    let model = '';

    switch (resource.get('model').toLowerCase()) {
        case '412epx':
            model = 'Bell 412EPX';
            break;

        case '205a1':
            model = 'Bell 205A1++';
            break;

        case 'superpuma':
            model = 'AS 332L1';
            break;
    }

    return (
        <>
            {identifier}
            <br />({model})
        </>
    );
};

const HeaderRow = () => (
    <thead>
        <tr>
            <th style={{ width: styles.tableColWidth(0), paddingLeft: 10 }}>
                Crew
            </th>
            <th style={{ width: styles.tableColWidth(1) }}>Staffing</th>
            <th style={{ width: styles.tableColWidth(2) }}>Helicopter</th>
            <th style={{ width: styles.tableColWidth(3) }}>Location</th>
            <th style={{ width: styles.tableColWidth(4) }}>
                Current Assignment
            </th>
            <th style={{ width: styles.tableColWidth(5) }}>Spotter</th>
            <th style={{ width: styles.tableColWidth(6) }}>
                Staffed Incidents
            </th>
            <th style={{ width: styles.tableColWidth(1) }}>Boosters In</th>
            <th style={{ width: styles.tableColWidth(7) }}>Additional Info</th>
        </tr>
    </thead>
);

/**
 * There's 1 "CrewRow" for each Crew, but each crew can have multiple Helicopters ("Resources") that
 * are each rendered in a sub-table within the CrewRow.
 */
const CrewRow = ({ crewRow, isSelected, handleClick }) => {
    if (typeof crewRow?.get('statusable_resources') === 'undefined') {
        return null;
    }

    const helicopterRows = crewRow.get('statusable_resources');
    const totalStaffing = helicopterRows.reduce(
        (total, helicopter) =>
            total +
            parseInt(
                helicopter.getIn(['latest_status', 'staffing_value1'], 0),
                10
            ),
        0
    );
    const totalBoosters = helicopterRows.reduce(
        (total, helicopter) =>
            total +
            parseInt(
                helicopter.getIn(['latest_status', 'staffing_value2'], 0) || 0,
                10
            ),
        0
    );
    // Each helicopter can have multiple staffed incidents, so we need to sum the personnel across all incidents
    // for all of this crew's helicopters.
    // The personnel count is stored in the 'comments1' field of the latest status, which is a JSON string,
    // so we need to parse the JSON and extract the personnel count from each staffed incident.
    const totalPersonnelOnStaffedIncidents = helicopterRows.reduce(
        (total, helicopter) => {
            const staffedIncidents = helicopter.getIn(
                ['latest_status', 'comments1'],
                ''
            );
            if (!staffedIncidents) {
                return total;
            }

            let incidentsArray = [];
            try {
                incidentsArray = JSON.parse(staffedIncidents);
                if (
                    !Array.isArray(incidentsArray) ||
                    incidentsArray.length === 0
                ) {
                    return total;
                }
            } catch (e) {
                return total;
            }

            const personnelCount = incidentsArray.reduce(
                (personnelTotal, incident) => {
                    if (incident.personnel) {
                        const personnel = parseInt(incident.personnel, 10);
                        if (!isNaN(personnel)) {
                            return personnelTotal + personnel;
                        }
                    }
                    return personnelTotal;
                },
                0
            );

            return total + personnelCount;
        },
        0
    );

    const crewRowStyle = styles.getCrewRowStyle({ crewRow, isSelected });

    const CrewInfoCell = ({ totalHelicoptersForThisCrewRowCount }) => (
        <td
            style={{
                ...crewRowStyle.crewInfoCell,
                width: styles.tableColWidth(0),
            }}
            // Add 1 to the number of helicopters to include the "Totals" row
            rowSpan={Math.max(1, totalHelicoptersForThisCrewRowCount + 1)}
        >
            <CrewInfo crew={crewRow} />
            <DutyOfficer dutyOfficer={crewRow.get('status', new Map())} />
            <Timestamp timestamp={crewRow.get('updated_at')} />
        </td>
    );

    const FirstRow = () => {
        if (crewRow.get('statusable_resources').size === 0) {
            return (
                <tr
                    style={crewRowStyle.root}
                    onClick={handleClick(crewRow.get('id'))}
                >
                    <CrewInfoCell
                        totalHelicoptersForThisCrewRowCount={
                            crewRow.get('statusable_resources').size
                        }
                    />
                    <td key={`staffing`}></td>
                    <td key={`model`}></td>
                    <td key={`location`}></td>
                    <td key={`fire`}></td>
                    <td key={`manager`}></td>
                    <td key={`incidents`}></td>
                    <td key={`boosters`}></td>
                    <td key={`info`}></td>
                </tr>
            );
        }

        return (
            <tr
                style={crewRowStyle.root}
                onClick={handleClick(crewRow.get('id'))}
            >
                <CrewInfoCell
                    totalHelicoptersForThisCrewRowCount={
                        crewRow.get('statusable_resources').size
                    }
                />
                <td
                    key={`staffing`}
                    style={{ paddingLeft: 10, textAlign: 'left' }}
                >
                    {totalStaffing} Total
                </td>
                <td key={`model`}></td>
                <td key={`location`}></td>
                <td key={`fire`}></td>
                <td key={`manager`}></td>
                <td key={`incidents`}>
                    {totalPersonnelOnStaffedIncidents} Total
                </td>
                <td key={`boosters`}>{totalBoosters} Total</td>
                <td key={`info`}></td>
            </tr>
        );
    };

    const getHelicopterRows = ({ helicopterStatusRows }) => {
        if (!helicopterStatusRows || helicopterStatusRows.size === 0) {
            return null;
        }

        return helicopterStatusRows.map((helicopterStatus, index) =>
            getCrewHelicopterSubRow({
                resource: helicopterStatus,
                isLastRow: helicopterStatusRows.length - 1 === index,
            })
        );
    };

    return [
        <FirstRow key="first-row" />,
        getHelicopterRows({
            helicopterStatusRows: crewRow.get('statusable_resources'),
        })?.map((el, index) => (
            <tr
                key={crewRow.getIn([
                    'statusable_resources',
                    index,
                    'identifier',
                ])}
                style={crewRowStyle.additionalHelicopterRow}
                onClick={handleClick(crewRow.get('id'))}
            >
                {el}
            </tr>
        )),
    ];
};

const staffingValues = (resource) => {
    if (resource.get('resource_type') === 'RappelHelicopter') {
        const staffingValues = [
            resource.getIn(['latest_status', 'staffing_value1'], '-'),
            // Additional staffing categories have been disabled for now
            // resource.getIn(['latest_status', 'staffing_value2'], '-'),
            // resource.getIn(['latest_status', 'staffing_value3'], '-'),
        ];
        return staffingValues.join(' / ');
    }

    return '';
};

const boostersIn = (resource) => {
    if (resource.get('resource_type') === 'RappelHelicopter') {
        const boostersCount = resource.getIn(
            ['latest_status', 'staffing_value2'],
            '0'
        );
        return boostersCount;
    }

    return '';
};

const StaffedIncidentList = ({ jsonString }) => {
    if (!jsonString) {
        return null;
    }
    let incidents = [];
    try {
        incidents = JSON.parse(jsonString);
    } catch (e) {
        console.error('Failed to parse staffed incidents JSON', e);
        return null;
    }
    const incidentRows = incidents.map((incident, index) => {
        const personnel = incident.personnel || '';
        const incidentName = incident.incident_name || '';
        const demob = incident.demob || '';
        return (
            <tr key={incidentName + index}>
                <td style={{ width: 50 }}>{personnel}</td>
                <td style={{ textAlign: 'center' }}>{incidentName}</td>
                <td>{demob}</td>
            </tr>
        );
    });

    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: 50 }}>Personnel</th>
                    <th style={{ textAlign: 'center' }}>Incident </th>
                    <th style={{}}>Est. Demob</th>
                </tr>
            </thead>
            <tbody>{incidentRows.length > 0 && incidentRows}</tbody>
        </table>
    );
};

const getCrewHelicopterSubRow = ({ resource, isLastRow = false }) => {
    if (!resource) {
        return [
            <td key={`staffing`}></td>,
            <td key={`model`}></td>,
            <td key={`location`}></td>,
            <td key={`fire`}></td>,
            <td key={`manager`}></td>,
            <td key={`incidents`}></td>,
            <td key={`boosters`}></td>,
            <td key={`info`}></td>,
        ];
    }

    const keyPrefix = resource.get('identifier');
    return [
        <td
            key={`${keyPrefix}-staffing`}
            style={{ textAlign: 'left', paddingLeft: 10 }}
        >
            {staffingValues(resource)}
        </td>,
        <td key={`${keyPrefix}-model`}>
            <HelicopterIdentifier resource={resource} />
        </td>,
        <td key={`${keyPrefix}-location`}>
            {resource.getIn(['latest_status', 'location_name'])}
        </td>,
        <td key={`${keyPrefix}-fire`}>
            {resource.getIn(['latest_status', 'assigned_fire_name'])}
        </td>,
        <td key={`${keyPrefix}-manager`}>
            {resource.getIn(['latest_status', 'manager_name']) &&
                `${resource.getIn(['latest_status', 'manager_name'])}`}
            <br />
            {resource.getIn(['latest_status', 'manager_phone']) &&
                `${resource.getIn(['latest_status', 'manager_phone'])}`}
        </td>,
        <td key={`${keyPrefix}-incidents`}>
            <StaffedIncidentList
                jsonString={resource.getIn(['latest_status', 'comments1'])}
            />
        </td>,
        <td key={`${keyPrefix}-boosters`}>{boostersIn(resource)}</td>,
        <td key={`${keyPrefix}-info`}>
            {resource.getIn(['latest_status', 'comments2']) &&
                resource.getIn(['latest_status', 'comments2'])}
        </td>,
    ];
};

const CrewPersonnelRow = ({ person }) =>
    person.name ? (
        <span className="row" style={styles.getCrewResourceRowStyle()}>
            <span className="col-xs-2"> </span>
            <span className="col-xs-3">
                {person.name}
                {person.role && ` [${person.role}]`}
            </span>
            <span className="col-xs-3">{person.location}</span>
            <span className="col-xs-4">{person.note}</span>
        </span>
    ) : null;

CrewPersonnelRow.propTypes = {
    person: PropTypes.shape({
        name: PropTypes.string,
        role: PropTypes.string,
        location: PropTypes.string,
        note: PropTypes.string,
    }),
};

// const StatusSummaryTable = ({ crews }) => (
class StatusSummaryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCrewRow: null,
        };
    }

    handleCrewRowClick = (crewId) => () => {
        this.setState((prevState) => {
            return {
                selectedCrewRow:
                    prevState.selectedCrewRow === crewId ? null : crewId,
            };
        });
    };

    render() {
        return (
            <div style={styles.statusSummaryTableWrapper()}>
                <table style={styles.getStatusSummaryTableStyle()}>
                    <HeaderRow />
                    <tbody>
                        {this.props.crews.map((crew) => (
                            <CrewRow
                                key={crew.get('id')}
                                crewRow={crew}
                                isSelected={
                                    parseInt(this.state.selectedCrewRow, 10) ===
                                    parseInt(crew.get('id'), 10)
                                }
                                handleClick={this.handleCrewRowClick}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
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
