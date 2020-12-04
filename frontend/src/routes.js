import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Logon from './pages/Logon';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewIncident from './pages/NewIncident';
import NotFound from './pages/Notfound';
import Email from './pages/Email';

export default function Routes() {
    //Switch é responsável por chamar apenas um rota por vez
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Logon} />
                <Route path="/register" component={Register} />
                <Route path="/profile" component={Profile} />
                <Route path="/incidents/new" component={NewIncident} />
                <Route path="/send-email" component={Email} />
                <Route path="*" component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
}