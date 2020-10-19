import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  @ViewChild('viewItemModal') viewItemModal;

  ngOnInit() {
  }

  closeModal(){
    this.viewItemModal.nativeElement.className = 'modal hide'
  }

  openModal(){
    this.viewItemModal.nativeElement.className = 'modal fade show';
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

  getValues(dateFrom, dateTo, time){

    if(time != ''){
      let filterCalendarTable = {
        dateFrom: dateFrom,
        time: time
      }

      let params = new HttpParams({fromObject: filterCalendarTable})
  
      this.http.get(this.APIUrlCalendarEvents, {params}).toPromise().then((data:any) => {
        for(let key in data){
          this.dateFrom = data[key].dateFrom;
          this.time = data[key].time;
          this.category = data[key].category;
          this.details = data[key].details;

          console.log(data[key].details);
        }
      });


      let filterAppointmentTable = {
        date: dateFrom,
        time: time
      }

      let paramsAppointment = new HttpParams({fromObject: filterAppointmentTable});

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
      let filterCalendarTable = {
        dateFrom: dateFrom,
        dateTo: dateTo
      }

      let params = new HttpParams({fromObject: filterCalendarTable});

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
  }

  delete(time, date){
    console.log(time.value);
    console.log(date.value);

    var idToDelete;

    let filter = {
      dateFrom: date.value,
      time: time.value
    }

    let params = new HttpParams({fromObject: filter});

    this.http.get(this.APIUrlCalendarEvents, {params}).toPromise().then((data:any) => {
      
      idToDelete = data[0].id;
      console.log('with data');

      this.http.delete(this.APIUrlCalendarEvents + '/' + idToDelete.toString()).toPromise().then((data:any) => {});

      window.location.reload();
    });

    let filterAppointmentTable = {
      date: date.value,
      time: time.value
    }

    let paramsAppointment = new HttpParams({fromObject: filterAppointmentTable});

    this.http.get(this.APIUrlAppointmentsTable, {params: paramsAppointment}).toPromise().then((data:any) => {
      
      idToDelete = data[0].id;
      console.log('with data');

      this.http.delete(this.APIUrlAppointmentsTable + '/' + idToDelete.toString()).toPromise().then((data:any) => {});

      window.location.reload();
    });
  }
}
