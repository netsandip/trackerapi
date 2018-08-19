import { ShipmentService } from './../../services/shipment.service';
import { Component, OnInit, Output,NgModule,  EventEmitter, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MouseEvent, AgmCircle, CircleManager, MapsAPILoader } from '@agm/core';
import { Circle } from '@agm/core/services/google-maps-types';
import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import {shipmentdetail} from './../../modal/shipmentdetail';
import { Router } from '@angular/router';

@Component ({
    templateUrl: 'active-shipment.component.html',
    styleUrls: ['active-shipment.component.css'],
})

export class activeShipmentComponent implements OnInit  {
    public zoom: number = 10;
    // initial center position for the map
    latitude: number = 5.3213582;
    longitude: number = 100.2919352;
    public maxSpeed: number;
    markers: Marker[] = [];
    public showcreatepage:boolean= false;
    public ActiveShipment: Array<shipmentdetail>;
      constructor(private shipmentService: ShipmentService, private router: Router) {

      }

    ngOnInit() {
      if(sessionStorage.getItem('userid') == null) {
        this.router.navigate(['/'])
      }
      this.getActiveShipTemplates();
    }
    getActiveShipTemplates() {
       const userdetails = {
          'userid': sessionStorage.getItem('userid'),
          'status': 'active'
        };
      this.shipmentService.getShipmentByStatus(userdetails).subscribe(data => {
           console.log("data", data)
             if (data.success) {
             this.ActiveShipment = data.data;
             }
         })
  }
}

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}
