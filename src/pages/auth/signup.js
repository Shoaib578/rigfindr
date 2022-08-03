import { IonContent, IonPage,IonRow,IonCol,IonItem ,IonButton,IonLabel,IonInput,IonHeader,IonToolbar,IonTitle,IonSelect,IonLoading,IonAlert,IonSelectOption, IonButtons, IonBackButton} from '@ionic/react'

import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import "../../styles/styles.css"

function Signup(){


    const history = useHistory()
  
    
        return(
            <IonPage>
            <IonHeader>
              <IonToolbar>
              <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
                <IonTitle>Choose</IonTitle>
              </IonToolbar>
            </IonHeader>
                            <IonContent   fullscreen>
            

                            <IonButton expand="block" style={{marginTop:'40%'}} onClick={()=>{
                    const location = {
                        pathname: '/shipper/signup',
                        state: {  }
                    }
                       history.push(location)
                    }}>
                    Shipper
                    </IonButton>


                    <IonButton expand="block" style={{marginTop:20}} onClick={()=>{
                    const location = {
                        pathname: '/carrier/signup',
                        state: {  }
                    }
                        history.push(location)
                    }}>
                    Carrier
                    </IonButton>


            
                            </IonContent>
                        </IonPage>


           
        )
   
}

export default Signup