import React, { useEffect, useState } from 'react'
import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonPage,
  isPlatform
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home,person,cube, personAdd } from 'ionicons/icons';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Loads from './pages/Loads';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Shipper from './pages/auth/shipper';
import Carrier from './pages/auth/carrier';
import { Storage } from '@capacitor/storage';
import CheckAuth from './pages/CheckAuth';
import ViewLoad from './pages/ViewLoad';
import CarrierInfo from './pages/CarrierInfo';
import ShipperRequests from './pages/ShipperRequests';

setupIonicReact();



function App(){
 
 const [isAuth,setIsAuth] = useState(false)
  const [role,setRole] = useState("")
  const history = useHistory()

  const [user,setUser] = useState("")
 const isLoggedIn = async()=>{
  let parse = ""
  console.log(typeof(parse))

  if(isPlatform("android") || isPlatform("ios")){
   let user = await Storage.get({key:"user"})
    parse = JSON.parse(user.value)
  }else{
    let user = window.localStorage.getItem("user")
    parse = JSON.parse(user)
  }
  setUser(parse.data)
  if(parse != null){
    console.log("Not Null")
    setIsAuth(true)
    setRole(parse.data.role)
  }else{
    setIsAuth(false)
    
  }
 }



     
useEffect(()=>{
  
    isLoggedIn()

  
  
})
        return(
          <IonApp>
              <IonReactRouter>
                <IonTabs>
                  <IonRouterOutlet>
                    <Route exact path="/home" component={Home} />
                     
                  
                    <Route exact path={"/loads"}>
                        <Loads />
                          
                        
                       
                          
                          </Route>


                          <Route  exact path={"/view_load"} >
                          <ViewLoad user={user}/>


                          </Route>

                          <Route  exact path={"/shipper_requests"} >
                          <ShipperRequests user={user}/>


                          </Route>


                          <Route  exact path={"/carrier_info"} >
                          <CarrierInfo />


                          </Route>


                    <Route exact path="/profile" >
                    <Profile isLoggedIn={isLoggedIn} />
                    </Route>


                    
                     


                    <Route exact path="/check_auth">
                      <CheckAuth />
                    </Route>


                    <Route path="/login">
                      <Login isLoggedIn={isLoggedIn}/>
                    </Route>

                    <Route exact path="/signup">
                      <Signup />
                    </Route>


                    <Route exact path="/shipper/signup">
                      <Shipper />
                    </Route>


                    <Route exact path="/carrier/signup">
                      <Carrier />
                    </Route>


                   <Route exact path="/">
                      
                    <CheckAuth />
                    
                  
                   
                    </Route>
                  </IonRouterOutlet>
          
          
                  <IonTabBar  id="TabBar" slot={isAuth == true?"bottom":"none"}>
                  <IonTabButton  tab="home"   href="/home">
                      <IonIcon icon={home} />
                      <IonLabel>Home</IonLabel>
                    </IonTabButton>
                                    
                   {role == "shipper"?<IonTabButton tab="loads" href="/loads">
                   <IonIcon icon={cube} />
                   <IonLabel>Loads</IonLabel>
                 </IonTabButton>:null}


                 {role == "shipper"?<IonTabButton tab="shipper_request" href="/shipper_requests">
                   <IonIcon icon={personAdd} />
                   <IonLabel>Requests</IonLabel>
                 </IonTabButton>:null}
                
                    <IonTabButton tab="profile" href="/profile">
                      <IonIcon icon={person} />
                      <IonLabel>Profile</IonLabel>
                    </IonTabButton>
                   
                  </IonTabBar>
          
          
                </IonTabs>
              </IonReactRouter>
          
              
            </IonApp>
                )
     
      
  }

  


export default App;
