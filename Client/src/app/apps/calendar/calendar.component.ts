import { Component, AfterViewInit, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TrackerService } from '../../services/tracker.service';
import { DatePipe } from '@angular/common';

@Component ({
    templateUrl: 'calendar.html',
    styleUrls: ['calendar.css'],
})

export class CalendarComponent implements OnInit {
  public devicelist: Array<any>;
    // settings = {
    //     actions: {
    //       add: false,
    //       edit: false,
    //       },
    //     delete: {
    //       deleteButtonContent: '<i class="nb-trash"></i>',
    //       confirmDelete: true,
    //     },
    //     columns: {
    //       device_code: {
    //         title: 'Device ID',
    //         type: 'number',
    //       },
    //       deviceIMEIID: {
    //         title: 'IMEI ID',
    //         type: 'string',
    //       },
    //       device_provider: {
    //         title: 'Device Provider',
    //         type: 'string',
    //       },
    //       Created_date: {
    //         title: 'Date',
    //         valuePrepareFunction: (date) => {
    //           const raw = new Date(date);
    //           const formatted = new DatePipe('en-EN').transform(raw, 'dd MMM yyyy HH:mm:ss');
    //           return formatted;
    //         },
    //       },
    //     },
    //   };

    //   source: LocalDataSource = new LocalDataSource();

     constructor(private trackerService: TrackerService) {
       this.devicelist = new Array<any>() ;
     }

      ngOnInit() {
        this.fetchTrackingDeviceList();
      }

      fetchTrackingDeviceList() {
        const userdetails = {
          'userid': localStorage.getItem('userid'),
        };
        this.trackerService.getAlldevices(userdetails).subscribe(data => {
          if (data.success) {
            this.devicelist = data.data;
            // console.log("1", data.data);
            // this.source.load(data.data);
            return;
          } else {
            console.log(data.errormessage);
            return;
          }
        });
      }
}
