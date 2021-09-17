import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authStatusSub : Subscription;
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
      this.authService.createUser(f.value.email, f.value.password);
      this.isLoading = true;
      f.resetForm();
    }
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
