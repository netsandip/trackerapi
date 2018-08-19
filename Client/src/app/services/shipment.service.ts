import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {shipmentdetail} from './../modal/shipmentdetail'

@Injectable()
export class ShipmentService {
  serverURL: any;
  constructor(private http: Http) {
    // this.serverURL = 'https://apitrackergps.herokuapp.com';
     this.serverURL = 'http://ec2-13-232-177-192.ap-south-1.compute.amazonaws.com:3001';
  }

createShipment(shipmentdetails: shipmentdetail) {
const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.serverURL + '/createShipment', shipmentdetails, { headers: headers })
            .map(res => res.json());
}

createShipmentTemplate(shipmentdetails: shipmentdetail) {
    const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            return this.http.post(this.serverURL + '/createTemplate', shipmentdetails, { headers: headers })
                .map(res => res.json());
    }
getShipTemplateList(userdetails) {
        const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                return this.http.post(this.serverURL + '/listofShipTempelatesByUser', userdetails, { headers: headers })
                    .map(res => res.json());
        }
getShipmentByStatus(userdetails) {
          const headers = new Headers();
                  headers.append('Content-Type', 'application/json');
                  return this.http.post(this.serverURL + '/getShipmentByStatus', userdetails, { headers: headers })
                      .map(res => res.json());
          }
getShipmentLocationByUser(userdetails) {
            const headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post(this.serverURL + '/getShipmentDetailsbyUser', userdetails, { headers: headers })
                        .map(res => res.json());
            }
getAlertsListByUser(userdetails) {
            const headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post(this.serverURL + '/alerts/getAlertsMasterByUser', userdetails, { headers: headers })
                        .map(res => res.json());
            }
CreateAlertsProfile(alertsProfileData) {
              const headers = new Headers();
                      headers.append('Content-Type', 'application/json');
                      return this.http.post(this.serverURL + '/createalertsmaster', alertsProfileData, { headers: headers })
                          .map(res => res.json());
              }
}
