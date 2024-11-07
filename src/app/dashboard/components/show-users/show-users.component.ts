import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/shared/environments/environment';
import { apiResponseService } from 'src/app/shared/services/apiResponse.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss'],
})
export class ShowUsersComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private dialogService: DialogService,
    private dataService: DataService,
    private router: Router,
    private apiResponseService: apiResponseService,
    private cookieService: CookieService,
  ) {}
  private apiUrl: string = `${environment.url}/allUsers`;
  private countUrl: string = `${environment.url}/userCount`;
  private deleteUrl: string = `${environment.url}/deleteUser`;
  users!: any;
  viewUsers!: any;
  rows: number = 5;
  first: number = 0;
  start: number = 0;
  totalRecords!: number;

  imageUrl!: string;

  sortField!: string;
  sortOrder!: string;
  btnStyleid = 'btn-default';
  btnStyle2id = 'btn-default';
  btnStylename = 'btn-default';
  btnStyle2name = 'btn-default';
  btnStylereg_date = 'btn-default';
  btnStyle2reg_date = 'btn-default';

  ngOnInit(): void {
    const count = this.http.get(this.countUrl);
    count.subscribe((response: any) => {
      this.totalRecords = response.result;
    });

    const res = this.http.get(this.apiUrl);
    res.subscribe((response: any) => {
      if (response.status === 200) {
        this.users = response.result;
        this.users.forEach((element: any) => {
          if (element.image === null)
            element.image =
              'https://atg-prod-scalar.s3.amazonaws.com/studentpower/media/user%20avatar.png';
          else {
            const imgUrl = this.getUrl(element.image.data);
            element.image = imgUrl;
          }
        });
        this.viewUsers = this.users.slice(this.start, this.rows);
      }
    });
  }

  sortDataAsc(field: string) {
    (this as any)['btnStyle' + field] = 'btn-change';
    (this as any)['btnStyle2' + field] = 'btn-default';

    this.sortField = field;
    this.sortOrder = 'asc';

    this.viewUsers.sort((a: any, b: any) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      return aValue > bValue ? 1 : -1;
    });
  }

  sortDataDesc(field: string) {
    (this as any)['btnStyle' + field] = 'btn-default';
    (this as any)['btnStyle2' + field] = 'btn-change';

    this.sortField = field;
    this.sortOrder = 'desc';

    this.viewUsers.sort((a: any, b: any) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      return bValue > aValue ? 1 : -1;
    });
  }

  selectedDate!: Date;
  onDateChange(date: any) {
    const dt: Date = date.value;
    dt.setHours(dt.getHours() + 5);
    dt.setMinutes(dt.getMinutes() + 30);
    const timeStamp = dt.toISOString().split('T')[0];

    this.viewUsers = this.users.filter((element: any) => {
      const dbDate = element.reg_date.split('T')[0];
      return dbDate === timeStamp;
    });
  }

  getUrl(data: any) {
    const arrayBufferView = new Uint8Array(data);
    const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  }

  editUserPopup(ref_token: string) {
    this.dataService.setUserToken(ref_token);
    this.dialogService.openEditUserDialog();
  }

  onPageChange(event: any) {
    this.rows = event.rows;
    this.first = event.first;
    this.start = event.rows * event.page;
    this.viewUsers = this.users.slice(this.start, this.rows + this.start);
  }

  deleteUser(ref_token: string) {
    const headers = new HttpHeaders().set('ref_token', ref_token);

    const res = this.http.delete(this.deleteUrl, { headers });
    res.subscribe((response: any) => {
      if (response.status === 200) {
        if (response.result === 'Success') {
          this.apiResponseService.handleApiResponse(
            { message: 'User Deleted Successfully' },
            true
          );
          setTimeout(() => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/dashboard/users']);
              });
          }, 500);
        }
      } else {
        this.apiResponseService.handleApiResponse(
          { message: 'Problem Deleting User' },
          false
        );
      }
    });
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
  dashboard(){
    this.router.navigate(['/dashboard'])
  }
}
