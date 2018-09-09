import { Injectable } from '@angular/core';
import {templatedetail} from './templatedetail';
export class shipmentdetail {
  shipment_id: string;
  shipment_name:string;
  description: string;
  shipDate: string;
  shipment_template_id: string;
  templateid:string;
  deliveryDate:number;
  linkdeviceIMEIID:string;


  // template_id: string;
  // templateName:string;
   shipFrom: string;
   shipTo: string;
}
// export class templatedetail {
//   template_id: string;
//   templateName:string;
//   description: string;
//   shipFrom: string;
//   shipTo: string;
//   autocomplete: boolean;
//   alertProfile: string;
// }
