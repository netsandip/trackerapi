import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { ShipmentsRoutes } from './shipments.routing';
import { NguiMapModule} from '@ngui/map';

// Tables Component
import { createShipmentComponent } from './create-shipments/create-shipment.component';
import { completedShipmentComponent } from './completed/completed-shipment.component';
import {upcomingShipmentComponent} from './upcoming/upcoming-shipment.component';
import {activeShipmentComponent} from './active/active-shipment.component';
import { AgmCoreModule, CircleManager, GoogleMapsAPIWrapper } from '@agm/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TrackerService } from '../services/tracker.service';
import { ShipmentService } from '../services/shipment.service';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        RouterModule.forChild(ShipmentsRoutes),
        CommonModule,
        HttpClientModule,
        HttpModule,
        ChartsModule,
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDVYVh0MbUHUApDX7kq61WqvSPcDkMaDWk',
            libraries: ['places'],
          }),
    ],
    declarations: [
        createShipmentComponent,
        completedShipmentComponent,
        upcomingShipmentComponent,
        activeShipmentComponent
    ],
    providers: [
        ThemeConstants, CircleManager, GoogleMapsAPIWrapper, TrackerService,ShipmentService
    ]
})
export class ShipmentsModule { }
