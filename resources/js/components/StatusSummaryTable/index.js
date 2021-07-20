import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import {Map, fromJS} from 'immutable';
import CrewInfo from './CrewInfo';
import DispatchCenter from './DispatchCenter';
import DutyOfficer from './DutyOfficer';
import ExtraInfoRow from './ExtraInfoRow';
import Timestamp from './Timestamp';
import * as styles from './styles';


const HeaderRow = () => (
    <thead>
    <tr>
        <th className="col-xs-2">Crew</th>
        <th className="col-xs-7">
            <span className="col-xs-2">
              HRAPS / Surplus / Committed
            </span>
            <span className="col-xs-3">Resource</span>
            <span className="col-xs-3">Location</span>
            <span className="col-xs-4">Notes</span>
        </th>
        <th className="col-xs-3">Intel</th>
    </tr>
    </thead>
);

const CrewRow = ({crewRow, isSelected, handleClick}) => {
    const crewRowStyle = styles.getCrewRowStyle({crewRow, isSelected});
    return (
        <tr
            style={crewRowStyle.root}
            onClick={handleClick(crewRow.get('id'))}
        >
            <td className="col-xs-2">
                <CrewInfo crew={crewRow}/>
                <DutyOfficer dutyOfficer={crewRow.get('status', new Map())}/>
                <Timestamp timestamp={crewRow.get('updated_at')}/>
            </td>
            <td
                className="col-xs-7 row"
                style={crewRowStyle.resourceCell}
            >
                {crewRow.get('statusable_resources').map((resource) => (
                    <CrewResourceRow key={resource.get('id')} resource={resource}/>
                ))}
                {['personnel_1_', 'personnel_2_', 'personnel_3_', 'personnel_4_', 'personnel_5_', 'personnel_6_'].map((person) => (
                    <CrewPersonnelRow
                        key={person}
                        person={{
                            name: crewRow.getIn(['status', `${person}name`]),
                            role: crewRow.getIn(['status', `${person}role`]),
                            location: crewRow.getIn(['status', `${person}location`]),
                            note: crewRow.getIn(['status', `${person}note`]),
                        }}
                    />
                ))}
                <ReactCSSTransitionGroup
                    transitionName="slide"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={250}>
                    {isSelected ? <ExtraInfoRow key="extra-row" crew={crewRow} isSelected={isSelected}/> : null}
                </ReactCSSTransitionGroup>
            </td>
            <td className="col-xs-3" style={crewRowStyle.intelCell}>
                {crewRow.getIn(['status', 'intel'])}
            </td>
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
            resource.getIn(['latest_status', 'staffing_value2'], '-'),
            resource.getIn(['latest_status', 'staffing_value3'], '-'),
        ];
        return staffingValues.join(' / ');
    }

    return '';
};

const CrewResourceRow = ({resource}) => (
    <span className="row" style={styles.getCrewResourceRowStyle()}>
        <span className="col-xs-2">{staffingValues(resource)}</span>
        <span className="col-xs-3">{resource.get('identifier')} ({resource.get('model')})</span>
        <span className="col-xs-3">{resource.getIn(['latest_status', 'location_name'])}</span>
        <span className="col-xs-4">
            {resource.getIn(['latest_status', 'manager_name']) && `Contact: ${resource.getIn(['latest_status', 'manager_name'])}`}
            {resource.getIn(['latest_status', 'manager_phone']) && ` (${resource.getIn(['latest_status', 'manager_phone'])})`}<br/>
            {resource.getIn(['latest_status', 'comments1']) && `${resource.getIn(['latest_status', 'comments1'])}`}<br/>
            {resource.getIn(['latest_status', 'comments2'])}
        </span>
    </span>
);

CrewResourceRow.propTypes = {
    resource: ImmutablePropTypes.map,
};


const CrewPersonnelRow = ({person}) => (
    person.name ? (
        <span className="row" style={styles.getCrewResourceRowStyle()}>
      <span className="col-xs-1"> </span>
      <span className="col-xs-3">{person.name}{person.role && ` [${person.role}]`}</span>
      <span className="col-xs-3">{person.location}</span>
      <span className="col-xs-5">{person.note}</span>
    </span>) : null
);

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
        this.setState(prevState => {
            return {
                selectedCrewRow: (prevState.selectedCrewRow === crewId ? null : crewId)
            }
        });
    };

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-condensed" style={styles.getStatusSummaryTableStyle()}>
                    <HeaderRow/>
                    <tbody>
                    {this.props.crews.map((crew) => (
                        <CrewRow
                            key={crew.get('id')}
                            crewRow={crew}
                            isSelected={parseInt(this.state.selectedCrewRow, 10) === parseInt(crew.get('id'), 10)}
                            handleClick={this.handleCrewRowClick}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
};

StatusSummaryTable.propTypes = {
    crews: ImmutablePropTypes.list,
};

StatusSummaryTable.defaultProps = {
    crews: fromJS([]),
};

export default StatusSummaryTable;
