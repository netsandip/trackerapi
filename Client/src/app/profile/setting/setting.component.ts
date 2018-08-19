import { TrackerService } from './../../services/tracker.service';
import { Component, OnInit, Output,NgModule,  EventEmitter, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MouseEvent, AgmCircle, CircleManager, MapsAPILoader } from '@agm/core';
import { Circle } from '@agm/core/services/google-maps-types';
import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import {devicedetails} from './../../modal/devicedetails'

@Component ({
    templateUrl: 'setting.component.html',
    styleUrls: ['setting.component.css'],
})

export class settingComponent implements OnInit  {  
      constructor(private trackerService: TrackerService){ 

       }
       
    ngOnInit() {    
    }
}


