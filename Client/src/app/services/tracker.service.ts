import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class TrackerService {
  serverURL: any;
  constructor(private http: Http) {
    //    this.serverURL = 'https://apitrackergps.herokuapp.com';
     this.serverURL = 'http://ec2-13-232-177-192.ap-south-1.compute.amazonaws.com:3001';
  }

getAlldevices(userdetails) {
const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.serverURL + '/getListofTrackerByuser', userdetails, { headers: headers })
            .map(res => res.json());
}

getTrackingCoOrdinates(userdetails) {
    const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.serverURL + '/getLocationByDeviceId', userdetails, { headers: headers })
            .map(res => res.json());

}
getTelemeticsDataByDeviceId(devicedetails) {
  const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post(this.serverURL + '/getTelemeticsDataByDeviceID', devicedetails, { headers: headers })
          .map(res => res.json());

}

// getSensorDataByDeviceId(devicedetail) {
//   const headers = new Headers();
//   headers.append('Content-Type', 'application/json');
//   return this.http.post(this.serverURL + '/getSensorDataByDeviceId', devicedetail, { headers: headers })
//       .map(res => res.json());
//   }
getSensorDataByDeviceId(devicedetail) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(this.serverURL + '/getGraphsDataforSensors', devicedetail, { headers: headers })
      .map(res => res.json());
  }
// createDevice(newBillboard) {
//     const headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     return this.http.post(this.serverURL + '/createDevice', newBillboard, { headers: headers })
//         .map(res => res.json());
// }
getprofiledataByUser(userdetails) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(this.serverURL + '/users/getprofilesByUser', userdetails, { headers: headers })
      .map(res => res.json());
}
updateprofileByUser(profiledata){
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.post(this.serverURL + '/users/createUser', profiledata, { headers: headers })
      .map(res => res.json());
}
}
