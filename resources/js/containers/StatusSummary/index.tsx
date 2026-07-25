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

/**
 * During the staffing-summary UI migration, clients could opt into the legacy
 * layout via localStorage (`firecrew.summaryUiMigration`). That elective path
 * (classic table, migration banner, preference helpers) has been removed, so
 * the key is no longer read — but browsers that previously chose legacy (or
 * dismissed the banner) still have the stale entry. Remove it so we don't leave
 * dead preference data around after the migration is complete. Safe to delete
 * this cleanup once enough time has passed that old clients have loaded a
 * post-migration build at least once.
 */
const LEGACY_SUMMARY_UI_PREFERENCE_KEY = 'firecrew.summaryUiMigration';

function clearStaleSummaryUiPreference(): void {
    try {
        localStorage.removeItem(LEGACY_SUMMARY_UI_PREFERENCE_KEY);
    } catch {
        // Ignore errors (probably caused by the key already being removed)
    }
}

const StatusSummary = (props: StatusSummaryProps) => {
    useEffect(() => {
        clearStaleSummaryUiPreference();

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
