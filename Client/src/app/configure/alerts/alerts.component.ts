import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ViewEncapsulation } from '@angular/core';
import { ShipmentService } from './../../services/shipment.service';
import { Options } from 'ng5-slider';
import {alertProfile} from './../../modal/alertprofile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
  public assigneeEmailList = [];
  public msgtxt: string;
  tempminvalue: number = 0;
  tempmaxvalue: number = 0;
  humminvalue: number = 0;
  hummaxvalue: number = 0;
  batteryminvalue: number = 0;
  batterymaxvalue: number = 0;
  alertProfileForm: FormGroup;
  slideroptions: Options = {
    floor: 0,
    ceil: 100
  };
  // humvalue: number = 20;
  // humoptions: Options = {
  //   floor: 0,
  //   ceil: 100
  // };
  // batteryvalue: number = 30;
  // batteryoptions: Options = {
  //   floor: 0,
  //   ceil: 100
  // };
  id: any;
    constructor(private shipmentService: ShipmentService, private fb: FormBuilder, private route: ActivatedRoute,
       private location: Location) {
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
     this.getAssigneeEmailList();
     const url = this.route.snapshot.url;
     if (url.length > 1) {
     this.id = url[1].path;
    }
    }
    ShowProfile() {
    this.isProfilePageVisiable = !this.isProfilePageVisiable ;
    this.alertsProfileData = new alertProfile() ;
    }
    getalertListbyUserId() {
      const userdetails = {
        //'userid': sessionStorage.getItem('userid')
          'userid' : 'sandeep@test.com'
      };
      this.shipmentService.getAlertsListByUser(userdetails).subscribe(data => {
        if (data.success) {
          this.alertProfileList = data.data;
          if ( this.id !== '' && this.id !== undefined) {
        this.alertsProfileData = this.alertProfileList.filter(x => x._id.indexOf(this.id) > -1)[0];
        this.humminvalue = this.alertsProfileData.humidity_min;
      this.hummaxvalue = this.alertsProfileData.humidity_max;
      this.tempminvalue = this.alertsProfileData.temperature_min;
      this.tempmaxvalue = this.alertsProfileData.temperature_max;
      this.batteryminvalue = this.alertsProfileData.battery_min;
      this.batterymaxvalue = this.alertsProfileData.battery_max;
            this.isProfilePageVisiable = true;
          }
        }
    } );
    }
    SaveAlertProfile() {
      this.alertsProfileData.temperature_max = this.tempmaxvalue;
      this.alertsProfileData.temperature_min = this.tempminvalue;
      this.alertsProfileData.humidity_max =  this.hummaxvalue;
      this.alertsProfileData.humidity_min = this.humminvalue;
      this.alertsProfileData.battery_max =  this.batterymaxvalue;
      this.alertsProfileData.battery_min = this.batteryminvalue;
      this.alertsProfileData.userid = 'sandeep@test.com';
      console.log("Save/Edit", this.alertsProfileData);
      this.shipmentService.CreateAlertsProfile(this.alertsProfileData).subscribe(data => {
        if (data.success) {
           this.msgtxt = 'Record saved successfully';
           this.alertsProfileData = new alertProfile() ;
        }
    } );
    }
    showalertProfileData(alertid: any) {
      this.getalertsProfileData = this.alertProfileList.filter(x => x._id.indexOf(alertid) > -1)[0];
      this.humminvalue = this.getalertsProfileData.humidity_min;
      this.hummaxvalue = this.getalertsProfileData.humidity_max;
      this.tempminvalue = this.getalertsProfileData.temperature_min;
      this.tempmaxvalue = this.getalertsProfileData.temperature_max;
      this.batteryminvalue = this.getalertsProfileData.battery_min;
      this.batterymaxvalue = this.getalertsProfileData.battery_max;
      console.log('edit1', this.getalertsProfileData);
      this.islistshowing = true;
    }
    closemodal(){
      this.islistshowing = false;
    }
    ShowEditPage(alertId){
      this.alertsProfileData = this.alertProfileList.filter(x => x._id.indexOf(alertId) > -1)[0];
      this.isProfilePageVisiable = true;
      this.islistshowing = false;
    }
    DeleteAlertProfile(alert_id){
      const alertdata = {
        '_id' : alert_id,
        'deviceid': sessionStorage.getItem('deviceid')
      };
      console.log(alertdata);
      this.shipmentService.deletealertProfile(alertdata).subscribe(data => {
        if (data.success) {
        //  console.log("data", data)
        this.msgtxt = 'Record deleted Successfully';
       // this.location.path();
       this.ngOnInit();
        }
    });
    }
    getAssigneeEmailList() {
    const userdetails = {
        'Organization_name' : 'Test'
      };
      this.shipmentService.getAssigneeEmailList(userdetails).subscribe(data => {
        if (data.success) {
          this.assigneeEmailList = data.data;
        }
    } );
    }
}
