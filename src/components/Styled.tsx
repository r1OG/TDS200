import { IonButton, IonCard, IonFabButton, IonImg, IonInput, IonLabel } from '@ionic/react';
import styled from 'styled-components';

/**
 * Her ligger custom components som er tilpasset eget behov.
 * Alt fra endring av farge til midtstilling av elementer.
 */
const FullImg = styled(IonImg)`
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
`;

const FullWidthCard = styled(IonCard)`
    margin-left: 0;
    margin-right: 0;
`;

const LikeButton = styled(IonButton)`
  height: 40px;
`;

const LoginCard = styled(IonCard)`
    width: 27%;
    align-self: center;
`;

const PageTitle = styled.h1`
    font-size: 2.5em;
    align-self: center;
    font-family: 'Roboto Mono', monospace;
`;

const PinTitle = styled(PageTitle)`
    font-size: 1em;
    align-self: center;
    font-family: 'Roboto Mono', monospace;
`;

const LoginButton = styled(IonFabButton)`
    align-self: center;
    margin-top: 1rem;
    
`;

const CenterContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
`;

const PinInput = styled(IonInput)`
    align-self: center;
`;

const PinCode = styled(IonLabel)`
    justify-content: center;
    padding-left: 43%;
    background-color: #000000;
`;

export { FullImg, FullWidthCard, LikeButton, LoginButton, LoginCard, PageTitle, CenterContainer, PinInput, PinCode, PinTitle };
