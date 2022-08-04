import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader,useIonViewDidEnter, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonRow,IonLoading,IonAlert,isPlatform, IonModal, IonButtons } from '@ionic/react';
import {cube, personCircle} from 'ionicons/icons';
import {db,storage} from '../firebase';
import { Storage } from '@capacitor/storage'

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc,} from 'firebase/firestore'
import { useHistory } from 'react-router';

const RequestsCollectionRef = collection(db,"requests")


export default function LoadsForCarrierCards(props) {
 
    const history = useHistory()

    const [is_requested,setis_requested] = useState(false)
    const check_request = async()=>{
      let parse = ""
      if(isPlatform("android") || isPlatform("ios")){
        let user = await Storage.get({key:"user"})
        parse = JSON.parse(user.value)
        
  
      }else{
  
       const user = window.localStorage.getItem("user")
        parse = JSON.parse(user)
       
  
  
      }

      console.log("Load ID  ")
      console.log(props.data.id)
            const check_request_query = query(RequestsCollectionRef,where("load_id","==",props.data.id),where("requested_by","==",parse.id))
            let snapShot =await getDocs(check_request_query)
            if(snapShot.size>0){
                setis_requested(true)
            }else{
                setis_requested(false)
    
        
            }
         
    }  
    useEffect(()=>{
      check_request()
    },[])
        return (
           
               
        
                <div>
          

            



              <IonIcon onClick={()=>{
                console.log("Load ID")
                 console.log(props.data.data.added_by)
                const path = {
                  pathname:"/load_info",
                  state:{
                    request_to:props.data.data.added_by,
                    load_id:props.data.id,
                    
                  }
                  
                }
                history.push(path)
              }} icon={cube}  style={{color:is_requested == false?'red':'#013220'}} size='large'/>
                
                    <p style={{width:100,height:30}}>{props.data.data.load_title} </p>
                  
                  
                    
                  





                  


                   </div>

        
               
          );
  
 
};