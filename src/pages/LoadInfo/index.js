
import React,{useState} from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonRow,IonLoading,IonAlert,isPlatform, IonModal, IonButtons, useIonViewDidEnter, IonBackButton,IonSelect,IonSelectOption } from '@ionic/react';
import {calendar, cube, pin ,phonePortrait,call,closeCircle, person, mail, mailOpen,buildOutline,personCircle, home, build, buildSharp } from 'ionicons/icons';
import {db,storage} from '../../firebase';
import { Storage } from '@capacitor/storage'

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc,} from 'firebase/firestore'
import { useHistory } from 'react-router';


const RequestsCollectionRef = collection(db,"requests")

const UserCollectionRef = collection(db,"user")
const LoadsCollectionRef = collection(db,"loads")

export default function LoadInfo(){
    const [loader,setLoader] = useState(false)
    const [showAlert,setShowAlert] = useState(false)
    const [alertMessage,setAlertMessage] = useState("")
    const [is_requested,setis_requested] = useState(true)
    const [data,setData] = useState([])
    const [Load,setLoad] = useState({
      id:"",
      data:{}
    })
    const [load_id,setloadID] = useState("")
    const [Owner,setOwner] = useState("")
    const history = useHistory()


    const getLoad = async()=>{
      let parse = ""
      if(isPlatform("android") || isPlatform("ios")){
        let user = await Storage.get({key:"user"})
        parse = JSON.parse(user.value)
        
  
      }else{
  
       const user = window.localStorage.getItem("user")
        parse = JSON.parse(user)
       
  
  
      }
      
     
      
  
  
      let loads_query = doc(LoadsCollectionRef,history.location.state.load_id) 
      const queryShot = await getDoc(loads_query)
      console.log(queryShot.size)
      let temp_data= ""
      temp_data = {
        id:queryShot.id,
        data:queryShot.data()
      }
      
      setLoad(temp_data)
  
    }


   const GetOwnerDetails = async()=>{
      const user_doc = doc(UserCollectionRef,history.location.state.request_to)
      await getDoc(user_doc)
      .then(res=>{
        setOwner(res.data())
      })
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
            load_id:history.location.state.load_id
    
        })
        .then(res=>{
        
            setAlertMessage("Sent Successfully")
            
              check_request()
            
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
    let parse = ""
    if(isPlatform("android") || isPlatform("ios")){
      let user = await Storage.get({key:"user"})
      parse = JSON.parse(user.value)
      

    }else{

     const user = window.localStorage.getItem("user")
      parse = JSON.parse(user)
     


    }
          const check_request_query = query(RequestsCollectionRef,where("load_id","==",history.location.state.load_id),where("requested_by","==",parse.id))
          let snapShot =await getDocs(check_request_query)
          if(snapShot.size>0){
              setis_requested(true)
          }else{
              setis_requested(false)
  
      
          }
       
       
    }

 
    useIonViewDidEnter(()=>{
          getLoad()
      
       
          check_request()



          GetOwnerDetails()
    })
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                <IonBackButton defaultHref="/view_load"/>
                </IonButtons>
                <IonTitle>LoadInfo</IonTitle>

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
            <h3>Title</h3>
            <p>{Load.data.load_title}</p>
          </IonLabel>
          <IonIcon icon={cube} slot="end" />
        </IonItem>

        <IonItem  >
          
          <IonLabel>
            <h3>Equipment Type</h3>
            <p>{Load.data.eq_type}</p>
          </IonLabel>
          <IonIcon icon={buildSharp} slot="end" />
        </IonItem>


        <IonItem  >
          
          <IonLabel>
            <h3>Company Name</h3>
            <p>{Owner.company_name}</p>
          </IonLabel>
          <IonIcon icon={buildSharp} slot="end" />
        </IonItem>


        <IonItem  >
          
          <IonLabel>
            <h3>Owner Name</h3>
            <p>{Owner.firstname} {Owner.lastname}</p>
          </IonLabel>
          <IonIcon icon={person} slot="end" />
        </IonItem>



        <IonItem  >
          
          <IonLabel>
            <h3>Owner Email</h3>
            <p>{Owner.email}</p>
          </IonLabel>
          <IonIcon icon={mail} slot="end" />
        </IonItem>
        

        <IonItem  >
          
          <IonLabel>
            <h3>Owner Phone Number</h3>
            <p>{Owner.phone}</p>
          </IonLabel>
          <IonIcon icon={phonePortrait} slot="end" />
        </IonItem>
        
        

       
          
          {is_requested == false?<IonButton onClick={send_request} style={{marginTop:20}} expand="block">Send Request</IonButton>:null}

         
          
        
          </IonContent>
        </IonPage>
    )
}