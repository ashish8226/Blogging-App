import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

  }

  ngOnDestroy(): void {
  }

  onLogOut() {
    this.authService.logOut();
  }
}
