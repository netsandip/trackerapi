import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ViewEncapsulation } from '@angular/core';
import { ShipmentService } from './../../services/shipment.service';
import { Options } from 'ng5-slider';
import {alertProfile} from './../../modal/alertprofile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const now = new Date();

@Component ({
    templateUrl: 'alerts.html',
    styleUrls: ['alert.css'],
})

export class AlertsComponent implements OnInit {
  public islistshowing: boolean= false;
  public isProfilePageVisiable: boolean = false;
  public modifiedDate: Date = new Date();
  public alertsProfileData: alertProfile;
  public getalertsProfileData: alertProfile;
  public alertProfileList: Array<alertProfile>;
  public msgtxt: string;
  tempvalue: number = 10;
  alertProfileForm: FormGroup;
  tempoptions: Options = {
    floor: 0,
    ceil: 100
  };
  humvalue: number = 20;
  humoptions: Options = {
    floor: 0,
    ceil: 100
  };
  batteryvalue: number = 30;
  batteryoptions: Options = {
    floor: 0,
    ceil: 100
  };
    constructor(private shipmentService: ShipmentService, private fb: FormBuilder) {
      this.alertProfileList =  new Array<alertProfile>() ;
      this.alertsProfileData = new alertProfile() ;
      this.getalertsProfileData = new alertProfile();
      this.alertProfileForm = fb.group({
        'alerts_master_name' :  [null, Validators.required],
        'description' : '',
        'shipment_departs_origin': false,
        'shipment_arrives_destination': false,
        'shipment_late_delivery': '',
        'shipment_stops': '',
        'temperature': '',
        'humidity': '',
        'shock_events' : false,
        'battery' : '',
        'assignee_email': '',
        'external_users': '',
        'userid': '',
      });
     }
    ngOnInit() {
       this.getalertListbyUserId();
    }
    ShowProfile() {
    this.isProfilePageVisiable = !this.isProfilePageVisiable ;
    }
    getalertListbyUserId() {
      const userdetails = {
        //'userid': sessionStorage.getItem('userid')
          'userid' : 'sandeep@test.com'
      };
      this.shipmentService.getAlertsListByUser(userdetails).subscribe(data => {
        if (data.success) {
          this.alertProfileList = data.data;
          console.log("11",this.alertProfileList );
        }
    } );
    }
    SaveAlertProfile() {
      this.alertsProfileData.temperature_max = this.tempvalue;
      this.alertsProfileData.humidity_max = this.humvalue;
      this.alertsProfileData.battery_max = this.batteryvalue;
     // console.log("alertsProfileData", this.alertsProfileData);
      this.shipmentService.CreateAlertsProfile(this.alertsProfileData).subscribe(data => {
        if (data.success) {
           this.msgtxt = 'Record saved successfully';
           this.alertsProfileData = new alertProfile() ;
        }
    } );
    }
    showalertProfileData(alertid: any) {
      this.getalertsProfileData = this.alertProfileList.filter(x => x._id.indexOf(alertid) > -1)[0];
      console.log( this.getalertsProfileData);
      this.islistshowing = true;
    }
    closemodal(){
      this.islistshowing = false;
    }
}
