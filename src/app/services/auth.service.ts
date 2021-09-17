import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { User } from '../models/user';

import { environment } from 'src/environments/environment';;

const BACKEND_URL = `${environment.apiUrl}/user`

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuth = false;
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuth;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const user: User = {
      email: email,
      password: password
    }
    return this.http.post(`${BACKEND_URL}/signup`, user)
    .subscribe(() => {
      this.toastr.success("Account created!");
      this.router.navigateByUrl('/signin');
    }, error => {
      this.toastr.error(error.error.message);
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string){
    const user: User = {
      email: email,
      password: password
    }
    this.http.post<{token: string, expiresIn: number, userId: string}>(`${BACKEND_URL}/signin`, user)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTime(expiresInDuration);
        this.isAuth = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const nowDate = new Date();
        const expirationTime = new Date(nowDate.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationTime, this.userId);
        this.toastr.success("LoggedIn successfully");
        this.router.navigateByUrl('/');
      }
    }, error => {
      if(error.error.message === undefined){
        return this.toastr.error("Something went wrong");
      }
      this.toastr.error(error.error.message);
      this.authStatusListener.next(false);
    });
  }

  autoAuth(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return this.router.navigateByUrl('/signin');  
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuth = true;
      this.userId = authInfo.userId;
      this.setAuthTime(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  signout(){
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
  }

  private setAuthTime(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.signout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(token && expiry && userId){
      return{
      token: token,
      expirationDate: new Date(expiry),
      userId: userId
    }
    }else{
      return;
    }
}

}
