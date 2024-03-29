import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { PublicationListComponent } from './publication/publication-list/publication-list.component';
import { PublicationEditComponent } from './publication/publication-edit/publication-edit.component';
import { PublicationDetailComponent } from './publication/publication-detail/publication-detail.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UserProfilModifyComponent } from './user/user-profil-modify/user-profil-modify.component';
import { PublicationCommentModifyComponent } from './publication/publication-comment-modify/publication-comment-modify.component';

const routes: Routes = [
  // Auth
  { path: 'auth/signup', component: SignupComponent },
  { path: '', component: LoginComponent },
  { path: 'auth/login', component: LoginComponent },
  // Publication
  { path: 'editPublication', component: PublicationEditComponent, canActivate: [AuthGuard] },
  { path: 'modify-publication/:id', component: PublicationEditComponent, canActivate: [AuthGuard] },
  { path: 'publication/:id', component: PublicationDetailComponent, canActivate: [AuthGuard] },
  { path: 'accueil', component: PublicationListComponent, canActivate: [AuthGuard] },
  // Comment 
  { path: 'modify-comment/:id', component: PublicationCommentModifyComponent, canActivate: [AuthGuard] },
  // User
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'modify-profile/:id', component: UserProfilModifyComponent, canActivate: [AuthGuard] },
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
