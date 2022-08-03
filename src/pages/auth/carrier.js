import { IonContent, IonPage,IonRow,IonCol,IonItem ,IonButton,IonLabel,IonInput,IonHeader,IonToolbar,IonTitle,IonSelect,IonSelectOption,IonLoading,IonAlert, IonButtons, IonBackButton} from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'

import {db,storage} from '../../firebase';
import { Geolocation } from '@capacitor/geolocation';

import {collection,addDoc, getDoc, getDocs, where, doc, query,} from 'firebase/firestore'
const userCollectionRef = collection(db,"user")
var lat = ""
var lng = ""


class Carrier extends React.Component{
   
    state = {
        email:"",
        password:"",
        firstname:"",
        lastname:"",
        phone:"",
        company_name:"",
        dot:"",
        mc:"",
        address:"",
        eq_type:"",
        
        loader:false,
        showAlert:false,
        alertMessage:""
    }
   
    getCurrentLocation = async()=>{
        await Geolocation.getCurrentPosition()
        .then(res=>{
            lat = res.coords.latitude
            lng = res.coords.longitude
        })
        .catch(err=>{
            console.log(err)
        })
    }
    Signup = async()=>{
       
        await Geolocation.getCurrentPosition()
        .then(res=>{
           
            lat = res.coords.latitude
            lng = res.coords.longitude
        })
        .catch(err=>{
            console.log(err)
        })
        console.log(lat)
        if(lat == "" || lng == ""){
           this.setState({showAlert:true,alertMessage:"Please Allow Location Permission to this app and also Turn on the GPS "})
            return false
        }
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)){
            console.log("Email")
        }else{
            this.setState({showAlert:true,alertMessage:"Invalid Email"})
            return false
        }


        if(this.state.password.length<6 || this.state.password.length>6){
            this.setState({showAlert:true,alertMessage:"Password Must Be 6 Characters"})
            return false
        }


        if(this.state.firstname.length<1){
            this.setState({showAlert:true,alertMessage:"First Name is required"})
            return false
        }

        if(this.state.lastname.length<1){
            this.setState({showAlert:true,alertMessage:"Last Name is required"})
            return false
        }


        if(this.state.company_name.length<1){
            this.setState({showAlert:true,alertMessage:"Company Name is required"})
            return false
        }


        this.setState({loader:true})
        const data = query(userCollectionRef,where("email","==",this.state.email))
        const queryShot = await getDocs(data)

        

        if(queryShot.size <1){
            addDoc(userCollectionRef,{
                firstname:this.state.firstname,
                lastname:this.state.lastname,
                email:this.state.email,
                password:this.state.password,
                phone:this.state.phone,
                company_name:this.state.company_name,
                address:this.state.address,
                dot:this.state.dot,
                mc:this.state.mc,
                eq_type:this.state.eq_type,
                latitude:lat,
                longitude:lng,
                role:"carrier"
            })
            .then(res=>{
                this.setState({loader:false,showAlert:true,alertMessage:"Thanks for Signing up"})
            })
            .catch(err=>{
                this.setState({loader:false,showAlert:true,alertMessage:err.message})
            })
        }else{
            this.setState({loader:false,showAlert:true,alertMessage:"Email Already in use.Please try another one"})

        }
    }
    componentDidMount(){
        this.getCurrentLocation()
    }
    render(){
        return(
            <IonPage>
            <IonHeader>
              <IonToolbar>
              <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
                <IonTitle>Sign up</IonTitle>
              </IonToolbar>
            </IonHeader>
                            <IonContent fullscreen>
                            <IonAlert
        isOpen={this.state.showAlert}
        onDidDismiss={() => this.setState({showAlert:false})}
        header={'Alert'}
        
        message={this.state.alertMessage}
        buttons={['OK']}
      >
      </IonAlert>

      <IonLoading
        cssClass='my-custom-class'
        isOpen={this.state.loader}
        onDidDismiss={() => {this.setState({loader:false})}}
        message={'Signing up...'}
        
      />
            
                            <IonRow style={{marginTop:20}}>
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating"> First name</IonLabel>
                                <IonInput
                                    type="text"
                                    onIonChange={(val)=>this.setState({firstname:val.target.value})}
                                    value={this.state.firstname}
                                
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
            
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating"> Last name</IonLabel>
                                <IonInput
                                    type="text"
                                    value={this.state.lastname}

                                    onIonChange={(val)=>this.setState({lastname:val.target.value})}
                                
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
            
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating"> Phone</IonLabel>
                                <IonInput
                                    type="text"
                                    value={this.state.phone}

                                    onIonChange={(val)=>this.setState({phone:val.target.value})}
                                
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
            
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating"> Company name</IonLabel>
                                <IonInput
                                    type="text"
                                    value={this.state.company_name}

                                    onIonChange={(val)=>this.setState({company_name:val.target.value})}
                                
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
            
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating">Address</IonLabel>
                                <IonInput
                                    type="text"
                                    value={this.state.address}

                                    placeholder='zip, state seperate fields'
                                    onIonChange={(val)=>this.setState({address:val.target.value})}
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating">DOT# </IonLabel>
                                <IonInput
                                    type="text"
                                    placeholder='DOT#'
                                    value={this.state.dot}

                                    onIonChange={(val)=>this.setState({dot:val.target.value})}
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
            
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating">MC# </IonLabel>
                                <IonInput
                                    type="text"
                                    placeholder='MC#'
                                    value={this.state.mc}

                                    onIonChange={(val)=>this.setState({mc:val.target.value})}
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
            
            
            
            
            
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating"> Email</IonLabel>
                                <IonInput
                                    type="email"
                                    value={this.state.email}

                                    onIonChange={(val)=>this.setState({email:val.target.value})}
                                
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
            
            
            
                            <IonRow>
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating"> Password</IonLabel>
                                <IonInput
                                    type="password"
                                    value={this.state.password}

                                    onIonChange={(val)=>this.setState({password:val.target.value})}
                                
                                    
                                    >
                                </IonInput>
                                </IonItem>
                            </IonCol>
                            </IonRow>
            
            
                            <IonItem>
                    <IonLabel>Equipment type</IonLabel>
                    <IonSelect 
                                    
                                    onIonChange={(val)=>this.setState({eq_type:val.target.value})}
                    
                    value={this.state.eq_type} okText="Okay" cancelText="Dismiss">
                      <IonSelectOption value="Dry Van">Dry Van</IonSelectOption>
                      <IonSelectOption value="Flatbed">Flatbed</IonSelectOption>
                      
                      <IonSelectOption value="Box Truck">Box Truck</IonSelectOption>
                      <IonSelectOption value="Reefer">Reefer</IonSelectOption>
                      <IonSelectOption value="Step Deck">Step Deck</IonSelectOption>
                      <IonSelectOption value="Power Only">Power Only</IonSelectOption>
                      <IonSelectOption value="Hotshot">Hotshot</IonSelectOption>
                      <IonSelectOption value="Lowboy">Lowboy</IonSelectOption>
                      <IonSelectOption value="Other">Other</IonSelectOption>
                      
                    </IonSelect>
                  </IonItem>
            
            
            
                            <IonRow style={{marginTop:20}}>
                            <IonCol>
                            
                                <IonButton expand="block" onClick={()=>{
                                    this.Signup()
                                }}>
                                Signup
                                </IonButton>
            
                                <p style={{ fontSize: "medium",textAlign:"center" }}>
                                Don't have an account? <Link to="/login">Sign in!</Link>
                                </p>
                            </IonCol>
                            </IonRow>
            
            
                            </IonContent>
                        </IonPage>


           
        )
    }
}

export default Carrier