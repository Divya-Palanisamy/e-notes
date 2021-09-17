import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    
    userAuth = false;
    private authListenerSubs: Subscription;
     

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

    ngOnInit(){
      this.userAuth = this.authService.getIsAuth();
      this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userAuth = isAuthenticated;
      });
    }

    onSignout(){
      this.authService.signout();
      this.toastr.success("Logged out Successfully!");
      this.router.navigateByUrl('/signin');
    }

    ngOnDestroy(){
      this.authListenerSubs.unsubscribe();
    }
}
