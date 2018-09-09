import { ShipmentService } from './../../services/shipment.service';
import { Component, OnInit } from '@angular/core';
import {shipmentdetail} from './../../modal/shipmentdetail';
import {templatedetail} from './../../modal/templatedetail';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component ({
    templateUrl: 'create-shipment.component.html',
    styleUrls: ['create-shipment.component.css'],
})

export class createShipmentComponent implements OnInit  {
    public shipmentdata:shipmentdetail;
    public templatedata:templatedetail;
    public templateList:Array<any>;
    public isTemplateSelected: boolean= true;
    public showcustometemp: boolean= false;
    public showcustometempdiv: boolean= false;
    public templateMsg: string= '';
    public shipmentMsg: string= '';
    templateForm: FormGroup;
    shipmentForm: FormGroup;
    constructor(private shipmentService: ShipmentService, private fb: FormBuilder) {
       this.shipmentdata = new  shipmentdetail();
       this.templatedata = new  templatedetail();
       this.templateForm = fb.group({
        'templateName' :  [null, Validators.required],
        'shipFrom' : [null, Validators.required],
        'shipTo' : [null, Validators.required],
        'description' : '',
        'template_id': ''
      });

      this.shipmentForm = fb.group({
        'shipment_name' :  [null, Validators.required],
        'shipment_template_id' : [null, Validators.required],
        'shipDate' : [null, Validators.required],
        'deliveryDate' :  [null, Validators.required],
        'linkdeviceIMEIID': '',
        'description': '',
        'shipment_id': ''
      });
     }
    ngOnInit() {
      this.getShipTemplates();
    }
    getShipTemplates() {
        const userdetails = {
            'userid': 'sandeep@test.com'
          };
        this.shipmentService.getShipTemplateList(userdetails).subscribe(data => {
               if (data.success) {
                 this.templateList= data.data;
               }
           })
    }
    saveshipment(){
        console.log('shipmentdata',this.shipmentdata);
        this.shipmentService.createShipment(this.shipmentdata).subscribe(data => {
             if (data.success) {
                this.shipmentMsg = 'Record saved successfully';
                this.shipmentdata= new shipmentdetail();
             }
             else{
              this.shipmentMsg ='shipment already exists in the system';
             }
         })
    }
    saveTemplate() {
      this.shipmentService.createShipmentTemplate(this.templatedata).subscribe(data => {
           if (data.success) {
            this.templateMsg = 'Record Saved Successfully';
            this.templatedata= new templatedetail();
           }
           else {
            this.templateMsg = data.errormessage;
           }
       })
  }

    showcustometemplate(){
      this.showcustometemp= !this.showcustometemp;
    }
    GoToTemplatepage(){
      this.showcustometempdiv= !this.showcustometempdiv;
      this.showcustometemp = false;
    }

    cleartempData(){
      this.templatedata= new templatedetail();

    }
    ClearShipment(){
      this.shipmentdata= new shipmentdetail();
    }
}





