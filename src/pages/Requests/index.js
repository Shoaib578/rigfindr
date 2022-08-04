import React,{useEffect,useState} from 'react'
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,isPlatform, useIonViewDidEnter,IonRow,IonCol,IonItem, IonLabel } from '@ionic/react';


import {db,storage} from '../../firebase';
import { Storage } from '@capacitor/storage'

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc,} from 'firebase/firestore'
import RequestCard from '../../Components/RequestCard';
import { useHistory } from 'react-router';
const RequestsCollectionRef = collection(db,"requests")

function Requests() {
  const [data,setData] = useState([])
  const [type,setType] = useState("")
  const history = useHistory()



  const GetRequests = async(type)=>{
    setType(type)
    let parse = ""
    if(isPlatform("android") || isPlatform("ios")){
      let user = await Storage.get({key:"user"})
      parse = JSON.parse(user.value)
      

    }else{

     const user = window.localStorage.getItem("user")
      parse = JSON.parse(user)
     


    }

    let id =parse.id
    
    console.log(id)
    let req_query = ""  
    if(type == "sent"){
     req_query = query(RequestsCollectionRef,where("requested_by","==",id),where("is_removed","==",0))

    }else{
     req_query = query(RequestsCollectionRef,where("requested_to","==",id),where("is_removed","==",0))

    }

     
     await getDocs(req_query)
     .then(requests_snapShot=>{
      let temp_data =[]
      let data_obj = {}
      console.log(requests_snapShot.size)
      requests_snapShot.docs.forEach(data=>{
        console.log(data.data())

        data_obj = {
          id:data.id,
          data:data.data()
        }
        temp_data.push(data_obj)
      })
      setData(temp_data)
  
     })


    
  }


  useIonViewDidEnter(()=>{
    console.log("Home ")
    
    GetRequests("sent")
  })


 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Requests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonRow >
                            <IonCol>
                                <IonItem>
                              <IonLabel >Filter</IonLabel>

                              <IonButton onClick={()=>GetRequests("sent")} fill={type == "sent"?"outline":null}>Sent</IonButton>
                              <IonButton  onClick={()=>GetRequests("receive")} fill={type =="receive"?"outline":null} style={{marginLeft:20}}>Receive</IonButton>

                                </IonItem>
                            </IonCol>
                            </IonRow>


       {data.map((request,index)=>{
        return <RequestCard history={history} key={index} getRequests={GetRequests} type={type} data={request}/>
       })}

    
   

       
      </IonContent>
    </IonPage>
  );
};

export default Requests;
