import React,{useEffect, useState} from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Profile.css';
import  {Storage}  from '@capacitor/storage';
import { isPlatform } from '@ionic/react';
import Shipper from './shipper';
import Carrier from './carrier';
import {db,storage} from '../../firebase';

import {collection,addDoc, getDoc, getDocs, where, doc, query,} from 'firebase/firestore'
import { useHistory } from 'react-router';

const userCollectionRef = collection(db,"user")
function Profile(props) {

 

 
  const [role,setRole] = useState("")
  const history = useHistory()
  


  const GetUserData =async ()=>{
    
    let parse = ""
    if(isPlatform("android") || isPlatform("ios")){
      let user = await Storage.get({key:"user"})
      parse = JSON.parse(user.value)
      

    }else{

     const user = window.localStorage.getItem("user")
      parse = JSON.parse(user)
      

    }
   const user_doc =  doc(userCollectionRef,parse.id)
   const data = await getDoc(user_doc)
  
    setRole(data.data().role)
    
  }


  useEffect(()=>{
  async function GetAllData(){
   
  await  GetUserData()
   }
   GetAllData()
  
  },[])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
       
      

       
        {role=="shipper"?
      
      <Shipper getData={GetUserData} isLoggedIn={props.isLoggedIn} history={history} />
      
        :
        
      <Carrier getData={GetUserData} isLoggedIn={props.isLoggedIn} history={history}  />
      
        }
       


       
      </IonContent>
    </IonPage>
  );
};

export default Profile;
