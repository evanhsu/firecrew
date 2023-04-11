import { fromJS, List } from 'immutable';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import StatusSummaryTable from '../../components/StatusSummaryTable';
import {
    fetchSummary,
    receiveCrewStatusUpdate,
    receiveResourceStatusUpdate,
} from './actions';
import { selectSummary } from './selectors';

export type StatusSummaryProps = {
    crews: List<any>;
    fetchSummary: () => void;
    receiveCrewStatusUpdate: (event: any) => void;
    receiveResourceStatusUpdate: (event: any) => void;
};

const StatusSummary = (props: StatusSummaryProps) => {
    useEffect(() => {
        props.fetchSummary();

        window.Echo.channel('publicStatusUpdates').listen(
            'CrewStatusUpdated',
            (event: any) => {
                props.receiveCrewStatusUpdate(event);
            }
        );

        window.Echo.channel('publicStatusUpdates').listen(
            'ResourceStatusUpdated',
            (event: any) => {
                props.receiveResourceStatusUpdate(event);
            }
        );
    }, []);

    return <StatusSummaryTable crews={props.crews} />;
};

StatusSummary.propTypes = {
    crews: ImmutablePropTypes.list,
    fetchSummary: PropTypes.func.isRequired,
    receiveCrewStatusUpdate: PropTypes.func.isRequired,
    receiveResourceStatusUpdate: PropTypes.func.isRequired,
};

StatusSummary.defaultProps = {
    crews: fromJS([]),
};

function mapStateToProps(state: any) {
    return {
        crews: selectSummary()(state),
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        fetchSummary: () => dispatch(fetchSummary()),
        receiveCrewStatusUpdate: (payload: any) =>
            dispatch(receiveCrewStatusUpdate(payload)),
        receiveResourceStatusUpdate: (payload: any) =>
            dispatch(receiveResourceStatusUpdate(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusSummary);
