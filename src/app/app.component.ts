import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { Auth } from 'aws-amplify';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loggerUser: any = null;
  public isUserLoggedIn: boolean = false;

  constructor(private authService: AuthService,
    private router: Router) {

    this.router.events
      .subscribe(
        (event: RouterEvent) => {
          if (event instanceof NavigationStart) {
            Auth.currentUserInfo().then((x: any) => {
              this.loggerUser = x;
            });
            Auth.currentAuthenticatedUser().then((x: any) => {
              this.isUserLoggedIn = true;
            }).catch(err => { this.isUserLoggedIn = false; });
          }
        });

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationStart)
    // ).subscribe((event: NavigationStart) => {
    //   Auth.currentUserInfo().then((x: any) => {
    //     this.loggerUser = x;
    //   });
    //   Auth.currentAuthenticatedUser().then((x: any) => {
    //     this.isUserLoggedIn = true;
    //   }).catch(err => { this.isUserLoggedIn = false; });
    // });
  }

  ngOnInit() {
    this.authService.startRefreshTokenTimer();
  }

  signout(event: Event) {
    event.preventDefault();
    this.authService.signOut().then((res: boolean) => {
      if (res) {
        this.loggerUser = null;
        this.router.navigate(['signin']);
      }
    });
  }
}
