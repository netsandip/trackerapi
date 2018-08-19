import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Maps Components
import { createShipmentComponent } from './create-shipments/create-shipment.component';
import { completedShipmentComponent } from './completed/completed-shipment.component';
import {upcomingShipmentComponent} from './upcoming/upcoming-shipment.component';
import {activeShipmentComponent} from './active/active-shipment.component';

export const ShipmentsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'create-shipment',
                component: createShipmentComponent,
                data: {
                    title: 'create-shipment'
                }
            },
            {
                path: 'completed',
                component: completedShipmentComponent,
                data: {
                    title: 'completed'
                }
            },
            {
                path: 'upcoming',
                component: upcomingShipmentComponent,
                data: {
                    title: 'upcoming'
                }
            },
            {
                path: 'active',
                component: activeShipmentComponent,
                data: {
                    title: 'active'
                }
            },
        ]
    }
];

