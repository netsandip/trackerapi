import { ShipmentService } from './../../services/shipment.service';
import { Component, OnInit, Output,NgModule,  EventEmitter, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MouseEvent, AgmCircle, CircleManager, MapsAPILoader } from '@agm/core';
import { Circle } from '@agm/core/services/google-maps-types';
import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import {devicedetails} from './../../modal/devicedetails';
import { Router } from '@angular/router';
import {shipmentdetail} from './../../modal/shipmentdetail';

@Component ({
    templateUrl: 'completed-shipment.component.html',
    styleUrls: ['completed-shipment.component.css'],
})

export class completedShipmentComponent implements OnInit  {
  public CompletedShipment: Array<shipmentdetail>;
  public tempCompletedShipment: Array<shipmentdetail>;
  public TodayCompletedShipment: Array<shipmentdetail>;
  public searchtxt:any = '';
  public fltertxt: any = '';
  public ShipFromLocation= [];
  public ShipToLocation= [];
      constructor(private shipmentService: ShipmentService, private router: Router) {
        this.CompletedShipment = new Array<shipmentdetail>() ;
          this.TodayCompletedShipment = new Array<shipmentdetail>() ;
      }
    ngOnInit() {
      if (sessionStorage.getItem('userid') == null) {
        this.router.navigate(['/'])
      }
      this.getShiplocationList();
      this.getCompletedShipTemplates();

    }

    getCompletedShipTemplates() {
      const userdetails = {
          'userid': sessionStorage.getItem('userid'),
          'status': 'completed'
        };
      this.shipmentService.getShipmentByStatus(userdetails).subscribe(data => {
             if (data.success) {

 data.data.forEach(element => {
  console.log('element', element );
  this.CompletedShipment.push({shipment_id: element._id, shipment_name:element.shipment_name ,description: element.description,
  shipment_template_id:element.shipment_template_id, templateid:'', deliveryDate:element.deliveryDate,
   linkdeviceIMEIID:element.linkdeviceIMEIID, shipFrom:element.resultingTagsArray[0].shipFrom,
   shipTo:element.resultingTagsArray[0].shipTo, shipDate: element.Created_date })
 });
             this.tempCompletedShipment = this.CompletedShipment;
             this.getTodayCompletedShipTemplates();
             }
         })
  }
   getTodayCompletedShipTemplates() {
     const todaydate= new Date().toString();
    this.TodayCompletedShipment =  this.CompletedShipment.filter(x => x.shipDate == todaydate );
     // console.log("12", this.TodayCompletedShipment);
     }
     getShiplocationList() {
      const userdetails = {
        'userid': sessionStorage.getItem('userid')
      };
    this.shipmentService.getShipmentLocationByUser(userdetails).subscribe(data => {
           if (data.success) {
           data.data.forEach(element => {
             this.ShipFromLocation.push({'shipFrom': element.shipFrom, 'Id': element._id});
             this.ShipToLocation.push({'shipTo': element.shipTo, 'Id': element._id});
           });
           }
       })
    }

     searchshipment() {
      if (this.searchtxt.length >= 3) {
        this.CompletedShipment = this.tempCompletedShipment.filter(x => x.shipment_name.indexOf(this.searchtxt) > -1);
      //  this.TodayCompletedShipment = this.tempPastShipment.filter(x => x.shipment_name.indexOf(this.searchtxt) > -1);
      }
      else{
        this.CompletedShipment = this.tempCompletedShipment;
       // this.TodayCompletedShipment = this.tempPastShipment;
      }

      }
      filtershipment(shiptype) {
        if (this.fltertxt === '0')
        {
          this.CompletedShipment = this.tempCompletedShipment;
         //this.TodayCompletedShipment =  this.tempPastShipment;
        }
        else {
          if (shiptype === 'shipfrom') {
            this.CompletedShipment = this.tempCompletedShipment.filter(x => x.shipFrom.indexOf(this.fltertxt) > -1);
           // this.TodayCompletedShipment = this.tempPastShipment.filter(x => x.shipFrom.indexOf(this.fltertxt) > -1);
            }
            else if (shiptype === 'shipto') {
              this.CompletedShipment = this.tempCompletedShipment.filter(x => x.shipTo.indexOf(this.fltertxt) > -1);
            //  this.TodayCompletedShipment = this.tempPastShipment.filter(x => x.shipTo.indexOf(this.fltertxt) > -1);
              }
         // this.tempUpcomingShipment
        }
        }
}


