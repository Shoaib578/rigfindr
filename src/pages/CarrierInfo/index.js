
import React,{useState} from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonRow,IonLoading,IonAlert,isPlatform, IonModal, IonButtons, useIonViewDidEnter, IonBackButton,IonSelect,IonSelectOption } from '@ionic/react';
import {calendar, cube, pin ,phonePortrait,call,closeCircle, person, mail, mailOpen,buildOutline,personCircle, home, build } from 'ionicons/icons';
import {db,storage} from '../../firebase';
import { Storage } from '@capacitor/storage'

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc,} from 'firebase/firestore'
import { useHistory } from 'react-router';

const RequestsCollectionRef = collection(db,"requests")

const UserCollectionRef = collection(db,"user")
const LoadsCollectionRef = collection(db,"loads")

export default function CarrierInfo(){
    const [loader,setLoader] = useState(false)
    const [showAlert,setShowAlert] = useState(false)
    const [alertMessage,setAlertMessage] = useState("")
    const [is_requested,setis_requested] = useState(true)
    const [data,setData] = useState([])
    const [Loads,setLoads] = useState([])
    const [load_id,setloadID] = useState("")
    const history = useHistory()

    const getCarrier = async()=>{
          
             
            
        const carrier_query = doc(UserCollectionRef,history.location.state.request_to)
        const snapShot =await getDoc(carrier_query)
        
        setData(snapShot.data())
       
        
       
    }

    const getLoads = async()=>{
      let parse = ""
      if(isPlatform("android") || isPlatform("ios")){
        let user = await Storage.get({key:"user"})
        parse = JSON.parse(user.value)
        
  
      }else{
  
       const user = window.localStorage.getItem("user")
        parse = JSON.parse(user)
       
  
  
      }
      
     
      
  
  
      let loads_query = query(LoadsCollectionRef,where("added_by","==",parse.id)) 
      const queryShot = await getDocs(loads_query)
      console.log(queryShot.size)
      let temp_data= []
      queryShot.docs.forEach(data=>{
        
        temp_data.push({
          id:data.id,
          data:data.data()
        })
      })
      console.log(temp_data)
      setLoads(temp_data)
  
    }
   const send_request = async()=>{
   
        setLoader(true)
        let parse = ""
        if(isPlatform("android") || isPlatform("ios")){
          let user = await Storage.get({key:"user"})
          parse = JSON.parse(user.value)
          
    
        }else{
    
         const user = window.localStorage.getItem("user")
          parse = JSON.parse(user)
         
    
    
        }
        console.log(parse)
        
        await addDoc(RequestsCollectionRef,{
            requested_by:parse.id,
            requested_to:history.location.state.request_to,
            status:"",
            load_id:history.location.state.screen == "/view_load"?history.location.state.load_id:load_id
    
        })
        .then(res=>{
        
            setAlertMessage("Sent Successfully")
            if(history.location.state.screen == "/view_load"){
              check_request()
            }else{
              check_request_home(load_id)
            }
            setLoader(false)
            setShowAlert(true)
          
        })
        .catch(err=>{
            
            setAlertMessage("Something Went Wrong")

            setLoader(false)
            setShowAlert(true)
        })
        
    }
    
    
   const check_request = async()=>{
        
          const check_request_query = query(RequestsCollectionRef,where("load_id","==",history.location.state.load_id),where("requested_to","==",history.location.state.request_to))
          let snapShot =await getDocs(check_request_query)
          if(snapShot.size>0){
              setis_requested(true)
          }else{
              setis_requested(false)
  
      
          }
       
       
    }

    const check_request_home = async(arg_load_id)=>{
      console.log("Request To")
      console.log(history.location.state.request_to)
      console.log("Load ID")
      console.log(arg_load_id)
      const check_request_query = query(RequestsCollectionRef,where("load_id","==",arg_load_id),where("requested_to","==",history.location.state.request_to))
      let snapShot =await getDocs(check_request_query)
      if(snapShot.size>0){
          setis_requested(true)
      }else{
          setis_requested(false)

  
      }
    }

    useIonViewDidEnter(()=>{
      console.log(history.location.state.screen)
        if(history.location.state.screen == "/view_load"){
          console.log("Hello")
          check_request()

        }

        getLoads()

        getCarrier()
    })
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                <IonBackButton defaultHref="/view_load"/>
                </IonButtons>
                <IonTitle>CarrierInfo</IonTitle>

                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

            <IonAlert
                    isOpen={ showAlert}
                    onDidDismiss={() =>  setShowAlert(false)}
                    header={'Alert'}
                    
                    message={alertMessage}
                    buttons={['OK']}
                >
                </IonAlert>


                <IonLoading
                    cssClass='my-custom-class'
                    isOpen={loader}
                    onDidDismiss={() => {setLoader(false)}}
                    message={'Sending...'}
                    
                />


          <IonItem  >
          
          <IonLabel>
            <h3>First Name</h3>
            <p>{data.firstname}</p>
          </IonLabel>
          <IonIcon icon={person} slot="end" />
        </IonItem>






        
        
        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Last Name</h3>
            <p>{data.lastname}</p>
          </IonLabel>
          <IonIcon icon={person} slot="end" />
        </IonItem>

        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Phone Number</h3>
            <p>{data.phone}</p>
          </IonLabel>
          <IonIcon icon={phonePortrait} slot="end" />
        </IonItem>

        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Email</h3>
            <p>{data.email}</p>
          </IonLabel>
          <IonIcon icon={mail} slot="end" />
        </IonItem>


       
        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Equipment Type</h3>
            <p>{data.eq_type}</p>
          </IonLabel>
          <IonIcon icon={build} slot="end" />
        </IonItem>



        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Address</h3>
            <p>{data.address}</p>
          </IonLabel>
          <IonIcon icon={home} slot="end" />
        </IonItem>

        
        {history.location.state.screen == "/home"?<IonItem>
                    <IonLabel>Load</IonLabel>
                    <IonSelect 
                                    
                                    onIonChange={(val)=>{
                                      
                                      setloadID(val.target.value)
                                     
                                        check_request_home(val.target.value)

                                      
                                    }}
                    
                    value={load_id} okText="Okay" cancelText="Dismiss">
                      {Loads.map((data,index)=>{
                      return <IonSelectOption key={index} value={data.id}>{data.data.load_title}</IonSelectOption>
                      
                      })}
                      
                    </IonSelect>
                  </IonItem>:null}
       
          
          {is_requested == false?<IonButton onClick={send_request} style={{marginTop:20}} expand="block">Send Request</IonButton>:null}

         
          
        
          </IonContent>
        </IonPage>
    )
}