import { Component, NgModule ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { TrackerService } from './../../services/tracker.service';
import { Globals } from './../../services/global';
@Component ({
    templateUrl: 'sign-in.html',
    providers:[TrackerService]
})

export class SignInComponent implements OnInit  {
    constructor(protected router: Router, private trackerService: TrackerService, private authService: AuthService,
      private global: Globals) { }
    public userid:string = "";
    public password:string = "";
    public errormsg:string = "";
    ngOnInit() {

    }
    userLogin() {
        const userdetails = {
            'userid': this.userid,
            'password': this.password
          };
        this.authService.validateUser(userdetails).subscribe(data => {
          sessionStorage.setItem('userid', this.userid);
            this.errormsg = "";
            if (data.success) {
                this.authService.storeUsersData(data.data._id, data.data.userid)
                window.location.href = '/#/maps/google-map';
            }
            else {
            this.errormsg = "Username/password are not correct";
            }
        })
        //
    }
}
