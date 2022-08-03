import { IonContent, IonPage,IonRow,IonCol,IonItem ,IonButton,IonLabel,IonInput,IonHeader,IonToolbar,IonTitle,IonSelect,IonLoading,IonAlert,IonSelectOption, IonButtons, IonBackButton} from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'
import {db,storage} from '../../firebase';
import { Geolocation } from '@capacitor/geolocation';
import {ref,uploadBytesResumable} from 'firebase/storage'


import {collection,addDoc, getDoc, getDocs, where, doc, query,} from 'firebase/firestore'
const userCollectionRef = collection(db,"user")
var lat="";
var lng="";


export default class Shipper extends React.Component{
   
    state = {
            email:"",
            password:"",
            firstname:"",
            lastname:"",
            phone:"",
            company_name:"",
            file:"",
            loader:false,
            showAlert:false,
            alertMessage:""
        }
    
        pickImage = (val)=>{
            console.log(val)
        }
   
    uploadImage = ()=>{
        const Storageref = ref(storage,"/profile_image/232323.jpg")
   
    const uploadTask = uploadBytesResumable(Storageref,this.state.file)
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
                latitude:lat,
                longitude:lng,
                role:"shipper"


            })
            .then(res=>{
                this.setState({loader:false,showAlert:true,alertMessage:"Thanks for Signing up",
            
                email:"",
                password:"",
                firstname:"",
                lastname:"",
                phone:"",
                company_name:"",
                })
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

     
                            <IonRow >
                            <IonCol>
                                <IonItem>
                                <IonInput  type="file" accept="image/*" onIonChange={ (val)=>console.log(val.target.name)} />
                                </IonItem>
                            </IonCol>
                            </IonRow>



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
                                    type="number"
                                    value={this.state.phone}
                                    pattern={/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/}
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
                                <IonLabel position="floating"> Email</IonLabel>
                                <IonInput
                                    value={this.state.email}

                                    onIonChange={(val)=>this.setState({email:val.target.value})}

                                    type="email"
                                
                                    
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

                            <IonRow style={{marginTop:20}}>
                            <IonCol>
                            
                                <IonButton disabled={this.state.loader} expand="block" onClick={()=>{
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