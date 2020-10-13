import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {

  date = "2020-10-22";
  time = "08:35";
  category = "Appointment";
  patient = "Aldrin Niell M. Basa"
  reason = "Dry cough and fever";

  hiddenAppointment = true;
  hiddenOthers = true;

  constructor() { }

  ngOnInit() {
    
  }
  AssignValues(date, time, category, patient, reason){
    date.value = this.date;
    time.value = this.time;
    category.value = this.category;
    patient.value = this.patient;
    reason.value = this.reason;

    if(this.category == "Appointment"){
      this.hiddenAppointment = true;
      this.hiddenOthers = false;
    }
  }
}
