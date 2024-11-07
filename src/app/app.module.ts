import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './shared/services/dialog.service';
import { DataService } from './shared/services/data.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './homeComp/home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpLoaderModule } from './loader/http-loader/http-loader.module';
import { LoaderService } from './shared/services/loader.service';
import { CustomLoaderComponent } from './loader/custom-loader/custom-loader.component';
import { LoadingInterceptor } from './loading.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
// import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomLoaderComponent,
  ],
  imports: [
    RouterModule,
    AuthModule,
    ToastModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    DialogModule,
    MatDialogModule,
    HttpLoaderModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    // NgxCountriesDropdownModule
  ],
  providers: [DialogService,DataService,MessageService,LoaderService,{provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
