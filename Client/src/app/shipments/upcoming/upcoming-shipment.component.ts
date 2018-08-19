import { ShipmentService } from './../../services/shipment.service';
import { Component, OnInit, Output,NgModule,  EventEmitter, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MouseEvent, AgmCircle, CircleManager, MapsAPILoader } from '@agm/core';
import { Circle } from '@agm/core/services/google-maps-types';
import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import {shipmentdetail} from './../../modal/shipmentdetail';
import { Globals } from './../../services/global';
import { Router } from '@angular/router';

@Component ({
    templateUrl: 'upcoming-shipment.component.html',
    styleUrls: ['upcoming-shipment.component.css'],
})

export class upcomingShipmentComponent implements OnInit {
     public UpcomingShipment: Array<shipmentdetail>;
     public PastShipment: Array<shipmentdetail>;
     public tempUpcomingShipment: Array<shipmentdetail>;
     public tempPastShipment: Array<shipmentdetail>;
     public ShipFromLocation= [];
     public ShipToLocation= [];
      constructor(private shipmentService: ShipmentService,  private global: Globals, private router: Router) {
          this.UpcomingShipment = new Array<shipmentdetail>() ;
          this.PastShipment = new Array<shipmentdetail>() ;
       }

    ngOnInit() {
      // if(sessionStorage.getItem('userid') == null) {
      //   this.router.navigate(['/'])
      // }

      this.getUpcomingShipTemplates();
      this.getPastShipTemplates();
      this.getShiplocationList();
    }
    getUpcomingShipTemplates() {

      this.global.username= sessionStorage.getItem('userid');
      const userdetails = {
          'userid': sessionStorage.getItem('userid'),
          'status': 'upcoming'
        };
      this.shipmentService.getShipmentByStatus(userdetails).subscribe(data => {
             if (data.success) {
             this.UpcomingShipment = data.data;
             this.tempUpcomingShipment= data.data;
            // this.UpcomingShipment.shipFrom = data.data.resultingTagsArray;
            // console.log("data", this.UpcomingShipment );
             }
         } )
  }
  getPastShipTemplates() {
    const userdetails = {
        'userid': sessionStorage.getItem('userid'),
        'status': 'completed'
      };
    this.shipmentService.getShipmentByStatus(userdetails).subscribe(data => {
           if (data.success) {
           this.PastShipment = data.data;
           this.tempPastShipment = data.data;
           }
       })
}
getShiplocationList(){
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
filtershipment(data, shiptype) {
//alert(shiptype);
if (data === '0')
{
  this.UpcomingShipment = this.tempUpcomingShipment;
 this.PastShipment =  this.tempPastShipment;
}
else {
  if (shiptype === 'shipfrom') {
    console.log("11", this.UpcomingShipment);
   // this.UpcomingShipment = this.UpcomingShipment.filter(x => x.shipFrom.indexOf(data) > -1);
    }
 // this.tempUpcomingShipment
}

}
}


