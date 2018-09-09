import { TrackerService } from './../../services/tracker.service';
import { Component, OnInit, Output,NgModule,  EventEmitter, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
// import { MouseEvent, AgmCircle, CircleManager, MapsAPILoader } from '@agm/core';
// import { Circle } from '@agm/core/services/google-maps-types';
// import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';

import {userProfile} from './../../modal/userprofile';
@Component ({
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.css'],
})

export class overviewComponent implements OnInit  {
  public userProfileData: userProfile;
    constructor(private trackerService: TrackerService) {
      this.userProfileData = new userProfile();
     }
    ngOnInit() {
      this.getuserdatabyUserId();
    }
    getuserdatabyUserId() {
      const userdetails = {
        //'userid': 'sandeep@test.com'
        'userid': sessionStorage.getItem('userid')
      };
      this.trackerService.getprofiledataByUser(userdetails).subscribe(data => {
        if (data.success) {
           console.log(data.data);
           this.userProfileData = data.data;
        }
    } );
    }
    UpdateProfile(){
      this.trackerService.updateprofileByUser( this.userProfileData).subscribe(data => {
        if (data.success) {
           console.log("UpdateProfile", data);
        }
    } );
    }
}


