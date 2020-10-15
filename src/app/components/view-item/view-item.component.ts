import { Component, OnInit, ViewChild} from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { viewAttached } from '@angular/core/src/render3/instructions';
import { defaultMaxListeners } from 'stream';


@Component({
  selector: 'view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {

  dateFrom = '';
  dateTo = '';
  time = '';
  category = '';
  patient = '';
  reason = '';
  details = '';

  hiddenAppointment = true;
  hiddenOthers = true;

  APIUrlCalendarEvents = 'http://localhost:3000/CalendarEventsTable';
  APIUrlAppointmentsTable = "http://localhost:3000/AppointmentsTable";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    
  }
  AssignValues(date, time, category, patient, reason, details){
    date.value = this.dateFrom;
    time.value = this.time;
    category.value = this.category;
    patient.value = this.patient;
    reason.value = this.reason;
    details.value = this.details;

    if(this.category == "Appointment"){
      this.hiddenAppointment = true;
      this.hiddenOthers = false;
    }
    else{
      this.hiddenAppointment = false;
      this.hiddenOthers = true;
    }
  }

  @ViewChild('date') dateElement;
  @ViewChild('time') timeElement;
  @ViewChild('category') categoryElement;
  @ViewChild('details') detailsElement;
  @ViewChild('patient') patientElement;
  @ViewChild('reason') reasonElement;

  getValues(dateFrom, dateTo, time){

    if(time != ''){
      let params = new HttpParams().set('dateFrom', dateFrom);
      params.append('time', time);
  
      this.http.get(this.APIUrlCalendarEvents, {params}).toPromise().then((data:any) => {
        for(let key in data){
          this.dateFrom = data[key].dateFrom;
          this.time = data[key].time;
          this.category = data[key].category;
          this.details = data[key].details;

          console.log(data[key].details);
        }
      });

      let paramsAppointment = new HttpParams().set('date', dateFrom);
      paramsAppointment.append('time', time);

      this.http.get(this.APIUrlAppointmentsTable, {params: paramsAppointment}).toPromise().then((data:any) => {
        for(let key in data){
          this.dateFrom = data[key].date;
          this.time = data[key].time;
          this.patient = data[key].patient;
          this.reason = data[key].reason;
          this.category = 'Appointment';
        }
      });

      
    }

    else{
      let params = new HttpParams().set('dateFrom', dateFrom);
      params.append('dateTo', dateTo);

      this.http.get(this.APIUrlCalendarEvents, {params}).toPromise().then((data:any) => {
        for(let key in data){
          this.dateFrom = data[key].dateFrom;
          this.dateTo = data[key].dateTo;
          this.category = data[key].category;
          this.details = data[key].details;

          console.log(data[key].details);
        }
      });
    }

    // this.dateElement.nativeElement.value = this.dateFrom;
    // this.timeElement.nativeElement.value = this.time;
    // this.categoryElement.nativeElement.value = this.category;
    // this.detailsElement.nativeElement.value = this.details;
    // this.patientElement.nativeElement.value = this.patient;
    // this.reasonElement.nativeElement.value = this.reason;
  }
}
