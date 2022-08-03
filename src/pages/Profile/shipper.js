import { IonContent, IonPage,IonRow,IonCol,IonItem ,IonButton,IonLabel,IonInput,IonHeader,IonToolbar,IonTitle,IonSelect,IonLoading,IonAlert,IonSelectOption,isPlatform} from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'
import {db,storage} from '../../firebase';
import { Storage } from '@capacitor/storage';
import {collection,addDoc, getDoc, getDocs, where, doc, query, updateDoc} from 'firebase/firestore'
const userCollectionRef = collection(db,"user")
export default class Shipper extends React.Component{
    state = {
        email:"",
        password:"",
        firstname:"",
        lastname:"",
        phone:"",
        company_name:"",

        loader:false,
        showAlert:false,
        alertMessage:""
    }
    GetUserDetails = async()=>{
        let parse = ""
        if(isPlatform("android") || isPlatform("ios")){
          let user = await Storage.get({key:"user"})
          parse = JSON.parse(user.value)
          
    
        }else{
    
         const user = window.localStorage.getItem("user")
          parse = JSON.parse(user)
          
    
    
        }

        const user_doc = doc(userCollectionRef,parse.id)
        await getDoc(user_doc)
        .then(res=>{

            this.setState({
                email:res.data().email,
                password:res.data().password,
                firstname:res.data().firstname,
                lastname:res.data().lastname,
                phone:res.data().phone,
                company_name:res.data().company_name,
              
                id:parse.id,
            })
        })

       
       
       
       
    
    }

    Logout = async()=>{
        if(isPlatform("android") || isPlatform("ios")){
            await Storage.remove({key:"user"})
          
            
            }else{
                
               window.localStorage.removeItem("user")

            }
            this.props.isLoggedIn()
            const location ={
                pathname:"/login"
            }
            this.props.history.replace(location)
        
    }


    Update = async()=>{
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
        try{
            const user = doc(userCollectionRef,this.state.id)
            let newvalues = {
                firstname:this.state.firstname,
                lastname:this.state.lastname,
                email:this.state.email,
                password:this.state.password,
                phone:this.state.phone,
                company_name:this.state.company_name,
                role:"shipper"
            }
            const data = query(userCollectionRef,where("email","==",this.state.email))
            const queryShot = await getDocs(data)
    
            if(queryShot.size <1 ){
                await updateDoc(user,newvalues)
                
                .then((res)=>{
                this.props.getData()
                   
                this.setState({showAlert:true,alertMessage:"Updated",loader:false})
                    
                })
                .catch(err=>{
                this.setState({showAlert:true,alertMessage:"Something Went Wrong",loader:false})
        
                })
            }else if(queryShot.size>0 && this.state.email == this.props.data.email){
                await updateDoc(user,newvalues)
                
                .then((res)=>{
                    console.log(res)
                    this.props.getData()
                  
                this.setState({showAlert:true,alertMessage:"Updated",loader:false})
                    
                })
                .catch(err=>{
                this.setState({showAlert:true,alertMessage:"Something Went Wrong",loader:false})
        
                })
            }
            else{
                this.setState({showAlert:true,alertMessage:"Email Already in use.Please Try Another One",loader:false})
    
            }
        }catch(err){
            this.setState({showAlert:true,alertMessage:"Something Went Wrong",loader:false})

        }
       
       

    }


   
        componentDidMount(){
            this.GetUserDetails()
        }
    
    render(){
        return(
           
                <div>

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
        message={'Updating...'}
        
      />

            <IonRow style={{marginTop:20}}>
                            <IonCol>
                                <IonItem>
                                <IonLabel position="floating"> First name</IonLabel>
                                <br />
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
                                <br />

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
                                <br />

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
                                <br />

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
                                <br />

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
                                <br />

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
                                    this.Update()
                                }}>
                                Update
                                </IonButton>
            
                                <IonButton onClick={this.Logout} expand="block" style={{marginTop:20}}>
                                Logout
                                </IonButton>
                            </IonCol>
                            </IonRow>
                            </div>

          

        )
    }
}