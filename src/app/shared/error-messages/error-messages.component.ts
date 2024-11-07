import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.scss'],
})
export class ErrorMessagesComponent implements OnChanges {
  @Input() public control: any;
  errorMessage!: string;

  messages: { [index: string]: any } = {
    emailrequired: 'Email is required!',
    passwordrequired: 'Password is required!',
    addressrequired: 'Address is required!',
    namerequired: 'Name is required!',
    imagerequired: 'Image is required!',
    emailpattern: 'Invalid Email!',
    namepattern: 'Name must be text only!',
    passwordminlength:'Password must be minimum of 6 characters!'
  };

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (this.control.error !== 'false') {
      const errorType = this.control.type;
      const errorName = Object.keys(this.control.error)[0];
      const key = errorType + errorName;
      this.errorMessage = this.messages[key];
    }else{
      this.errorMessage=""
    }
  }
}
