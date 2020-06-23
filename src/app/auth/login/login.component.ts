import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  isLoading: boolean = false;
  private authStatusSubs:Subscription;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authStatusSubs= this.authService.getAuthListener().subscribe(authStatus=>{
      this.isLoading=false;
    });

  }


  onLogIn(form: NgForm) {
    if(!form.valid){
      return;
    }
    this.isLoading=true;
    this.authService.logIn(form.value.email,form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }
}
