import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from '../models/authData';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  authUrl=environment.apiUrl+'user/';
  constructor(private http: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }


  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ', duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  getAuthListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    return this.http.post(this.authUrl+'signup', authData).subscribe(() => {
      this.router.navigate(['/']);
    },error => {
      this.authStatusListener.next(false);
    });
  }

  getUserId() {
    return this.userId;
  }

  logIn(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number, userId: string }>(this.authUrl+'login', authData).subscribe(response => {
      console.log(response);
      this.token = response.token;
      if (this.token) {
        const expiresInDuration = response.expiresIn;
        console.log(expiresInDuration);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(this.token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }

    },error => {
      this.authStatusListener.next(false);
    });
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

}
