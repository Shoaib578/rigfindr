import React,{useEffect,useState} from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar ,IonButton,IonPopover,IonModal ,isPlatform,IonInput,IonLabel,IonCol,IonRow,IonItem,IonAlert,IonLoading,IonSelect,IonSelectOption} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';

import './Load.css';
import LoadCard from '../../Components/LoadCard';
import {db,storage} from '../../firebase';
import { Storage } from '@capacitor/storage';
import {collection,addDoc, getDoc, getDocs, where, doc, query,} from 'firebase/firestore'
import { useHistory } from 'react-router';

let lat=""
let lng = ""
const LoadsCollectionRef = collection(db,"loads")
function Loads() {
  const [showModal, setShowModal] = useState(false);
  const [date,setDate] = useState("")
  const [eq_type,setEquipmentType] = useState("")
  const [title,setTitle] = useState("")
  const [location,setLocation] = useState("")
  const [loader,setLoader]= useState(false)
  const [showAlert,setShowAlert] = useState(false)
  const [alertMessage,setAlertMessage] = useState("")
  const [id,setID] = useState("")

  const [loads,setLoads] = useState([])
  const history = useHistory()
  const toggleModal = ()=>{
    if(showModal){
      setShowModal(false)
    }else{
      setShowModal(true)
    }
  }

  const GetUserID = async()=>{
    let parse = ""
    if(isPlatform("android") || isPlatform("ios")){
      let user = await Storage.get({key:"user"})
      parse = JSON.parse(user.value)
      

    }else{

     const user = window.localStorage.getItem("user")
      parse = JSON.parse(user)
     


    }
    
   
    setID(parse.id)

    
  }

  const AddLoad = async()=>{
    await Geolocation.getCurrentPosition()
    .then(res=>{
        lat = res.coords.latitude
        lng = res.coords.longitude
    })
    .catch(err=>{
        console.log(err)
    })
   
    
  
    if(lat == "" || lng == ""){
      setAlertMessage("Please Allow Location Permission to this app and also Turn on the GPS")
      setShowAlert(true)
        return false
    }

    


    setLoader(true)
    
    await addDoc(LoadsCollectionRef,{
      load_title:title,
      eq_type:eq_type,
      location:location,
      pickup_date:date,
      added_by:id,
      latitude:lat,
      longitude:lng

    })
    .then(res=>{
      setLoader(false)

      setAlertMessage("Added")
      setShowAlert(true)
      setShowModal(false)
      getLoads()
    })
    .catch(err=>{
      setLoader(false)

      setAlertMessage("Something Went Wrong")
      setShowAlert(true)
      setShowModal(false)

    })
  }
 const getCurrentLocation = async()=>{
    await Geolocation.getCurrentPosition()
    .then(res=>{
        lat = res.coords.latitude
        lng = res.coords.longitude
    })
    .catch(err=>{
        console.log(err)
    })
    
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
      temp_data.push(data)
    })

    setLoads(temp_data)

  }
  useEffect(()=>{
    GetUserID()
    getCurrentLocation()

    getLoads()

  },[])
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Loads</IonTitle>
          <IonButton onClick={toggleModal} fill='outline' size='small' style={{marginRight:10}} slot="end">Add</IonButton>

        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
       
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
                    message={'Adding...'}
                    
                />
      {loads.map((data,index)=>{
           return   <LoadCard history={history} screen="index" getLoads={getLoads} key={index} data={data.data()} id={data.id} />
 
      })}





      <IonModal onDidDismiss={() => setShowModal(false)} isOpen={showModal} style={{borderRadius:20}}>
                
               <IonRow>
                <IonCol style={{marginTop:20}}>
                    <IonItem>
                    <IonLabel position="floating"> Title</IonLabel>
                    <IonInput
                        type="text"
                        value={title}
                        onIonChange={(val)=> setTitle(val.target.value)}
                        >
                    </IonInput>
                    </IonItem>
                </IonCol>
                </IonRow>
                
                <IonRow>
                <IonCol style={{marginTop:20}}>
                    <IonItem>
                    <IonLabel position="floating"> Location</IonLabel>
                    <IonInput
                        type="text"
                        value={location}
                        onIonChange={(val)=> setLocation(val.target.value)}
                        >
                    </IonInput>
                    </IonItem>
                </IonCol>
                </IonRow>



                <IonRow>
                <IonCol style={{marginTop:20}}>
                    <IonItem>
                    <IonLabel position="floating"> Pick up Date</IonLabel>
                    <IonInput
                        type="date"
                        value={date}
                        style={{marginTop:20}}
                        onIonChange={(val)=>{
                          console.log(val.target.value)
                          setDate(val.target.value)
                        } }
                        >
                    </IonInput>
                    </IonItem>
                </IonCol>
                </IonRow>


                <IonItem>
                    <IonLabel>Equipment type</IonLabel>
                    <IonSelect 
                    style={{marginTop:20}}
                    onIonChange={(val)=> setEquipmentType(val.target.value)}
                    
                    value={eq_type} okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="Dry Van">Dry Van</IonSelectOption>
                      <IonSelectOption value="Flatbed">Flatbed</IonSelectOption>
                      <IonSelectOption value="Reefer">Reefer</IonSelectOption>
                      <IonSelectOption value="Box Truck">Box Truck</IonSelectOption>
                      <IonSelectOption value="Reefer">Reefer</IonSelectOption>
                      <IonSelectOption value="Step Deck">Step Deck</IonSelectOption>
                      <IonSelectOption value="Power Only">Power Only</IonSelectOption>
                      <IonSelectOption value="Hotshot">Hotshot</IonSelectOption>
                      <IonSelectOption value="Lowboy">Lowboy</IonSelectOption>
                      <IonSelectOption value="Other">Other</IonSelectOption>
                      
                    </IonSelect>
                  </IonItem>


              

        <IonButton onClick={()=>{
          console.log("Hellow")
          AddLoad()
          
          } } style={{marginTop:70}}>Add</IonButton>

        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal> 
       
      </IonContent>
    </IonPage>
  );
};

export default Loads;
