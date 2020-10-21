import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { View } from '@fullcalendar/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  isReadOnly = true;

  hiddenAppointment = true;
  hiddenOthers = true;

  loadOnce = false;

  editButtonText = "Edit";

  APIUrlCalendarEvents = 'http://localhost:3000/CalendarEventsTable';
  APIUrlAppointmentsTable = "http://localhost:3000/AppointmentsTable";

  dateToEdit;
  timeToEdit;

  constructor(private http: HttpClient) { }

  @ViewChild('viewItemModal') viewItemModal;
  @ViewChild('date') dateElement;
  @ViewChild('time') timeElement;
  @ViewChild('category') categoryElement;
  @ViewChild('patient') patientElement;
  @ViewChild('reason') reasonElement;
  @ViewChild('details') detailsElement;
  @ViewChild('editButton') editButtonElement;

  ngOnInit() {
  }

  closeModal(){
    this.viewItemModal.nativeElement.className = 'modal hide'
    this.loadOnce = false;
    this.editButtonText = 'Edit';
  }

  openModal(){
    this.viewItemModal.nativeElement.className = 'modal fade show';
  }

  editPersonalEvent(){

    

    

    if(this.editButtonText == 'Edit'){

      if(this.categoryElement.nativeElement.value == 'personal'){
        this.editButtonText = 'Save'
        this.isReadOnly = false;

        this.dateToEdit = this.dateElement.nativeElement.value;
        this.timeToEdit = this.timeElement.nativeElement.value;

      }
      else{
        alert("Not Editable");
      }
    }
    else if(this.editButtonText == 'Save'){
      this.editButtonText = 'Edit';
      this.isReadOnly = true;

      var idToDelete;

      let filter = {
        dateFrom: this.dateToEdit,
        time: this.timeToEdit
      }
      
      let params = new HttpParams({fromObject: filter});

      this.http.get(this.APIUrlCalendarEvents, {params}).toPromise().then((data:any) => {
        
        idToDelete = data[0].id;

        this.http.patch(this.APIUrlCalendarEvents + '/' + idToDelete.toString(), {
          "time": this.timeElement.nativeElement.value, 
          "dateFrom": this.dateElement.nativeElement.value,
          "details": this.detailsElement.nativeElement.value
        }).toPromise().then((data:any) => {});

        window.location.reload();
      });
    }
  }

  AssignValues(date, time, category, patient, reason, details){
    if(!this.loadOnce){
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
      this.loadOnce = true;
    }
    
  }

  getValues(dateFrom, dateTo, time){

    if(time != ''){
      let filterCalendarTable = {
        dateFrom: dateFrom,
        time: time
      }

      let params = new HttpParams({fromObject: filterCalendarTable});
  
      this.http.get(this.APIUrlCalendarEvents, {params}).toPromise().then((data:any) => {
        for(let key in data){
          this.dateFrom = data[key].dateFrom;
          this.time = data[key].time;
          this.category = data[key].category;
          this.details = data[key].details;
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

        }
      });
    }
  }

  delete(time, date){
      var idToDelete;

      let filter = {
        dateFrom: date.value,
        time: time.value
      }

      let params = new HttpParams({fromObject: filter});

      this.http.get(this.APIUrlCalendarEvents, {params}).toPromise().then((data:any) => {
        
        idToDelete = data[0].id;

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

        this.http.delete(this.APIUrlAppointmentsTable + '/' + idToDelete.toString()).toPromise().then((data:any) => {});

        window.location.reload();
      });
    }
}
