import React,{useState,useEffect} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonRow,IonLoading,IonAlert,isPlatform, IonModal, IonButtons } from '@ionic/react';
import {personCircle} from 'ionicons/icons';
import {db,storage} from '../firebase';
import { Storage } from '@capacitor/storage'

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc,} from 'firebase/firestore'
import { useHistory } from 'react-router';

const RequestsCollectionRef = collection(db,"requests")
const UserCollectionRef = collection(db,"user")


export default function CarrierCard(props) {
 
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
            const check_request_query = query(RequestsCollectionRef,where("requested_to","==",props.data.id),where("requested_by","==",parse.id))
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
                const path = {
                  pathname:"/carrier_info",
                  state:{
                    request_to:props.data.id,
                    load_id:props.load_id,
                    screen:history.location.pathname
                  }
                  
                }
                history.push(path)
              }} icon={personCircle}  style={{color:is_requested == false?'red':"#013220"}} size='large'/>
                
                    <p style={{width:100,height:30}}>{props.data.data.firstname} </p>
                  
                  
                    
                  





                  


                   </div>

        
               
          );
  
 
};