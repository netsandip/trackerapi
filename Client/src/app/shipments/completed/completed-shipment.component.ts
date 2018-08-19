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
  public TodayCompletedShipment: Array<shipmentdetail>;
      constructor(private shipmentService: ShipmentService, private router: Router) {
        this.CompletedShipment = new Array<shipmentdetail>() ;
          this.TodayCompletedShipment = new Array<shipmentdetail>() ;
      }
    ngOnInit() {
      if (sessionStorage.getItem('userid') == null) {
        this.router.navigate(['/'])
      }
      this.getCompletedShipTemplates();

    }

    getCompletedShipTemplates() {
      const userdetails = {
          'userid': sessionStorage.getItem('userid'),
          'status': 'completed'
        };
      this.shipmentService.getShipmentByStatus(userdetails).subscribe(data => {
             if (data.success) {
             this.CompletedShipment = data.data;
             this.getTodayCompletedShipTemplates();
             }
         })
  }
   getTodayCompletedShipTemplates() {
     const todaydate= new Date().toString();
    this.TodayCompletedShipment =  this.CompletedShipment.filter(x => x.shipDate == todaydate );
      console.log("12", this.TodayCompletedShipment);
     }
}


