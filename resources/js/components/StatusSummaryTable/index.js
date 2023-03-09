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
            <th className="col-xs-2">Crew</th>
            <th className="col-xs-10">
                <span className="col-xs-1">Available Rappellers</span>
                <span className="col-xs-2">Helicopter</span>
                <span className="col-xs-1">Location</span>
                <span className="col-xs-2">Current Assignment</span>
                <span className="col-xs-2">Spotter</span>
                <span className="col-xs-2">Staffed Incidents</span>
                <span className="col-xs-2">Additional Info</span>
            </th>
        </tr>
    </thead>
);

const CrewRow = ({ crewRow, isSelected, handleClick }) => {
    const crewRowStyle = styles.getCrewRowStyle({ crewRow, isSelected });
    return (
        <tr style={crewRowStyle.root} onClick={handleClick(crewRow.get('id'))}>
            <td className="col-xs-2">
                <CrewInfo crew={crewRow} />
                <DutyOfficer dutyOfficer={crewRow.get('status', new Map())} />
                <Timestamp timestamp={crewRow.get('updated_at')} />
            </td>
            <td className="col-xs-7 row" style={crewRowStyle.resourceCell}>
                {crewRow.get('statusable_resources').map((resource, index) => {
                    return (
                        <CrewResourceRow
                            key={resource.get('id')}
                            resource={resource}
                            isLastRow={
                                crewRow.get('statusable_resources').size - 1 ===
                                index
                            }
                        />
                    );
                })}
                {[
                    'personnel_1_',
                    'personnel_2_',
                    'personnel_3_',
                    'personnel_4_',
                    'personnel_5_',
                    'personnel_6_',
                ].map((person) => (
                    <CrewPersonnelRow
                        key={person}
                        person={{
                            name: crewRow.getIn(['status', `${person}name`]),
                            role: crewRow.getIn(['status', `${person}role`]),
                            location: crewRow.getIn([
                                'status',
                                `${person}location`,
                            ]),
                            note: crewRow.getIn(['status', `${person}note`]),
                        }}
                    />
                ))}
                {/* <ReactCSSTransitionGroup
                    transitionName="slide"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={250}>
                    {isSelected ? <ExtraInfoRow key="extra-row" crew={crewRow} isSelected={isSelected}/> : null}
                </ReactCSSTransitionGroup> */}
            </td>

            {/* This column is now populated by the CrewResourceRow
             <td className="col-xs-3" style={crewRowStyle.intelCell}>
                {crewRow.getIn(['status', 'intel'])}
            </td>
            */}
        </tr>
    );
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

const CrewResourceRow = ({ resource, isLastRow = false }) => {
    return (
        <span className="row" style={styles.getCrewResourceRowStyle(isLastRow)}>
            <span className="col-xs-1">{staffingValues(resource)}</span>
            <span className="col-xs-2">
                {formatHelicopterModelForDisplay(resource)}
            </span>
            <span className="col-xs-1">
                {resource.getIn(['latest_status', 'location_name'])}
            </span>
            <span className="col-xs-2">
                {resource.getIn(['latest_status', 'assigned_fire_name'])}
            </span>
            <span className="col-xs-2">
                {resource.getIn(['latest_status', 'manager_name']) &&
                    `${resource.getIn(['latest_status', 'manager_name'])}`}
                {resource.getIn(['latest_status', 'manager_phone']) &&
                    ` (${resource.getIn(['latest_status', 'manager_phone'])})`}
            </span>
            <span className="col-xs-2">
                <StaffedIncidentList
                    whitespaceDelimitedString={resource.getIn([
                        'latest_status',
                        'comments1',
                    ])}
                />
            </span>
            <span className="col-xs-2">
                {resource.getIn(['latest_status', 'comments2']) &&
                    resource.getIn(['latest_status', 'comments2'])}
            </span>
        </span>
    );
};

CrewResourceRow.propTypes = {
    resource: ImmutablePropTypes.map,
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
            <div className="table-responsive">
                <table
                    className="table table-condensed"
                    style={styles.getStatusSummaryTableStyle()}
                >
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
