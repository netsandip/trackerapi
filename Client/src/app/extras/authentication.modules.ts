import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AuthenticationRoutes } from './authentication.routing';
import { HttpModule } from '@angular/http';
//Authentication Component
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignIn2Component } from './sign-in2/sign-in2.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { Page500Component } from './500/500.component';
import { Page404Component } from './404/404.component';
import { AgmCoreModule} from '@agm/core';

@NgModule({
    imports: [
        RouterModule.forChild(AuthenticationRoutes),
        FormsModule,
        HttpModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCpVhQiwAllg1RAFaxMWSpQruuGARy0Y1k',
            libraries: ['places'],
          }),
    ],
    declarations: [
        SignInComponent,
        SignIn2Component,
        SignUpComponent,
        Page500Component,
        Page404Component
    ],
    providers: [
        AuthService
    ]
})
export class AuthenticationModule { }