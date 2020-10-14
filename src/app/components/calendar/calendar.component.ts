import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarServiceService } from '../../calendar-service.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public defaultDateFromParent;

  calendarPlugins = [dayGridPlugin, interactionPlugin];
  nextDayThreshold = '09:00:00';
  calendarEvents = [{
    title: '', 
    start:'',
    end: '',
    allday: false,
    backgroundColor: '',
    borderColor: ''
  }];

  oneDayDate;
  oneDayTime;
  multiDayFromDate;
  multiDayToDate;
  category;
  details;
  patient;
  reason;

  parsedDateAndTimeOneDay;
  parsedDateAndTimeMultiFrom;
  backgroundColor;

  APIUrlCalendarEvents = 'http://localhost:3000/CalendarEventsTable';
  APIUrlAppointmentsTable = "http://localhost:3000/AppointmentsTable";
  postData;


  constructor(private http: HttpClient) {}

  ngOnInit() { 
    this.renderDate();
  }
  // renderDate(){

  //   this.calendarEvents = [];

  //   this.http.get(this.APIUrlCalendarEvents).toPromise().then((data:any) => {
  //     for(let key in data){
  //       if(data.hasOwnProperty(key)){

  //         this.calendarEvents = this.calendarEvents.concat({ 
  //           title: data[key].details, 
  //           start: data[key].dateFrom,
  //           end: data[key].dateTo,
  //           allday: false,
  //           backgroundColor: '#447ba1',
  //           borderColor: '#447ba1',
  //         });
  //       }
  //     }
  //   });
  // }

  renderDate(){
    this.calendarEvents = [];

    //Personal and Sponsored Events
    this.http.get(this.APIUrlCalendarEvents).toPromise().then((data:any) => {
      for(let key in data){
        if(data.hasOwnProperty(key)){

          if(data[key].dateTo != ''){
            //Multi-Day Event
            if(data[key].category == 'personal'){
              this.backgroundColor = '#ffff00';
            }else{
              this.backgroundColor = '#a427c5';
            }
    
            this.calendarEvents = this.calendarEvents.concat({ 
              title: data[key].details, 
              start: data[key].dateFrom,
              end: data[key].dateTo,
              allday: true,
              backgroundColor: this.backgroundColor,
              borderColor: this.backgroundColor
            });
          }
          else{
            //One-Day Event
            if(data[key].category == 'personal'){
              this.backgroundColor = '#ffff00';
            }else{
              this.backgroundColor = '#a427c5';
            }
            this.parsedDateAndTimeOneDay = data[key].dateFrom + 'T' + data[key].time;
        
            this.calendarEvents = this.calendarEvents.concat({ 
              title: data[key].details, 
              start: this.parsedDateAndTimeOneDay,
              end: null,
              allday: null,
              backgroundColor: this.backgroundColor,
              borderColor: this.backgroundColor
            });
          }
        }
      }
    });

    this.http.get(this.APIUrlAppointmentsTable).toPromise().then((data:any) => {
      for(let key in data){
        if(data.hasOwnProperty(key)){

          this.parsedDateAndTimeOneDay = data[key].date + 'T' + data[key].time;
        
          this.calendarEvents = this.calendarEvents.concat({ 
            title: data[key].patient, 
            start: this.parsedDateAndTimeOneDay,
            end: null,
            allday: null,
            backgroundColor: '#447ba1',
            borderColor: '#447ba1',
          });
        }
      }
    });
  }

  handleDateClick(arg){ // handler method
    this.addItem.openModal(arg.dateStr);  
  }

  handleEventClick(arg){
    alert(arg.event.title);
  }

  @ViewChild('addItem') addItem; 

  getValuesFromAddNewItem(getValuesFromAddNewItem){
    this.oneDayDate = getValuesFromAddNewItem.oneDayDate;
    this.oneDayTime = getValuesFromAddNewItem.oneDayTime;
    this.multiDayFromDate = getValuesFromAddNewItem.multiDayFromDate;
    this.multiDayToDate = getValuesFromAddNewItem.multiDayToDate;
    this.category = getValuesFromAddNewItem.category;
    this.details = getValuesFromAddNewItem.details;
    this.patient = getValuesFromAddNewItem.patient;
    this.reason = getValuesFromAddNewItem.reason;
  }

  addEvent(){
    if(this.oneDayTime != ''){

      if(this.category == 'appointment'){

        //One-Day Appointment
        this.parsedDateAndTimeOneDay = this.oneDayDate + 'T' + this.oneDayTime;
        
        this.calendarEvents = this.calendarEvents.concat({ 
          title: this.patient, 
          start: this.parsedDateAndTimeOneDay,
          end: null,
          allday: null,
          backgroundColor: '#447ba1',
          borderColor: '#447ba1',
        });

        this.postData = {
          id: '',
          date: this.oneDayDate,
          time: this.oneDayTime,
          patient: this.patient,
          reason: this.reason
        }

        this.http.post(this.APIUrlAppointmentsTable, this.postData).toPromise().then((data:any) => {
          console.log(data);
        });
      }

      else{

        if(this.category == 'personal'){
          this.backgroundColor = '#ffff00';
        }else{
          this.backgroundColor = '#a427c5';
        }
        //One-Day Others
        this.parsedDateAndTimeOneDay = this.oneDayDate + 'T' + this.oneDayTime;
        
        this.calendarEvents = this.calendarEvents.concat({ 
          title: this.details, 
          start: this.parsedDateAndTimeOneDay,
          end: null,
          allday: null,
          backgroundColor: this.backgroundColor,
          borderColor: this.backgroundColor
        });

        this.postData = {
          id: '',
          dateFrom: this.oneDayDate,
          dateTo: '',
          time: this.oneDayTime,
          category: this.category,
          details: this.details, 
          createdBy: '',
          status: ''
        };

        this.http.post(this.APIUrlCalendarEvents, this.postData).toPromise().then((data:any) => {
          console.log(data);
        });        
      }
    }

    else{

      //Multi-Day Appointment
      if(this.category == 'appointment'){
        
        this.calendarEvents = this.calendarEvents.concat({ 
          title: this.patient, 
          start: this.multiDayFromDate + 'T00:00:00',
          end: this.multiDayToDate + 'T00:00:00',
          allday: true,
          backgroundColor: '#447ba1',
          borderColor: '#447ba1'
        });
      }

      //Multi-Day Others
      else{

        if(this.category == 'personal'){
          this.backgroundColor = '#ffff00';
        }else{
          this.backgroundColor = '#a427c5';
        }

        this.calendarEvents = this.calendarEvents.concat({ 
          title: this.details, 
          start: this.multiDayFromDate,
          end: this.multiDayToDate,
          allday: true,
          backgroundColor: this.backgroundColor,
          borderColor: this.backgroundColor
        });

        this.postData = {
          id: '',
          dateFrom: this.multiDayFromDate,
          dateTo: this.multiDayToDate,
          time: '',
          category: this.category,
          details: this.details, 
          createdBy: '',
          status: ''
        };

        this.http.post(this.APIUrlCalendarEvents, this.postData).toPromise().then((data:any) => {
          console.log(data);
        });
      }
    }

    this.oneDayDate = '';
    this.oneDayTime = '';
    this.multiDayFromDate = '';
    this.multiDayToDate = '';
    this.category = '';
    this.details = '';
    this.patient = '';
    this.reason = '';
    this.parsedDateAndTimeOneDay = '';

    this.postData = '';

    this.renderDate();
  }

}
