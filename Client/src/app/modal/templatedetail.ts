import { Injectable } from '@angular/core';

export class templatedetail {
  template_id: string;
  templateName:string;
  description: string;
  shipFrom: string;
  shipTo: string;
  autocomplete: boolean;
  alertProfile: string;

////-----------Not require this------

  shipment_id: string;
  shipment_name:string;
  // description: string;
  shipDate: string;
  shipment_template_id: string;
  templateid:string;
  deliveryDate:number;
  linkdeviceIMEIID:string;
}
