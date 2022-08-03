import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonRow,IonLoading,IonAlert } from '@ionic/react';
import { calendar, cube, pin } from 'ionicons/icons';
import {db,storage} from '../firebase';

import {collection,addDoc, getDoc, getDocs, where, doc, query, deleteDoc,} from 'firebase/firestore'
const LoadsCollectionRef = collection(db,"loads")
export default class LoadCard extends React.Component {
  state = {
    loader:false,
    alertMessage:"",
    showAlert:false
  }
    delete_load = async()=>{
      let load_id = doc(LoadsCollectionRef,this.props.id)
      await deleteDoc(load_id)
      .then(res=>{
        this.setState({loader:false,showAlert:true,alertMessage:"Deleted"})
        this.props.getLoads()
      })
      .catch(err=>{
        this.setState({loader:false,showAlert:true,alertMessage:"Something Went Wrong"})

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
                    <IonIcon icon={cube} slot="start" />
                    <IonLabel>{this.props.data.load_title}</IonLabel>
                    {this.props.screen != null?<div>
                    <IonButton onClick={()=>{
                      let location = {
                        pathname:'/view_load',
                        state:{
                          id:this.props.id
                        }
                      
                      }
                      this.props.history.push(location)
                    }} fill="outline" slot="end">View</IonButton>
                    <IonButton onClick={()=>this.delete_load()} style={{borderRadius:10}} slot="end">Remove</IonButton>
                    </div>:null}
                  

                  </IonItem>
        
                  <IonCardContent>
                   <p>Location : {this.props.data.location}</p>

                   <p>Pickup Date: {this.props.data.pickup_date}</p>
                   <p>Equipment Type: {this.props.data.eq_type}</p>

              </IonCardContent>
                </IonCard>
        
               
          );
    }
 
};