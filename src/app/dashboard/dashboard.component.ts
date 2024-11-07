import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../shared/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}
  userCount!: number;
  adminRoutes: boolean = false;
  private apiUrl: string = `${environment.url}/userCount`;
  private authUrl: string = `${environment.url}/checkRole`;


  ngOnInit(): void {
    const ref_token = this.cookieService.get('ref_token');
    const headers = new HttpHeaders().set('ref_token', ref_token);
    const ans = this.http.get(this.authUrl, { headers });
    ans.subscribe((response: any) => {
      if (response.status === 200) {
        if (response.result === true) this.adminRoutes = true;
      }
    });
    const res = this.http.get(this.apiUrl);
    res.subscribe((response: any) => {
      console.log(response);
      
      if (response.status === 200) {
        this.userCount = response.result;
      }
    });
  }

  getUsers() {
    this.router.navigate(['/dashboard/users']);
  }

  profile() {
    this.router.navigate(['/dashboard/profile']);
  }

  logout() {
    try {
      this.cookieService.delete('access_token');
      this.cookieService.delete('ref_token');
      this.cookieService.delete('role');

      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

}
