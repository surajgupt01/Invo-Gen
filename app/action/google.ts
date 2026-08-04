"use client"

import {signIn} from "next-auth/react"
import { AuthError } from "next-auth"

export default async function GoogleAuthenticate(){

     try{

       const res =  await signIn("google")
         console.log(res)
        // if(!res) return {"mssg" : "signed In successfully "}
        // else window.location.href = '/dashboard'

     }
     catch(err){
        if(err instanceof AuthError){
            return {"mssg" : "google authentication failed"}
        }
        throw err
     }
}