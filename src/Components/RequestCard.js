import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,IonButtons, IonModal,IonItem, IonIcon, IonLabel, IonButton, IonRow,IonLoading,IonAlert, IonText ,isPlatform, IonPopover} from '@ionic/react';
import { calendar, cube, pin ,phonePortrait,call,closeCircle, person, mail, mailOpen,buildOutline} from 'ionicons/icons';
import {db,storage} from '../firebase';

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc, updateDoc,} from 'firebase/firestore'
import GoogleMapReact from 'google-map-react'
const LoadsCollectionRef = collection(db,"loads")
const UserCollectionRef = collection(db,"user")
const RequestsCollectionRef = collection(db,"requests")

export default class RequestCard extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loader:false,
      alertMessage:"",
      showAlert:false,
      data:"",
      user:"",
      my_details:"",
      role:"",
      ModalOpen:false
    }
    
    this.setState({data:[]})
    this.GetLoadDetail()
    this.GetUserDetail()
    this.GetMyDetail()

    console.log(this.state.user)
  }
  
  GetLoadDetail =async()=>{
    let load_doc = doc(LoadsCollectionRef,this.props.data.data.load_id)
    await getDoc(load_doc)
    .then(res=>{
     this.setState({data:res.data()})
     console.log(res.data())
     
     
     
      
    })
  }

  
  GetMyDetail = async()=>{
    let parse = ""
    if(isPlatform("android") || isPlatform("ios")){
      let user = await Storage.get({key:"user"})
      parse = JSON.parse(user.value)
      

    }else{

     const user = window.localStorage.getItem("user")
      parse = JSON.parse(user)
      


    }
    
    this.setState({role:parse.data.role,user:parse})
    
  }

  GetUserDetail = async()=>{
    let user_doc = doc(UserCollectionRef,this.props.type == "sent"?this.props.data.data.requested_to:this.props.data.data.requested_by)
    await getDoc(user_doc)
    .then(res=>{
     this.setState({user:res.data()})
     console.log(res.data())
     
     
     
      
    })
  }

  RemoveRequest = async()=>{
    const req_doc = doc(RequestsCollectionRef,this.props.data.id)
    let new_values = {
      is_removed:1
    }
    await updateDoc(req_doc,new_values)
    .then(res=>{
      this.props.getRequests(this.props.type)
      this.setState({alertMessage:"Deleted",showAlert:true})

    })
    .catch(err=>{
      this.setState({alertMessage:"Deleted",showAlert:true})

    })
  }

  

  
    render(){
        return (
           
               
        
                <IonCard>

                  


   <IonAlert
        isOpen={this.state.showAlert}
        onDidDismiss={() => this.setState({showAlert:false})}
        header={'Alert'}
        
        message={this.state.alertMessage}
        buttons={['OK']}
      >
      </IonAlert>




                  <IonItem>
                    <IonIcon icon={call} slot="start" />
                    <IonText style={{fontSize:12}}>{this.props.type == "sent"? 'Requested to':"Requested By"} : <IonButton onClick={()=>this.setState({ModalOpen:true})}> {this.state.user.firstname}</IonButton></IonText>
                    <IonButton  style={{borderRadius:10,marginLeft:10}} onClick={this.RemoveRequest} slot="end">Remove</IonButton>
                 

                    
                   
                  </IonItem>
        
                  <IonCardContent>
                   <p>Location : {this.state.data.location}</p>

                   <p>Pickup Date: {this.state.data.pickup_date}</p>
                   <p>Equipment Type: {this.state.data.eq_type}</p>

                   <br />
                    
                  
                   


                   
                  </IonCardContent>
               

                  <IonModal onDidDismiss={()=>this.setState({ModalOpen:false})} isOpen={this.state.ModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{this.state.user.firstname} Details</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => this.setState({ModalOpen:false})}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
          <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>First Name</h3>
            <p>{this.state.user.firstname}</p>
          </IonLabel>
          <IonIcon icon={person} slot="end" />
        </IonItem>






        
        
        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Last Name</h3>
            <p>{this.state.user.lastname}</p>
          </IonLabel>
          <IonIcon icon={person} slot="end" />
        </IonItem>

        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Phone Number</h3>
            <p>{this.state.user.phone}</p>
          </IonLabel>
          <IonIcon icon={phonePortrait} slot="end" />
        </IonItem>

        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Email</h3>
            <p>{this.state.user.email}</p>
          </IonLabel>
          <IonIcon icon={mail} slot="end" />
        </IonItem>


        <IonItem  onClick={() => { }}>
          
          <IonLabel>
            <h3>Company Name</h3>
            <p>{this.state.user.company_name}</p>
          </IonLabel>
          <IonIcon icon={buildOutline} slot="end" />
        </IonItem>


        <GoogleMapReact
                    key='AIzaSyBAib-1BjGoD7XZBgsj-yJlqcW-9DvFKTk'
                    defaultCenter={{
                      lat:this.props.type == "sent"?parseFloat(this.state.user.latitude):parseFloat(this.state.data.latitude),
                      lng:this.props.type == "sent"?parseFloat(this.state.user.longitude):parseFloat(this.state.data.longitude)
                    }}
                    defaultZoom={12}
                    
                >
                   
                  
                    
                <IonIcon  lat={parseFloat(this.state.user.latitude)} lng={parseFloat(this.state.user.longitude)} icon={this.props.type == "sent"?person:cube}  style={{color:"red",width:30,height:30}} />
                   
                   
                  
                </GoogleMapReact>
        
          </IonContent>
        </IonModal>
              
                </IonCard>
        
               
          );
    }
 
};