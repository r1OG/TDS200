import { IonContent, IonIcon, IonItem, IonPage, IonSpinner, IonToast, useIonViewWillEnter } from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { CenterContainer, LoginButton, LoginCard, PageTitle, PinInput, PinTitle } from "../components/Styled";

/**
 * Login står for utestenging av uvedkommende via en pinkode som må skrives inn.
 * Pinkoden vises så sensor ikke trenger å lete.
 */
const Login = () => {
    const [pinCode, setPinCode] = useState<number>();

    // History brukes for å holde koll på hvor brukeren har vært tidligere.
    let history = useHistory();

    const pin = 1234;

    /**
     * validateInput er ment til å sørge for at det kun er lov å taste
     * inn 4 tall i input-feltet. Fungerer ikke helt som tiltenkt.
     */
    const validateInput = (inputPin: any) => {
        let regexp = /^[0-9]{4}$/;
        if ((regexp.test(inputPin))) {
            inputPin = inputPin;
        } else {
            inputPin = ""
        } return (
            inputPin
        )
    }

    /**
     * Hooks for å sørge for autentisering av bruker og holde bruker ute
     * dersom vilkårene ikke er møtt.
     */
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [showErrorLoginToast, setShowErrorLoginToast] = useState<boolean>(false);

    /**
     * Kjører når bruker er på vei inn til home for å sørge for at history
     * erstattes med /home. Dette sørger for at bruker ikke logges ut.
     * 
     * Denne er hentet fra forelesning i TDS200.
     */
    useIonViewWillEnter(() => {
        if (isAuthenticating) {
            history.replace("/home");
        } else {
            setIsAuthenticating(false);
            setShowErrorLoginToast(false);
        }
    });

    /**
     * Sjekker inntastet pinkode opp mot satt pinkode for å logge bruker inn.
     * Sørger for at history oppdateres.
     * Gir feedback til bruker dersom pinkode er feil.
     */
    const authenticateUser = async () => {
        setIsAuthenticating(true);
        try {
            if (pinCode == pin) {
                setIsAuthenticating(false);
                history.replace("/home");
            } else {
                setIsAuthenticating(false);
                setShowErrorLoginToast(true);
            }
        } catch (e) {
            console.error(e);
        }

    };

    /**
     * Rendrer /login med input-felt, login-knapp, og toast ved feil input.
     */
    return (
        <IonPage>
            <IonContent class="background">
                <CenterContainer>
                    <PageTitle>Trippin</PageTitle>
                    <PinTitle>{pin}</PinTitle>
                    <LoginCard>
                        <IonItem color="dark">
                            <PinInput clearInput maxlength={4} placeholder="PIN" type="password" onIonChange={(e: any) => setPinCode(validateInput(e.target.value))} />
                        </IonItem>
                    </LoginCard>

                    <LoginButton onClick={authenticateUser} color="dark">
                        {
                            isAuthenticating ?
                                <IonSpinner name="crescent" /> :
                                <IonIcon icon={chevronForward} />
                        }
                    </LoginButton>
                </CenterContainer>
                <IonToast
                    isOpen={showErrorLoginToast}
                    onDidDismiss={() => setShowErrorLoginToast(false)}
                    message="Wrong pincode!"
                    duration={3000}
                    color="danger"
                />
            </IonContent>
        </IonPage>
    );
};

export default Login;

/**
 * Denne funksjonen skal brukes i PrivateRoute for å ta med oss isAuthenticating fra /login,
 * videre simulreres det en bruker som logger inn uten at den blir værende innlogget.
 * 
 * Denne er lånt.
 * https://www.sitepoint.com/react-router-complete-guide/
 */
export const fakeAuth = {
    isAuthenticating: false,
    authenticate(cb: any) {
        this.isAuthenticating = true;
        setTimeout(cb, 100);
    },
    signout(cb: any) {
        this.isAuthenticating = false;
        setTimeout(cb, 100);
    }
};