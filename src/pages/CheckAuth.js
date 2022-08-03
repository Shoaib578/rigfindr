import { async } from '@firebase/util'
import React,{useState,useEffect} from 'react'
import { isPlatform } from '@ionic/core';
import { useHistory } from 'react-router'
import { Storage } from '@capacitor/storage';
import {IonPage, IonContent ,IonLoading, IonImg} from '@ionic/react';
import Logo from '../assets/logo.png'
import '../styles/styles.css'

export default function CheckAuth(){
    const history = useHistory()
    

    const isLoggedIn = async()=>{
   let parse = ""
  console.log(typeof(parse))
  let homeLoc = {
    pathname:"/home"
  }

  let loginLoc = {
    pathname:"/login"
  }




  if(isPlatform("android") || isPlatform("ios")){
   let user = await Storage.get({key:"user"})
    parse = JSON.parse(user.value)
  }else{
    let user = window.localStorage.getItem("user")
    parse = JSON.parse(user)
  }
 
  if(parse != null){
    history.replace(homeLoc)
    

  }else{
    history.replace(loginLoc)
   
    
  }
    }

   
    useEffect(()=>{
        
          isLoggedIn()

       
    },[])

    return null
}