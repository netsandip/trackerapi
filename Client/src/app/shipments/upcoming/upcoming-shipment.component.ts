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
     public searchtxt:any = '';
     public fltertxt: any = '';
;      constructor(private shipmentService: ShipmentService,  private global: Globals, private router: Router) {
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
              data.data.forEach(element => {
                console.log('element', element );
              this.UpcomingShipment.push({shipment_id: element._id, shipment_name:element.shipment_name ,description: element.description,
                shipment_template_id:element.shipment_template_id, templateid:'', deliveryDate:element.deliveryDate,
                 linkdeviceIMEIID:element.linkdeviceIMEIID, shipFrom:element.resultingTagsArray[0].shipFrom,
                 shipTo:element.resultingTagsArray[0].shipTo, shipDate: element.Created_date })
               });
             // this.UpcomingShipment = data.data;
             this.tempUpcomingShipment =  this.UpcomingShipment;
              console.log('data', this.UpcomingShipment );
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
          // this.PastShipment = data.data;
          data.data.forEach(element => {
            console.log('element', element );
          this.PastShipment.push({shipment_id: element._id, shipment_name:element.shipment_name ,description: element.description,
            shipment_template_id:element.shipment_template_id, templateid:'', deliveryDate:element.deliveryDate,
             linkdeviceIMEIID:element.linkdeviceIMEIID, shipFrom:element.resultingTagsArray[0].shipFrom,
             shipTo:element.resultingTagsArray[0].shipTo, shipDate: element.Created_date })
           });
           this.tempPastShipment = this.PastShipment;
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
filtershipment(shiptype) {
if (this.fltertxt === '0')
{
  this.UpcomingShipment = this.tempUpcomingShipment;
 this.PastShipment =  this.tempPastShipment;
}
else {
  if (shiptype === 'shipfrom') {
    this.UpcomingShipment = this.tempUpcomingShipment.filter(x => x.shipFrom.indexOf(this.fltertxt) > -1);
    this.PastShipment = this.tempPastShipment.filter(x => x.shipFrom.indexOf(this.fltertxt) > -1);
    }
    else if (shiptype === 'shipto') {
      this.UpcomingShipment = this.tempUpcomingShipment.filter(x => x.shipTo.indexOf(this.fltertxt) > -1);
      this.PastShipment = this.tempPastShipment.filter(x => x.shipTo.indexOf(this.fltertxt) > -1);
      }
 // this.tempUpcomingShipment
}

}
searchshipment() {
if (this.searchtxt.length >= 3) {
  this.UpcomingShipment = this.tempUpcomingShipment.filter(x => x.shipment_name.indexOf(this.searchtxt) > -1);
  this.PastShipment = this.tempPastShipment.filter(x => x.shipment_name.indexOf(this.searchtxt) > -1);
}
else{
  this.UpcomingShipment = this.tempUpcomingShipment;
  this.PastShipment = this.tempPastShipment;
}

}
}


