import { useCamera } from "@capacitor-community/react-hooks/camera";
import { CameraResultType, Plugins } from "@capacitor/core";
import { IonBackButton, IonButton, IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonPage, IonRange, IonRow, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { chevronBackOutline, imagesOutline, heartOutline, heartSharp } from 'ionicons/icons';
import React, { useState } from 'react';
import { uuid } from 'uuidv4';


// Her innhentes plugins Storage for localstorage og Geolocation for geolokasjon.
const { Storage, Geolocation } = Plugins;

/**
 * Gjør bildet om til base64, og lagrer dette i localstorage som en JSON tekststring.
 */
const startUploading = async ({ base64string }: { base64string: string }) => {
  try {
    return base64string;
  } catch (e) {
    console.warn(e);
  }
};

// Holder verdier for lengde- og breddegrad til geolokasjon
let latitude: number;
let longitude: number;

/**
 * Kaller Capacitors getCurrentPosition for å hente brukers nåværende posisjon dersom bruker har tillatt dette.
 * 
 * Dette er boilerplate, men den er tillpasset eget behov.
 */
const getLocation = async () => {
  const position = await Geolocation.getCurrentPosition();
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
}

/**
 * NewTrip brukes for å legge til nye turer. Her legges det inn data om turen,
 * her tar bruker også bilde via mobil eller laster opp fra enhet.
 */
const NewTrip = () => {

  /**
   * Her ligger hooks for denne siden, alle props for en tur settes.
   */
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const { photo, getPhoto } = useCamera();
  const [showSubmitToast, setShowSubmitToast] = useState<boolean>(false);
  const [showPhotoRequired, setShowPhotoRequired] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5)

  /**
   * Her sjekkes det om bruker har et bilde som kan brukes, og varsler dersom det ikke er det.
   * Her sier vi også at base64stringen skal være dataURL fra gjeldene bilde. 
   * 
   * Denne er hentet fra TDS200, og finpusset for eget behov.
   */
  const uploadImage = async () => {
    if (photo?.dataUrl) {
      const image = await startUploading({
        base64string: photo.dataUrl,
      })
      return image;
    } else {
      setShowPhotoRequired(true);
    }
  }

  /**
   * Her blir bruker promptet om kamera eller lokal bildemappe skal velges for 
   * bildet.
   * 
   * Denne er boilerplate, og er hentet fra:
   * https://capacitorjs.com/docs/apis/camera
   */
  const openCamera = async () => {
    await getPhoto({
      resultType: CameraResultType.DataUrl,
      quality: 20,
      allowEditing: false
    });
  }

  /**
   * Her sjekkes det om alle felter er fylt ut før posten sendes til localstorage.
   * Mangler det input får bruker en tilbakemelding på dette.
   */
  const submitTrip = async () => {
    try {
      let uploadedImage = await uploadImage();

      if ((photo?.dataUrl != null) && (title !== "") && (description !== "") && (location !== "")) {

        await getLocation()

        setShowSubmitToast(true)

        let { value }: any = await Storage.get({ key: 'trips' })
        const currentTrips: any = value
        let trips: any[] = []

        if (currentTrips) {
          let trips = JSON.parse(currentTrips)
          console.log(trips);

          trips.push({
            id: uuid(),
            title,
            description,
            location,
            img: uploadedImage,
            likes: 0,
            lat: latitude,
            long: longitude,
            rating
          })
          trips = Array.from(new Set(trips));

          await Storage.set({
            key: 'trips',
            value: JSON.stringify(trips)
          })

        } else {
          trips = [];
          trips.push({ id: uuid(), title, description, location, img: uploadedImage, likes: 0, lat: latitude, long: longitude })

          await Storage.set({
            key: 'trips',
            value: JSON.stringify(trips)
          })
        }

        //Lat og long må lagres med trip

      } else {
        setShowPhotoRequired(true)
      }


    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Oppretting av ny tur, valg av bilde, input av data om turen. Her hentes også 
   * geolokasjon fra der bruker er om bruker har gitt samtykke.
   * Bruker får tilbakemelding om tur er lastet opp, eller om noe er gått galt.
   */
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonBackButton icon={chevronBackOutline} defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>New</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonList>
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <img src={photo?.dataUrl} />
                    <IonButton onClick={openCamera}>
                      <IonIcon icon={imagesOutline}></IonIcon>
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Title" value={title} onIonInput={(e: any) => setTitle(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonInput placeholder="Description" value={description} onIonInput={(e: any) => setDescription(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonInput placeholder="Location" value={location} onIonInput={(e: any) => setLocation(e.target.value)} />
            </IonItem>
            <IonItem>
              <IonRange
                min={1}
                max={10}
                step={1}
                value={rating}
                onIonChange={(e: any) => setRating(e.detail.value)}
                snaps
                color="dark"
              >
                <IonIcon slot="start" size="small" color="danger" icon={heartOutline} />
                <IonIcon slot="end" size="small" color="danger" icon={heartSharp} />
              </IonRange>
            </IonItem>
          </IonList>
          <IonButton onClick={submitTrip}>Submit</IonButton>
          <IonToast
            isOpen={showSubmitToast}
            onDidDismiss={() => setShowSubmitToast(false)}
            message="Trip created!"
            duration={3000}
            color="success"
          />
          <IonToast
            isOpen={showPhotoRequired}
            onDidDismiss={() => setShowPhotoRequired(false)}
            message="Insert a photo!"
            duration={3000}
            color="danger"
          />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NewTrip;
