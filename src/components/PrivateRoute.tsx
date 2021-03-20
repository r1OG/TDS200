/**
 * Denne er Work In Progress, og har blitt nedprioritert grunnet gitt tid.
 * Denne ville blitt ferdigstilt om det lot seg gjøre, men per nå ender vi i en 
 * "Maximum update depth exceeded." loop uten noen fiks på dette.
 */
import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import { fakeAuth } from '../pages/Login'

/**
 * Props for vår egne PrivateRoute
 */
type PrivateRouteProps = {
    component: React.FC;
    path: string;
    exact?: boolean;
};

/**
 * Henter ut status på isAuthenticating via fakeAuth for å se om bruker er logget inn før
 * tilgang til /home gis. Skal også redirecte tilbake til /login dersom bruker prøver å være lur.
 */
const PrivateRoute = ({ component, path, exact, ...rest }: PrivateRouteProps) => {
    const location = useLocation();

    return (
        <Route {...rest}>
            {fakeAuth.isAuthenticating === true ?
                <Home />
                :
                <Redirect to="/login" />
            }
        </Route>
    );
}

export default PrivateRoute;