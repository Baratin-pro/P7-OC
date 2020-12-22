import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { PublicationListComponent } from './publication/publication-list/publication-list.component';
import { PublicationEditComponent } from './publication/publication-edit/publication-edit.component';
import { PublicationDetailComponent } from './publication/publication-detail/publication-detail.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Auth
  { path: 'auth/signup', component: SignupComponent },
  { path: '', component: LoginComponent },
  { path: 'auth/login', component: LoginComponent },
  // Publication
  { path: 'editPublication', component: PublicationEditComponent, canActivate: [AuthGuard] },
  { path: 'publication/:id', component: PublicationDetailComponent, canActivate: [AuthGuard] },
  { path: 'accueil', component: PublicationListComponent, canActivate: [AuthGuard] },
  // User
  { path: 'm.users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: 'm.profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  // 404
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];

NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export const RoutesRoutes = RouterModule.forRoot(routes);
