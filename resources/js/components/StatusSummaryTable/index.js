import { fromJS, Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CrewInfo from './CrewInfo';
import DutyOfficer from './DutyOfficer';
import * as styles from './styles';
import Timestamp from './Timestamp';

const formatHelicopterModelForDisplay = (resource) => {
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

    return `${identifier} (${model})`;
};

const HeaderRow = () => (
    <thead>
        <tr>
            <th style={{ width: styles.tableColWidth(0) }}>Crew</th>
            <th style={{ width: styles.tableColWidth(1) }}>
                Available Rappellers
            </th>
            <th style={{ width: styles.tableColWidth(2) }}>Helicopter</th>
            <th style={{ width: styles.tableColWidth(3) }}>Location</th>
            <th style={{ width: styles.tableColWidth(4) }}>
                Current Assignment
            </th>
            <th style={{ width: styles.tableColWidth(5) }}>Spotter</th>
            <th style={{ width: styles.tableColWidth(6) }}>
                Staffed Incidents
            </th>
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

    const crewRowStyle = styles.getCrewRowStyle({ crewRow, isSelected });

    const FirstRow = ({
        helicopterStatusRow,
        totalHelicoptersForThisCrewRowCount,
    }) => (
        <tr style={crewRowStyle.root} onClick={handleClick(crewRow.get('id'))}>
            <td
                style={{ width: styles.tableColWidth(0) }}
                rowSpan={Math.max(1, totalHelicoptersForThisCrewRowCount)}
            >
                <CrewInfo crew={crewRow} />
                <DutyOfficer dutyOfficer={crewRow.get('status', new Map())} />
                <Timestamp timestamp={crewRow.get('updated_at')} />
            </td>
            {getCrewHelicopterSubRow({
                resource: helicopterStatusRow,
                isLastRow: totalHelicoptersForThisCrewRowCount === 1,
            })}
        </tr>
    );

    const getAdditionalRows = ({ helicopterStatusRows }) => {
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
        <FirstRow
            helicopterStatusRow={crewRow.get('statusable_resources').first()}
            totalHelicoptersForThisCrewRowCount={
                crewRow.get('statusable_resources').size
            }
        />,
        getAdditionalRows({
            helicopterStatusRows: crewRow.get('statusable_resources').shift(),
        })?.map((el) => <tr>{el}</tr>),
    ];
};

CrewRow.propTypes = {
    crewRow: ImmutablePropTypes.map,
    isSelected: PropTypes.bool,
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

const StaffedIncidentList = ({ whitespaceDelimitedString }) => {
    if (!whitespaceDelimitedString) {
        return null;
    }
    const withHtmlBreaks = whitespaceDelimitedString.replace(/\s+/, `<br />`);
    return <span dangerouslySetInnerHTML={{ __html: withHtmlBreaks }}></span>;
};

const getCrewHelicopterSubRow = ({ resource, isLastRow = false }) => {
    if (!resource) {
        return [
            <td></td>,
            <td></td>,
            <td></td>,
            <td></td>,
            <td></td>,
            <td></td>,
            <td></td>,
        ];
    }
    console.log(resource);
    return [
        <td>{staffingValues(resource)}</td>,
        <td>{formatHelicopterModelForDisplay(resource)}</td>,
        <td>{resource.getIn(['latest_status', 'location_name'])}</td>,
        <td>{resource.getIn(['latest_status', 'assigned_fire_name'])}</td>,
        <td>
            {resource.getIn(['latest_status', 'manager_name']) &&
                `${resource.getIn(['latest_status', 'manager_name'])}`}
            {resource.getIn(['latest_status', 'manager_phone']) &&
                ` (${resource.getIn(['latest_status', 'manager_phone'])})`}
        </td>,
        <td>
            <StaffedIncidentList
                whitespaceDelimitedString={resource.getIn([
                    'latest_status',
                    'comments1',
                ])}
            />
        </td>,
        <td>
            {resource.getIn(['latest_status', 'comments2']) &&
                resource.getIn(['latest_status', 'comments2'])}
        </td>,
    ];
};

// CrewResourceRow.propTypes = {
//     resource: ImmutablePropTypes.map,
// };

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
