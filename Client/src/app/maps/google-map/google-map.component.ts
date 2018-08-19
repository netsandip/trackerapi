import { TrackerService } from './../../services/tracker.service';
import { Location } from './../entity/Location';
import { Component, OnInit, Output,NgModule,  EventEmitter, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MouseEvent, AgmCircle, CircleManager, MapsAPILoader } from '@agm/core';
import { Circle } from '@agm/core/services/google-maps-types';
import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import {devicedetails} from './../../modal/devicedetails'
import Chart from 'chart.js';
import { ThemeConstants } from '../../shared/config/theme-constant';
import { Router } from '@angular/router';
import { ShipmentService } from './../../services/shipment.service';
import {alertProfile} from './../../modal/alertprofile';

@Component ({
    templateUrl: 'google-map.html',
    styleUrls: ['google-map.component.css'],
})

export class GoogleMapComponent implements OnInit  {

    public zoom: number = 14;
    // initial center position for the map
    latitude: number = 5.3213582;
    longitude: number = 100.2919352;
    public maxSpeed: number;
    public polyline: Array<any>;
    public devicelist: Array<any>;
    public tempdevicelist: Array<any>;
    markers: Marker[] = [];
    public searchtxt:string='';
    public datatext: string ='';
    public selecteddeviceid:any= '';
    public selecteddevicedetails= new devicedetails;
    public showgraph : boolean = false;
    public items = [1,2,3,4,5,6,7,8,9,10,11, 12];
    public datarangelist = [{ id:1, text:"Last 24 hours"}, {id:2, text:"Last 48 hours" },{id:3, text:"Last 72 hours" },
    { id:4, text:"Last 7 days"},{ id:5,text:"Last 14 days"},{ id:6, text:"Last 30 days"  },{ id:7, text:"Last 60 days" },
    {   id:8,text:"Last 90 days" }];

    public alertProfileList: Array<alertProfile>;
    public getalertsProfileData: alertProfile;
   // Last sensor data
public LAcceleration:string="";
public LLight:string="";
public LOrientation:string="";
public LPressure:string="";
public LTemperature:string="";
public Lhumidity:string="";
public LmotionActivity:string="";
public LXYZ_Acceleration:string="";

     // Line Chart Config
     public sensorListData : Array<any>;
     public lineChartLabels:Array<any> = [];
     public tempdataL:Array<any> = [];
     public tempdataT:Array<any> = [];
     public tempdataH:Array<any> = [];
     public tempdataP:Array<any> = [];
     public tempdataMA:Array<any> = [];
     public tempdataA:Array<any> = [];
     public tempdataXYZA:Array<any> = [];
     public lineChartDataForLight=[{data: [], label: 'Series A'}];
     public lineChartDataForTemp=[{data: [], label: 'Series A'}];
     public lineChartDataForHumidity=[{data: [], label: 'Series A'}];
     public lineChartDataForPressure=[{data: [], label: 'Series A'}];
     public lineChartDataFormotionActivity=[{data: [], label: 'Series A'}];
     public lineChartDataForAcceleration=[{data: [], label: 'Series A'}];
     public lineChartDataForXYZAcceleration=[{data: [], label: 'Series A'}];
     public lineChartData:Array<any> = [{data: [], label: 'Series A'}];
     public lineChartOptions:any = {
         scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
          }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
          }
          }],
        },
        maintainAspectRatio: true
     } ;
     public lineChartOptionsanother:any = {
      scales: {
          yAxes: [
              {
                  id: 'y-axis-1',
                  type: 'linear',
                  display: true,
                  position: 'left',
                  gridLines: {
                    display: false
                }
              },
              {
                  id: 'y-axis-2',
                  type: 'linear',
                  display: false,
                  gridLines: {
                    display: false
                }
              },
            ],
          xAxes: [{
            gridLines: {
                display: false
            }
        }],
      },
      maintainAspectRatio: false
  };
     public lineChartLegend: boolean = false;
     public lineChartType: string = 'line';
     public lineChartColors:Array<any> = [
        //  {
        //      backgroundColor: this.themeColors.infoInverse,
        //      borderColor: this.themeColors.info
        //  },
        //  {
        //      backgroundColor: this.themeColors.successInverse,
        //      borderColor: this.themeColors.success
        //  }
     ];


    public showdevicedetails: boolean = false;
    public set searchedLocation(searchedLocation: Location) {
        this.latitude = searchedLocation.latitude;
        this.longitude = searchedLocation.longitude;
        this.zoom = 15;
      }

      constructor(private trackerService: TrackerService, private colorConfig:ThemeConstants, private router: Router,
         private shipmentService: ShipmentService) {
          this.alertProfileList =  new Array<alertProfile>() ;
          this.getalertsProfileData = new alertProfile();

       }

    ngOnInit() {
      // if(sessionStorage.getItem('userid') == null) {
      //   this.router.navigate(['/'])
      // }

        this.getAlldevice();
        this.getsensordetails(861107036374529, 'Last 24 hours');
        this.getalertListbyUserId();
        this.maxSpeed = 40;
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
            this.searchedLocation = new Location(
                position.coords.latitude, position.coords.longitude,
            );
            });
        }
    }
    public showSensorGraph(datatext: any){
      this.datatext= datatext;
     //this.showgraph= !this.showgraph;
    }

     public getsensordetails(deviceid: number, daterange: any) {
     const devicedetail = {
        "deviceid": deviceid,
        "dateRange":daterange
        }
        // console.log("devicedetail",devicedetail)
       this.tempdataL = [];
       this.tempdataT = [];
       this.tempdataH = [];
       this.tempdataP = [];
       this.tempdataMA = [];
        this.tempdataA = [];
        this.tempdataXYZA = [];
        this.lineChartLabels= [];
      this.trackerService.getSensorDataByDeviceId(devicedetail).subscribe(data => {
        if (data.success) {
           console.log("sensordata", data.data);
          this.sensorListData = data.data;
          for (let i = 0; i < this.sensorListData.length; i++ ) {
             this.tempdataL.push(this.sensorListData[i].avgLight);
            this.tempdataT.push(this.sensorListData[i].avgTemperature);
             this.tempdataH.push(this.sensorListData[i].avgHumidity);
             this.tempdataP.push(this.sensorListData[i].avgPressure);
             this.tempdataMA.push(this.sensorListData[i].avgmotionActivity);
             this.tempdataA.push(this.sensorListData[i].avgmAcceleration);
             this.tempdataXYZA.push(this.sensorListData[i].avgXYZ_Acceleration);
             this.lineChartLabels.push(this.sensorListData[i]._id);
        }
           this.lineChartDataForLight= [{data: this.tempdataL, label: 'Series A'}];
          this.lineChartDataForTemp = [{data: this.tempdataT, label: 'Series A'}];
          this.lineChartDataForHumidity=[{data:this.tempdataH, label: 'Series A'}];
          this.lineChartDataForPressure=[{data:this.tempdataP, label: 'Series A'}];
          this.lineChartDataFormotionActivity=[{data: this.tempdataMA, label: 'Series A'}];
          this.lineChartDataForAcceleration=[{data: this.tempdataA, label: 'Series A'}];
          this.lineChartDataForXYZAcceleration=[{data: this.tempdataXYZA, label: 'Series A'}];

          // console.log("data3", this.sensorListData[i].Light);
        }
      })
     }

///---------------graph end--------------

    public goback(){
        this.showdevicedetails= false;
    }
    public searchdevice() {
      if(this.searchtxt.length > 1) {
        this.devicelist = this.devicelist.filter(
          x => x.address.indexOf(this.searchtxt) > -1);
      }
      else
      {
        this.devicelist = this.tempdevicelist
      }
  }
   public getAlldevice(){
    const userdetails = {
        'userid': localStorage.getItem('userid')
      };
    this.trackerService.getAlldevices(userdetails).subscribe(data => {
        if (data.success) {
         this.devicelist =data.data;
         this.devicelist.forEach(element => {
            const latLng = {
                lat: element.location[1],
                lng: element.location[0]
              };
              const geoCoder = new google.maps.Geocoder();
              geoCoder.geocode({ "location": latLng }, (results, status) => {
                    element.address=results[1].formatted_address;
              });
             let date1: string = element.UTC_time;
             let date2: string = new Date().toString();
             let diffInMs: number = Date.parse(date2) - Date.parse(date1);
             let diffInHours: number = diffInMs / 1000 / 60 / 60;
             element.hourdifference= diffInHours

             this.markers.push({
                lat: element.location[1],
                lng: element.location[0],
                label: element.deviceIMEIID,
                draggable: true,
            },)
         });
         this.tempdevicelist= this.devicelist;
         return;
       } else {
         console.log(data.errormessage);
         return;
       }
     });
   }
  public onRangeChange(selectedtxt){
    const userdetails = {
        'userid': localStorage.getItem('userid'),
        'deviceid':this.selecteddeviceid,
        'dateRange': selectedtxt
      };
      this.getsensordetails(this.selecteddeviceid, selectedtxt);

      this.trackerService.getTrackingCoOrdinates(userdetails).subscribe(data => {
        if (data.success) {
          this.polyline = data.data;
          return;
        } else {
          console.log(data.errormessage);
          return;
        }
      });
  }

public gotoAlertPage() {
  window.location.href = '#/alerts/alert-elements';
}

  public getTelemeticsDataByDeviceId() {
    const devicedetails = {'deviceid': this.selecteddeviceid };
    this.trackerService.getTelemeticsDataByDeviceId(devicedetails).subscribe(data => {
      if (data.success) {
        this.LAcceleration = data.data.Acceleration;
        this.LLight = data.data.Light;
        this.LTemperature = data.data.Temperature;
        this.LOrientation = data.data.Orientation;
        this.LPressure = data.data.Pressure;
        this.Lhumidity = data.data.humidity;
        this.LmotionActivity = data.data.motionActivity;
        this.LXYZ_Acceleration = data.data.XYZ_Acceleration;
        return;
      } else {
        console.log(data.errormessage);
        return;
      }
    });
  }

    private getdevicedetails(deviceid:any) {
      this.showdevicedetails =true;
        const deviceID = deviceid;
        this.selecteddeviceid=deviceid;
        this.selecteddevicedetails=this.devicelist.find(x=>x.deviceIMEIID==this.selecteddeviceid);

        let date1: string = this.selecteddevicedetails.UTC_time;
        let date2: string = new Date().toString();
        let diffInMs: number = Date.parse(date2) - Date.parse(date1);
        let diffInHours: number = diffInMs / 1000 / 60 / 60;
        this.selecteddevicedetails.hourdifference= diffInHours;
        this.getTelemeticsDataByDeviceId();
        const userdetails = {
          'userid': localStorage.getItem('userid'),
          'deviceid': deviceID,
          "dateRange": "Last 24 hours"
        };
        this.trackerService.getTrackingCoOrdinates(userdetails).subscribe(data => {
          if (data.success) {
            this.polyline = data.data;

            return;
          } else {
            console.log(data.errormessage);
            return;
          }
        });

      }

      public getalertListbyUserId() {
        const userdetails = {
          //'userid': sessionStorage.getItem('userid')
            'userid' : 'sandeep@test.com'
        };
        this.shipmentService.getAlertsListByUser(userdetails).subscribe(data => {
          if (data.success) {
            this.alertProfileList = data.data;
           // console.log("11",this.alertProfileList );
          }
      } );
      }
      showalertProfileData(alertid: any) {
        this.getalertsProfileData = this.alertProfileList.filter(x => x._id.indexOf(alertid) > -1)[0];
       // console.log( this.getalertsProfileData);
       // this.islistshowing = true;
      }
// Alerts Section

public barChartOptions:any = {
  scaleShowVerticalLines: false,
  responsive: true
};
public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
public barChartType:string = 'bar';
public barChartLegend:boolean = true;
public showConfigDiv:boolean= false;

public barChartData:any[] = [
  {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
];

// events
public chartClicked(e:any):void {
  console.log(e);
}
public chartHovered(e:any):void {
  console.log(e);
}
public showconfigureDiv() {
   this.showConfigDiv = true;
}
public showEventDiv() {
  this.showConfigDiv = false;
}
}

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}
