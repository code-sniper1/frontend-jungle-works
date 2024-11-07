import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  imgSrc:string = "https://jungleworks.com/wp-content/uploads/2023/05/shutterstock_588023378-scaled.jpg";
  popup:boolean = false;

  constructor(private router:Router, private dialogService:DialogService){}

  openSignupDialog() {
    this.dialogService.openSignupDialog();
  }

  openLoginDialog() {
    this.dialogService.openLoginDialog();
  }
}
