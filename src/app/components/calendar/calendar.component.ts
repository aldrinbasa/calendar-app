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
    title: 'event1', 
    start:'2020-10-04T14:30:00',
    end: '2020-10-04T16:30:00',
    allday: false,
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
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

  constructor(private data: CalendarServiceService) { }

  ngOnInit() {    
  }

    
  handleDateClick(arg) { // handler method
    this.addItem.openModal(arg.dateStr);
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
  }

}
