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
  // Publication
  { path: 'editPublication', component: PublicationEditComponent },
  { path: 'publication/:id', component: PublicationDetailComponent },
  { path: 'accueil', component: PublicationListComponent },
  { path: '', component: PublicationListComponent },
  // User
  { path: 'users', component: UserListComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'profile', component: UserProfileComponent },
  // Auth
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },
  // 404
  { path: 'not-found', component: FourOhFourComponent },
  {path: '**', redirectTo: 'not-found' }
];

export const RoutesRoutes = RouterModule.forRoot(routes);
