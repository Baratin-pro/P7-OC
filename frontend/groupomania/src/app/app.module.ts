import { NgModule } from '@angular/core';
// Route
import { RoutesRoutes } from './routes.routing';
// Component
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { PublicationListComponent } from './publication/publication-list/publication-list.component';
import { PublicationEditComponent } from './publication/publication-edit/publication-edit.component';
import { PublicationDetailComponent } from './publication/publication-detail/publication-detail.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { FooterComponent } from './baliseDom/footer/footer.component';
import { NavComponent } from './baliseDom/nav/nav.component';
import { HeaderComponent } from './baliseDom/header/header.component';
// Service
// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
// Form
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// HtppClient
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
      SignupComponent,
      LoginComponent,
      HeaderComponent,
      FooterComponent,
      NavComponent,
      FourOhFourComponent,
      PublicationDetailComponent,
      PublicationEditComponent,
      PublicationListComponent,
      UserDetailComponent,
      UserListComponent,
      UserProfileComponent
   ],
  imports: [
    BrowserModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RoutesRoutes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
