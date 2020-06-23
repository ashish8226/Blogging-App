import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit ,OnDestroy{
  isLoading: boolean = false;
  private authStatusSubs:Subscription;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
   this.authStatusSubs= this.authService.getAuthListener().subscribe(authStatus=>{
     this.isLoading=false;
   });

  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);


  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }
}
