import { IonContent, IonPage,IonRow,IonCol,IonItem ,IonButton,IonLabel,IonInput,IonHeader,IonToolbar,IonTitle,IonSelect,IonSelectOption,IonAlert,IonLoading} from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {db,storage} from '../../firebase';
import  {Storage}  from '@capacitor/storage';
import { isPlatform } from '@ionic/react';
import {collection,addDoc, getDoc, getDocs, where, doc, query,} from 'firebase/firestore'
const userCollectionRef = collection(db,"user")

function Login(props){
    
    const [state,setState] = useState({
        email:"",
        password:"",
        showAlert:false,
        alertMessage:"",
        loader:false
    })

    const history = useHistory()
   
   
  

   const Login = async(props)=>{
        setState({...state,loader:true})
       const data = query(userCollectionRef,where("email","==", state.email))
       const queryShot = await getDocs(data)
       const location ={
        pathname: '/home',
               
        
       }

       if(queryShot.size>0){

       queryShot.forEach(async(doc)=>{
    
        if(state.password == doc.data().password){
            //Loggin
            let user = {
                id:doc.id,
                data:doc.data()
            }
            if(isPlatform("android") || isPlatform("ios")){
            await Storage.set({key:"user",value:JSON.stringify(user)})
          
            
            }else{
                
               window.localStorage.setItem("user",JSON.stringify(user))

            }
            
            props.isLoggedIn()
            setState({...state,loader:false})

            history.push(location)
            
            
            
            
        }else{
             setState({...state,alertMessage:"Invalid Email or Password",showAlert:true,loader:false})
        }
       })
    }else{
        setState({...state,alertMessage:"Invalid Email or Password",showAlert:true,loader:false})
   }

    

    }
    
        return(
            <IonPage>
                    <IonHeader>
  <IonToolbar>
    <IonTitle>Sign in</IonTitle>
  </IonToolbar>
</IonHeader>
                <IonContent fullscreen>
                <IonAlert
                    isOpen={ state.showAlert}
                    onDidDismiss={() =>  setState({showAlert:false})}
                    header={'Alert'}
                    
                    message={ state.alertMessage}
                    buttons={['OK']}
                >
                </IonAlert>


                <IonLoading
                    cssClass='my-custom-class'
                    isOpen={state.loader}
                    onDidDismiss={() => {setState({...state,loader:false})}}
                    message={'Signing in...'}
                    
                />


                <IonRow>
                <IonCol style={{marginTop:20}}>
                    <IonItem>
                    <IonLabel position="floating"> Email</IonLabel>
                    <IonInput
                        type="email"
                        value={state.email}
                        onIonChange={(val)=> setState({...state,email:val.target.value})}
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
                        value={state.password}

                        onIonChange={(val)=> setState({...state,password:val.target.value})}
                    
                        
                        >
                    </IonInput>
                    </IonItem>
                </IonCol>
                </IonRow>






                <IonRow>





                <IonCol>
                
                    <IonButton expand="block" onClick={()=>{
                   

                       Login(props)
                    }}>
                    Signin
                    </IonButton>

                    <p style={{ fontSize: "medium",textAlign:"center" }}>
                    Already have an account? <Link to="/signup">Sign up!</Link>
                    </p>
                </IonCol>
                </IonRow>


                </IonContent>
            </IonPage>
        )
  
}

export default Login