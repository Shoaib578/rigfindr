import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonRow,IonLoading,IonAlert,isPlatform, IonModal, IonButtons } from '@ionic/react';
import {personCircle} from 'ionicons/icons';
import {db,storage} from '../firebase';
import { Storage } from '@capacitor/storage'

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc,} from 'firebase/firestore'
import { useHistory } from 'react-router';

const RequestsCollectionRef = collection(db,"requests")


export default function CarrierCard(props) {
 
    const history = useHistory()

    
        return (
           
               
        
                <div>
          

            



              <IonIcon onClick={()=>{
                const path = {
                  pathname:"/carrier_info",
                  state:{
                    request_to:props.data.id,
                    load_id:props.load_id,
                    screen:history.location.pathname
                  }
                  
                }
                history.push(path)
              }} icon={personCircle}  style={{color:'red'}} size='large'/>
                
                    <p style={{width:100,height:30}}>{props.data.data.firstname} </p>
                  
                  
                    
                  





                  


                   </div>

        
               
          );
  
 
};