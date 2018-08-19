import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { ConfigureRoutes } from './configure.routing';
import { NgSelectizeModule } from 'ng-selectize';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { FormWizardModule } from 'angular2-wizard';

//Forms Component
import { ShipmentService } from '../services/shipment.service';
import { AlertsComponent } from './alerts/alerts.component';
import { ShipmentTemplateComponent } from './shipmentTemplate/shipmentTemplate.component';
import { FormWizard_Component } from './form-wizard/form-wizard.component';

import { Ng5SliderModule } from 'ng5-slider';
@NgModule({
    imports: [
        RouterModule.forChild(ConfigureRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NgSelectizeModule,
        NgbModule,
        CustomFormsModule,
        FormWizardModule,
        Ng5SliderModule,
    ],
    declarations: [
      AlertsComponent,
      ShipmentTemplateComponent,
        FormWizard_Component
    ],
    providers: [
      ShipmentService
  ]
})
export class Configure_Module { }
