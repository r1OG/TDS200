import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import GoogleMapReact from 'google-map-react';
import { chevronBackOutline, heartOutline, heartSharp, locationOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { FullWidthCard } from '../components/Styled';
import ITrip from '../models/ITrip';

/**
 * Trip brukes for å vise mer informasjon om en enkelt tur.
 * Her vises beskrivelse i tillegg til data fra /home.
 * Kartet er så godt som boilerplate fra GoogleMapReact hvor kun egen
 * API-nøkkel er hentet inn.
 */
const Trip = (props: any) => {
  const trip: ITrip = props.location?.state?.trip;

  /**
   * Her settes hooks for denne siden for å håndtere data.
   */
  const [weather, setweather] = useState([]);
  const [weatherTemp, setWeatherTemp] = useState('');
  const [weatherType, setWeatherType] = useState('');

  /**
   * Henter data om været i byen for valgt trip, gjør det om til rett format
   * før verdiene settes via useState til gitt variabel.
   */
  useIonViewDidEnter(() => {
    setTimeout(() => {
      const fetchWeather = async () => {
        let query = "&q=" + trip.location;
        let weatherUrl = "https://api.openweathermap.org/data/2.5/weather?appid=fba8539042e194f8d41ce95ecadd80d0&units=metric"
        let weatherQuery = weatherUrl.concat(query)
        const response = await fetch(
          weatherQuery);

        const myJson = await response.json();
        setweather(JSON.parse(JSON.stringify(myJson)));

        setWeatherTemp(myJson.main.temp);
        setWeatherType(myJson.weather[0].main);
      };
      fetchWeather();
    }, 1000)
  });

  /**
   * Kudos til Andreas for quickfix på backbutton i "Detailview"
   * 
   * Denne sørger for at om det ikke returners noen data, så sendes kun en tom div.
   */
  if (!trip) {
    return <div></div>;
  }

  /**
   * Fremvising av valgt tur med rett data
   * 
   * Google maps vises i underkant, her hentes lokasjonen fra der bruker 
   * er når "submit" kalles i /newtrip
   */
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonBackButton icon={chevronBackOutline} defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>{trip.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <FullWidthCard>
          <img src={trip.img} alt="hello" />
          <IonGrid>
            <IonRow>
              <IonCol size="9">
                <IonItem color="#1c1c1d">
                  <IonLabel>
                    <h1>{trip.title}</h1>
                  </IonLabel>
                </IonItem>
              </IonCol>
              <IonCol size="2">
                {trip.rating > 4 ? (
                  <IonIcon size="large" icon={heartSharp} color="danger" />
                ) : (
                    <IonIcon size="large" icon={heartOutline} color="danger" />
                  )}
                <IonLabel color="dark">{trip.rating}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem color="#1c1c1d">
                  <IonLabel>
                    <h4>{trip.description}</h4>
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem color="#1c1c1d">
                  <IonIcon icon={locationOutline} />
                  <IonLabel>
                    <h4>{trip.location}</h4>
                    <p>{weatherTemp} °C | {weatherType}</p>
                  </IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </FullWidthCard>
        <div className="map">
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyBfkZdr2dHRGv0-XtUcDc14orOnW_sKp4c' }}
            center={{ lat: trip.lat, lng: trip.long }}
            zoom={14}
          >
          </GoogleMapReact>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Trip;
