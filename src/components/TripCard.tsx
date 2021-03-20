import { IonAvatar, IonCardContent, IonCardHeader, IonCol, IonIcon, IonItem, IonLabel, IonRow } from '@ionic/react';
import { heartOutline, heartSharp } from 'ionicons/icons';
import React from 'react';
import ITrip from '../models/ITrip';
import { FullWidthCard } from './Styled';

/**
 * TripCard fungerer som "mal" for hvordan en tur skal vises på /home.
 * 
 * Denne er inspirert fra TDS200, men tilpasset til eget behov.
 * 
 */

const TripCard = ({ img, id, title, description, location, likes, lat, long, rating }: ITrip) => {

  // Lager en random avatar for å fylle IonAvatar
  let randomizer = Math.random().toString(12).replace(/[^a-z]+/g, '').substr(0, 6);
  let avatar = "https://avatars.dicebear.com/4.5/api/human/" + randomizer + ".svg"

  return (
    <FullWidthCard>
      <img src={img} alt="headerImage" />
      <IonCardHeader>
        <IonItem color="#1c1c1d">
          <IonAvatar>
            <img src={avatar} alt="avatar" />
          </IonAvatar>
          <IonLabel> Ola Normann</IonLabel>
        </IonItem>
      </IonCardHeader>
      <IonRow>
        <IonCol size="9">
          <IonItem color="#1c1c1d">
            <IonLabel>
              <h1>{title}</h1>
            </IonLabel>
          </IonItem>
        </IonCol>
        <IonCol size="3">
          {rating > 4 ? (
            <IonIcon size="large" icon={heartSharp} color="danger" />
          ) : (
              <IonIcon size="large" icon={heartOutline} color="danger" />
            )}
          <IonLabel color="dark">{rating}</IonLabel>
        </IonCol>
      </IonRow>
      <IonCardContent>
        {description}
      </IonCardContent>
    </FullWidthCard>
  )
};



export default TripCard;