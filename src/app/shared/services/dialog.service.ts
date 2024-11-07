import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LoginComponent } from "src/app/auth/components/login/login.component";
import { SignupComponent } from "src/app/auth/components/signup/signup.component";
import { EditUserComponent } from "../../dashboard/components/show-users/edit-user/edit-user.component";
import { ResetPasswordComponent } from "../../dashboard/components/profile/reset-password/reset-password.component";

@Injectable({
    providedIn: 'root'
  })
  export class DialogService {
  
    private dialogRef !: MatDialogRef<SignupComponent>;
    private loginDialogRef !: MatDialogRef<LoginComponent>;
    private editUserDialogRef !: MatDialogRef<EditUserComponent>;
    private resetPasswordDialogRef !: MatDialogRef<ResetPasswordComponent>;
  
    constructor(private dialog: MatDialog) {}
  
    openSignupDialog(): MatDialogRef<SignupComponent> {
      this.dialogRef = this.dialog.open(SignupComponent, {
        width: '1200px',
        height: '1000px'
      });
      return this.dialogRef;
    }
  
    getDialogRef(): MatDialogRef<SignupComponent> {
      return this.dialogRef;
    }

    openLoginDialog(): MatDialogRef<LoginComponent> {
      this.loginDialogRef = this.dialog.open(LoginComponent, {
        width: '1000px',
        height: '500px'
      });
      return this.loginDialogRef;
    }

    getloginDialogRef(): MatDialogRef<LoginComponent> {
      return this.loginDialogRef;
    }

    openEditUserDialog(): MatDialogRef<EditUserComponent> {
      this.editUserDialogRef = this.dialog.open(EditUserComponent, {
        width: '1000px',
        height: '600px'
      });
      return this.editUserDialogRef;
    }

    getEditUserDialogRef(): MatDialogRef<EditUserComponent> {
      return this.editUserDialogRef;
    }

    openResetPasswordDialog(): MatDialogRef<ResetPasswordComponent> {
      this.resetPasswordDialogRef = this.dialog.open(ResetPasswordComponent, {
        width: '1000px',
        height: '550px'
      });
      return this.resetPasswordDialogRef;
    }

    getResetPasswordDialogRef(): MatDialogRef<ResetPasswordComponent> {
      return this.resetPasswordDialogRef;
    }
  }