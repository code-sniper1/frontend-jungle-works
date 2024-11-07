import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class DataService {
    
    constructor() {}
    userToken!:string;
  
    setUserToken(token:string){
        this.userToken = token;
    }

    getUserToken(){
        return this.userToken;
    }
    
  }