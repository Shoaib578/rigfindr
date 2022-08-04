import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter,IonInput,IonModal,IonLabel,IonSelect,IonSelectOption,IonRow,IonCol,IonItem,IonButton,IonButtons, IonIcon, IonBackButton,isPlatform } from '@ionic/react'

import React, { useEffect,useState } from 'react'
import {db,storage} from '../../firebase';
import { Storage } from '@capacitor/storage';
import {collection,addDoc, getDoc, getDocs, where, doc, query,} from 'firebase/firestore'
import { useHistory } from 'react-router';
import LoadCard from '../../Components/LoadCard';
import CarrierCard from '../../Components/CarrierCard';
import GoogleMapReact from 'google-map-react';
import { location, personCircle } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';

import '../../styles/styles.css'
const LoadsCollectionRef = collection(db,"loads")
const UserCollectionRef = collection(db,"user")



const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };
export default function ViewLoad(props){
    const [data,setData] = useState("")
    const [carriers,setCarriers] = useState([])
    const [id,setID] = useState("")
    const history = useHistory()
    const [ModalOpen,setModalOpen] = useState(false)
    const [FilterEqType,setFilterEqType] = useState("")
    const [FilterMiles,setFilterMiles] = useState(0)
    const [FilterLocation,setFilterLocation] = useState("")
    
    const [FilteredCarriers,setFilteredCarriers] = useState([])


        const getLoad = async()=>{
            let load_doc = doc(LoadsCollectionRef,history.location.state.id)
            await getDoc(load_doc)
            .then(res=>{
              setData(res.data())
              setID(res.id)
             
              
            })


        }

       const calcCrow = (lat1, lon1, lat2, lon2)=>{
      
            var R = 6371; // km
            var dLat = toRad(lat2-lat1);
            var dLon = toRad(lon2-lon1);
            var lat1 = toRad(lat1);
            var lat2 = toRad(lat2);
      
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;
            
            return d
          }
      
          // Converts numeric degrees to radians
       const  toRad = (Value)=> {
              return Value * Math.PI / 180;
          }
          


       async function FilterCarriers(){
        
            if(FilterEqType.length<1 && FilterLocation.length<1 && FilterMiles<1){
                return false

            }

            let carriers_query = ""
            let parse = ""
            if(isPlatform("android") || isPlatform("ios")){
              let user = await Storage.get({key:"user"})
              parse = JSON.parse(user.value)
              
        
            }else{
        
             const user = window.localStorage.getItem("user")
              parse = JSON.parse(user)
              
        
        
            }
            if(FilterEqType.length>0 && FilterLocation.length<1){
                carriers_query = query(UserCollectionRef,where("role","==","carrier"),where("eq_type","==",FilterEqType))
                let snapShot =await  getDocs(carriers_query)
                    
                let carrier_obj = { }
                let eq_temp_data = []
                console.log(snapShot.size)
                snapShot.docs.forEach(data=>{
    
                    carrier_obj = {
                        data:data.data(),
                        id:data.id
                    }
                    eq_temp_data.push(carrier_obj)
    
                })
    
    
                var parentDiv = document.getElementById("dataDiv")
                var dataChild = document.getElementById("list")
                
                parentDiv.insertBefore(dataChild,dataChild)
                setCarriers(eq_temp_data)
                setFilteredCarriers(eq_temp_data)

            }else if(FilterEqType.length<1 && FilterLocation.length>0){
                carriers_query = query(UserCollectionRef,where("role","==","carrier"),where("address","==",FilterLocation))
                let snapShot =await  getDocs(carriers_query)
                    
                let carrier_obj = { }
                let eq_temp_data = []
                console.log(snapShot.size)
                snapShot.docs.forEach(data=>{
    
                    carrier_obj = {
                        data:data.data(),
                        id:data.id
                    }
                    eq_temp_data.push(carrier_obj)
    
                })
    
    
                var parentDiv = document.getElementById("dataDiv")
                var dataChild = document.getElementById("list")
                
                parentDiv.insertBefore(dataChild,dataChild)
                setCarriers(eq_temp_data)
                setFilteredCarriers(eq_temp_data)

            }else if(FilterEqType.length>0 && FilterLocation.length>0){
                carriers_query = query(UserCollectionRef,where("role","==","carrier"),where("eq_type","==",FilterEqType),where("address","==",FilterLocation))
                let snapShot =await  getDocs(carriers_query)
                    
                let carrier_obj = { }
                let eq_temp_data = []
                console.log(snapShot.size)
                snapShot.docs.forEach(data=>{
    
                    carrier_obj = {
                        data:data.data(),
                        id:data.id
                    }
                    eq_temp_data.push(carrier_obj)
    
                })
    
    
                var parentDiv = document.getElementById("dataDiv")
                var dataChild = document.getElementById("list")
                
                parentDiv.insertBefore(dataChild,dataChild)
                setCarriers(eq_temp_data)
                setFilteredCarriers(eq_temp_data)
                
            }


            if(FilterMiles>0){
                
                let temp_carrier_data= []
               
                
                carriers.filter(carrier=>{
                  console.log("In Miles"+carrier.data.firstname)
                  console.log(parseFloat(calcCrow(parse.data.latitude,parse.data.longitude,carrier.data.latitude,carrier.data.longitude)).toFixed(0))
                  if(parseFloat(calcCrow(parse.data.latitude,parse.data.longitude,carrier.data.latitude,carrier.data.longitude)).toFixed(0)<=parseFloat(FilterMiles).toFixed(0)){
                    temp_carrier_data.push(carrier)
                  }

             
                })
                  
                
               setFilteredCarriers(temp_carrier_data)

                }
           
                
           
          
                setModalOpen(false)



        }

        const getCarriers = async()=>{
          
             
            
            const carrier_query = query(UserCollectionRef,where("role","==","carrier"))
            const snapShot =await getDocs(carrier_query)
            
            let carrier_obj = { }
            let temp_data = []
           
            snapShot.docs.forEach(data=>{

                carrier_obj = {
                    data:data.data(),
                    id:data.id
                }
                temp_data.push(carrier_obj)

            })

            setCarriers(temp_data)
            setFilteredCarriers(temp_data)
           
        }

        const ClearAllFilters = ()=>{
            
            setCarriers([])
            setFilteredCarriers([])
            setFilterEqType("")
            setFilterMiles(0)
            setFilterLocation("")
            getCarriers()
            setModalOpen(false)
  
          }

        useIonViewDidEnter(()=>{
           
            getLoad()
            getCarriers()
           

        })

      
        
        return(
            <IonPage>
                <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
                    <IonTitle>Load</IonTitle>
                </IonToolbar>
                </IonHeader>


                <IonContent fullscreen>
                <LoadCard getLoads={getLoad}  data={data} id={id} />



                




                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent:"space-between",
                    width: "100%",
                    padding:7
                }}>
                <IonLabel style={{marginLeft:5}}>Carriers</IonLabel>
                <IonButton  onClick={() => setModalOpen(true)}>Filter</IonButton>


                </div>
                
               

                
                <div  id="dataDiv"style={{height:'66%'}}>
                <p id="list"></p>

            <GoogleMapReact
                    key='AIzaSyBAib-1BjGoD7XZBgsj-yJlqcW-9DvFKTk'
                    defaultCenter={{
                        lat:parseFloat(props.user.latitude),
                        lng:parseFloat(props.user.longitude)
                    }}
                    defaultZoom={defaultProps.zoom}
                    
                >
                   
                  
              
                {FilteredCarriers.map((item,index)=>{
                    
                    return <CarrierCard id="list" lat={parseFloat(item.data.latitude)} lng={parseFloat(item.data.longitude)} getLoad={getLoad} load_id={id} data={item} key={index} />
                })}
               
                   
                  
                </GoogleMapReact>
                </div>

            {/* IonModal */}

           


                <IonModal onDidDismiss={()=>setModalOpen(false)} isOpen={ModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Filter</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setModalOpen(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
          
                    <IonItem>
                    <IonLabel>Equipment type</IonLabel>
                    <IonSelect 
                                    
                                    onIonChange={(val)=>{
                                        console.log(val.target.value)
                                        setFilterEqType(val.target.value)
                                        

                                    }}
                    
                    value={FilterEqType} okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="Dry Van">Dry Van</IonSelectOption>
                      <IonSelectOption value="Flatbed">Flatbed</IonSelectOption>
                      <IonSelectOption value="Reefer">Reefer</IonSelectOption>
                      <IonSelectOption value="Box Truck">Box Truck</IonSelectOption>
                     
                      <IonSelectOption value="Step Deck">Step Deck</IonSelectOption>
                      <IonSelectOption value="Power Only">Power Only</IonSelectOption>
                      <IonSelectOption value="Hotshot">Hotshot</IonSelectOption>
                      <IonSelectOption value="Lowboy">Lowboy</IonSelectOption>
                      <IonSelectOption value="Other">Other</IonSelectOption>
                      
                    </IonSelect>
                  </IonItem>



                  <IonRow>
                <IonCol  style={{marginTop:20}}>
                    <IonItem >
                    <IonLabel  position="floating">Address,Zipcode.....</IonLabel>
                    <IonInput
                    
                        type="text"
                        value={FilterLocation}
                        onIonChange={(val)=> setFilterLocation(val.target.value)}
                        >
                    </IonInput>
                    </IonItem>
                </IonCol>
                </IonRow>


                <IonRow>
                <IonCol  style={{marginTop:20}}>
                    <IonItem >
                    <IonLabel  position="floating">Miles</IonLabel>
                    <IonInput
                    
                        type="number"
                        value={FilterMiles}
                        onIonChange={(val)=>{
                          setFilterMiles(val.target.value)
                          }}
                        >
                    </IonInput>
                    </IonItem>
                </IonCol>
                </IonRow>


                <IonButton  onClick={FilterCarriers} style={{marginTop:60}} expand="block">
                Filter
                </IonButton>
                <IonButton  onClick={ClearAllFilters} style={{marginTop:20}} expand="block">
                Clear All Filters
                </IonButton>
        </IonContent>
        </IonModal>
    
                </IonContent>
            </IonPage>
        )
    
}