import { Injectable } from "@angular/core";
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
  })
  export class apiResponseService {
    
    constructor( private messageService: MessageService) {}
    userToken!:string;
  
    handleApiResponse(response: any, isSuccessful: boolean) {
        const message = {
          severity: isSuccessful ? 'success' : 'error',
          summary: isSuccessful ? 'Success!' : 'Error!',
          detail: response.message || 'An error occurred.', 
        };
    
        this.messageService.add(message);
      }
    
  }