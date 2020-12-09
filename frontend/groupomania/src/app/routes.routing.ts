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

const routes: Routes = [
   // Auth
   { path: 'auth/signup', component: SignupComponent },
   { path: '', component: SignupComponent },
   { path: 'auth/login', component: LoginComponent },
  // Publication
  { path: 'editPublication', component: PublicationEditComponent, },
  { path: 'publication/:id', component: PublicationDetailComponent },
  { path: 'accueil', component: PublicationListComponent },
  // User
  { path: 'm.users', component: UserListComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'm.profile', component: UserProfileComponent },
  // 404
  { path: 'not-found', component: FourOhFourComponent },
  {path: '**', redirectTo: 'not-found' }
];

export const RoutesRoutes = RouterModule.forRoot(routes);
