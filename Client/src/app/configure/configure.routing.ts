import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Tables Components
import { AlertsComponent } from './alerts/alerts.component';
import { ShipmentTemplateComponent } from './shipmentTemplate/shipmentTemplate.component';
import { FormWizard_Component } from './form-wizard/form-wizard.component';

export const ConfigureRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'alert-elements',
                component: AlertsComponent,
                data: {
                    title: 'Form Elements'
                }
            },
            {
            path: 'alert-elements/:id',
            component: AlertsComponent,
            data: {
              title: 'test Elements'
          } },
            {
                path: 'shipment-template',
                component: ShipmentTemplateComponent,
                data: {
                    title: 'Form Layouts'
                }
            },
            {
                path: 'form-wizard',
                component: FormWizard_Component,
                data: {
                    title: 'Form Wizard'
                }
            }
        ]
    }
];

