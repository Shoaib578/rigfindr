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
import LoadsForCarrierCards from '../../Components/LoadsForCarrierCards';
const LoadsCollectionRef = collection(db,"loads")
const UserCollectionRef = collection(db,"user")



const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };
export default class CarrierHome extends React.Component{
    state = {
     
      ModalOpen:false,
      FilterEqType:"",
      FilterLocation:"",
      
      FilterMiles:0,
      FilteredLoads:[]

    }
    
    
     calcCrow = (lat1, lon1, lat2, lon2)=>{
      
      var R = 6371; // km
      var dLat = this.toRad(lat2-lat1);
      var dLon = this.toRad(lon2-lon1);
      var lat1 = this.toRad(lat1);
      var lat2 = this.toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      
      return d
    }

    // Converts numeric degrees to radians
     toRad = (Value)=> {
        return Value * Math.PI / 180;
    }
    

         FilterLoads = async ()=>{
            console.log("Hellow")
            if(this.state.FilterEqType.length<1 && this.state.FilterLocation.length<1 && this.state.FilterMiles <1){
              console.log("Hello")
                return false

            }

            let parse = ""
        if(isPlatform("android") || isPlatform("ios")){
          let user = await Storage.get({key:"user"})
          parse = JSON.parse(user.value)
          
    
        }else{
    
         const user = window.localStorage.getItem("user")
          parse = JSON.parse(user)
          
    
    
        }

            let load_query = ""

            if(this.state.FilterEqType.length>0 && this.state.FilterLocation.length<1){
                load_query = query(LoadsCollectionRef,where("eq_type","==",this.state.FilterEqType))
                let snapShot =await  getDocs(load_query)
                    
                let load_obj = { }
                let eq_temp_data = []
                console.log(snapShot.size)
                snapShot.docs.forEach(data=>{
    
                  load_obj = {
                        data:data.data(),
                        id:data.id
                    }
                    eq_temp_data.push(load_obj)
    
                })
    
    
                var parentDiv = document.getElementById("dataDiv")
                var dataChild = document.getElementById("list")
                
                parentDiv.insertBefore(dataChild,dataChild)
                this.setState({loads:eq_temp_data},()=>{
                  this.setState({FilteredLoads:this.state.loads})
                })
            }else if(this.state.FilterEqType.length<1 && this.state.FilterLocation.length>0){
                load_query = query(LoadsCollectionRef,where("address","==",this.state.FilterLocation))
                let snapShot =await  getDocs(load_query)
                    
                let load_obj = { }
                let eq_temp_data = []
                console.log(snapShot.size)
                snapShot.docs.forEach(data=>{
    
                    load_obj = {
                        data:data.data(),
                        id:data.id
                    }
                    eq_temp_data.push(load_obj)
    
                })
    
    
                var parentDiv = document.getElementById("dataDiv")
                var dataChild = document.getElementById("list")
                
                parentDiv.insertBefore(dataChild,dataChild)
                this.setState({loads:eq_temp_data},()=>{
                  this.setState({FilteredLoads:this.state.loads})
                })
            }else if(this.state.FilterEqType.length>0 && this.state.FilterLocation.length>0){
                load_query = query(LoadsCollectionRef,where("eq_type","==",this.state.FilterEqType),where("address","==",this.state.FilterLocation))
                let snapShot =await  getDocs(load_query)
                    
                let load_obj = { }
                let eq_temp_data = []
                console.log(snapShot.size)
                snapShot.docs.forEach(data=>{
    
                  load_obj = {
                        data:data.data(),
                        id:data.id
                    }
                    eq_temp_data.push(load_obj)
    
                })
    
    
                var parentDiv = document.getElementById("dataDiv")
                var dataChild = document.getElementById("list")
                
                parentDiv.insertBefore(dataChild,dataChild)
                this.setState({loads:eq_temp_data},()=>{
                  this.setState({FilteredLoads:this.state.loads})
                })
            }

           
                
           


                
                if(this.state.FilterMiles>0){
                
                let temp_loads_data= []
               
                
                this.state.loads.filter(load=>{
                  console.log("In Miles"+load.data.load_title)
                  console.log(parseFloat(this.calcCrow(parse.data.latitude,parse.data.longitude,load.data.latitude,load.data.longitude)).toFixed(0))
                  if(parseFloat(this.calcCrow(parse.data.latitude,parse.data.longitude,load.data.latitude,load.data.longitude)).toFixed(0)<=parseFloat(this.state.FilterMiles).toFixed(0)){
                    temp_loads_data.push(load)
                  }

             
                })
                  
                
                this.setState({FilteredLoads:temp_loads_data})

                }

                this.setState({ModalOpen:false})



        }

         getLoads = async()=>{
          
             
            
           
            const snapShot =await getDocs(LoadsCollectionRef)
            
            let load_obj = { }
            let temp_data = []
            console.log(snapShot.docs)
            snapShot.docs.forEach(data=>{
                console.log(data.data())
                load_obj = {
                    data:data.data(),
                    id:data.id
                }
                temp_data.push(load_obj)

            })

           this.setState({loads:temp_data},()=>{
            this.setState({FilteredLoads:this.state.loads})
           })
           
        }

         getUserDetails = async()=>{
          let parse = ""
          if(isPlatform("android") || isPlatform("ios")){
            let user = await Storage.get({key:"user"})
            parse = JSON.parse(user.value)
            
      
          }else{
      
           const user =await window.localStorage.getItem("user")
            parse = JSON.parse(user)
           
      
      
          }
          

          this.setState({center:{
            lat:parse.data.latitude,
            lng:parse.data.longitude
          }})
        }


        ClearAllFilters = ()=>{
          this.setState({loads:[],FilteredLoads:[],FilterEqType:"",FilterLocation:"",FilterMiles:0})
          this.getCarriers()
          this.setState({ModalOpen:false})

        }



        componentDidMount(){
          this.getLoads()
          this.getUserDetails()
        }

    

      
        render(){

        return(
            <IonPage>
                <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
                </IonHeader>


                <IonContent fullscreen>
                



                




                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent:"space-between",
                    width: "100%",
                    padding:7
                }}>
                <h3 style={{marginLeft:5,color:"white"}}>Loads</h3>
                <IonButton  onClick={() => this.setState({ModalOpen:true})}>Filter</IonButton>


                </div>
                
               

                
                <div  id="dataDiv"style={{height:'89%'}}>
                <p id="list"></p>

            <GoogleMapReact
                    key='AIzaSyBAib-1BjGoD7XZBgsj-yJlqcW-9DvFKTk'
                    defaultCenter={this.state.center}
                    defaultZoom={defaultProps.zoom}
                    
                >
                   
                  
              
                {this.state.FilteredLoads.map((item,index)=>{
                    
                    return <LoadsForCarrierCards id="list" lat={parseFloat(item.data.latitude)} lng={parseFloat(item.data.longitude)}   data={item} key={index} />
                })}
               
                   
                  
                </GoogleMapReact>
                </div>

            {/* IonModal */}

           


                <IonModal onDidDismiss={()=>this.setState({ModalOpen:false})} isOpen={this.state.ModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Filter</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => this.setState({ModalOpen:false})}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
          
                    <IonItem>
                    <IonLabel>Equipment type</IonLabel>
                    <IonSelect 
                                    
                                    onIonChange={(val)=>{
                                        console.log(val.target.value)
                                        this.setState({FilterEqType:val.target.value})
                                        

                                    }}
                    
                    value={this.state.FilterEqType} okText="Okay" cancelText="Dismiss">
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
                        value={this.state.FilterLocation}
                        onIonChange={(val)=> this.setState({FilterLocation:val.target.value})}
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
                        value={this.state.FilterMiles}
                        onIonChange={(val)=>{
                          console.log(val.target.value)
                           this.setState({FilterMiles:val.target.value})
                          }}
                        >
                    </IonInput>
                    </IonItem>
                </IonCol>
                </IonRow>


          


                <IonButton  onClick={this.FilterLoads} style={{marginTop:60}} expand="block">
                Filter
                </IonButton>
                <IonButton  onClick={this.ClearAllFilters} style={{marginTop:20}} expand="block">
                Clear All Filters
                </IonButton>
        </IonContent>
        </IonModal>
    
                </IonContent>
            </IonPage>
        )
      }
    
}