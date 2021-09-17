import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from './components/display/display.component';
import { ErrorComponent } from './components/error/error.component';
import { FormComponent } from './components/form/form.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DisplayComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: FormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:noteId',
    component: FormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '**',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
