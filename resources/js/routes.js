import React from 'react';
import { Route, Switch } from 'react-router-dom';
import StatusSummary from './containers/StatusSummary';
// import Inventory from './containers/Inventory';

const Routes = () => (
    <Switch>
        {/* <Route path="/crew/:crewId/inventory" component={Inventory} /> */}
        <Route path="/summary" exact component={StatusSummary} />
        <Route path="/" exact component={StatusSummary} />
    </Switch>
);

export default Routes;
