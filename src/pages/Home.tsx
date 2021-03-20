import { Plugins } from '@capacitor/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TripCard from '../components/TripCard';
import ITrip from '../models/ITrip';

/**
 * Home componenten står for lagring av hardkodet "dummydata", 
 * samt innhenting av localstorage data som vises i en listevisning.
 */
const Home = () => {

  const { Storage } = Plugins;

  // Hooks for å hente gamle, og nye turer fra localstorage og "dummydata"
  const [tripsA, setTrips] = useState<ITrip[]>([]);

  /**
   * Sjekker om det er innhold i localstorage, og henter inn "dummydata" 
   * om det er tomt. 
   */
  useEffect(() => {
    if (localStorage.length == 0) {
      Storage.set({
        key: "trips",
        value: JSON.stringify([
          {
            img: "https://i.imgur.com/ThOyaM6.jpg",
            id: 0,
            title: "Tur til Nordmarka",
            description: "Fin tur i vakker natur",
            location: "Oslo",
            lat: 59.911491,
            long: 10.757933,
            rating: 7
          },
          {
            img: "https://i.imgur.com/5iiVb9E.jpg",
            id: 1,
            title: "Bjørvika 1/2-2021",
            description: "Spasertur på brygga",
            location: "Oslo",
            lat: 59.911491,
            long: 10.757933,
            rating: 3
          },
        ])
      })
    }
  }
    , []);

  /**
   * Kjøres når bruker går tilbake til /home, og legger til ny trip i tripsA.
   * Forsøker også flere ganger med ett sekunds mellomrom
   */
  useIonViewDidEnter(() => {
    setTimeout(() => {
      const fetchPosts = async () => {
        await Storage.get({ key: 'trips' })
          .then((ret: any) => {
            let trips = JSON.parse(ret.value)
            setTrips(trips)
          })
          .catch((e) => {
            console.log(e)
          })
      }
      fetchPosts()
    }, 1000)
  })

  /**
   * Rendrer alle turene i en liste med link videre til hver tur.
   * Listen lastes også baklengs.
   */

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trippin</IonTitle>
          <IonButtons slot={"end"}>
            <IonButton routerLink="/newtrip" color="dark">
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {tripsA?.map((trip: any) => (
          <Link style={{ textDecoration: 'none' }} key={trip.id} to={{
            pathname: `/trip/${trip.id}`,
            state: {
              trip
            }
          }}>
            <TripCard {...trip} />
          </Link>
        )).reverse()
        }
      </IonContent>
        )
    </IonPage>
  );

};

export default Home;
