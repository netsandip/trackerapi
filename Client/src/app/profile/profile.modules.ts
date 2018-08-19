import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';
import { ProfileRoutes } from './profile.routing';
import { NguiMapModule} from '@ngui/map';

// Tables Component
import { overviewComponent } from './overview/overview.component';
import { settingComponent } from './setting/setting.component';

import { AgmCoreModule, CircleManager, GoogleMapsAPIWrapper } from '@agm/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TrackerService } from '../services/tracker.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        RouterModule.forChild(ProfileRoutes),
        CommonModule,
        HttpClientModule,
        HttpModule,
        ChartsModule,
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCpVhQiwAllg1RAFaxMWSpQruuGARy0Y1k',
            libraries: ['places'],
          }),
    ],
    declarations: [       
        overviewComponent,
        settingComponent,       
    ],
    providers: [
        ThemeConstants, CircleManager, GoogleMapsAPIWrapper, TrackerService
    ]
})
export class ProfileModule { }
