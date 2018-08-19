import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { MapsRoutes } from './maps.routing';
import { NguiMapModule} from '@ngui/map';

// Tables Component
import { VectorMapComponent } from './vector-map/vector-map.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { AgmCoreModule, CircleManager, GoogleMapsAPIWrapper } from '@agm/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TrackerService } from '../services/tracker.service';
import { ShipmentService } from '../services/shipment.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
// import { SparkLineComponent } from './../sparkline/sparkline.component';
// import { Nvd3Component } from './nvd3/nvd3.component';

@NgModule({
    imports: [
        RouterModule.forChild(MapsRoutes),
        CommonModule,
        HttpClientModule,
        HttpModule,
        ChartsModule,
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDVYVh0MbUHUApDX7kq61WqvSPcDkMaDWk',
            libraries: ['places'],
          }),
    ],
    declarations: [
        VectorMapComponent,
        GoogleMapComponent
    ],
    providers: [
        ThemeConstants, CircleManager, GoogleMapsAPIWrapper, TrackerService,ShipmentService
    ]
})
export class MapsModule { }
