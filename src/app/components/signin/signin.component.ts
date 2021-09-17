import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  private authStatusSub: Subscription;
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authstatus => {
        this.isLoading = false;
      }
    )
  }

  onSubmit(f: NgForm){
    if(f.valid){
      this.authService.login(f.value.email, f.value.password);
      this.isLoading = true;
      f.resetForm();
    }else{
      return;
    }
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
