import { Component, OnInit , EventEmitter, Output, ViewChild, Input} from '@angular/core';


@Component({
  selector: 'add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent implements OnInit {

  @Input() public defaultDate;

  oneDayMode;
  categoryMode;
  
  hiddenOneDay = false;
  hiddenMultiDay = true;
  hiddenAppointment = true;
  hiddenOthers = true;
  hiddenAppointmentMultiDay;

  @ViewChild('addItemModal') addItemModal;
  @ViewChild('date') date;
  @ViewChild('from') from;
  @ViewChild('radioOneDay') radioOneDay;
  @ViewChild('radioMultiDay') radioMultiDay;
  @ViewChild('category') category;

  @Output() getValuesEvent = new EventEmitter();
  @Output() saveToCalendar = new EventEmitter();

  ngOnInit() {
    this.oneDayMode = true;
    this.categoryMode = "";
  }

  closeModal(){
    this.addItemModal.nativeElement.className = 'modal hide';

    this.oneDayMode = true;
    this.categoryMode = "";
    
    this.radioOneDay.nativeElement.checked = true;
    this.category.nativeElement.selectedIndex = 0;

    this.hiddenAppointment = true;
    this.hiddenOthers = true;
  }

  openModal(Date){
    this.addItemModal.nativeElement.className = 'modal fade show';
    this.date.nativeElement.value = Date;
    this.from.nativeElement.value = Date;
  }

  getFormValues(date, time, category, from, to, patient, reason, details){
    this.AddItemValues.oneDayDate = date.value;
    this.AddItemValues.oneDayTime = time.value;
    this.AddItemValues.category = category.value;
    this.AddItemValues.multiDayFromDate = from.value; 
    this.AddItemValues.multiDayToDate = to.value;
    this.AddItemValues.patient = patient.value;
    this.AddItemValues.reason = reason.value;
    this.AddItemValues.details = details.value;

    this.passValuesToCalendar();

    date.value = '';
    time.value = '';
    category.value = '';
    from.value = ''; 
    to.value = '';
    patient.value = '';
    reason.value = '';
    details.value = '';

    this.closeModal();
  }

  getModeOfForm(item){
    this.category.nativeElement.selectedIndex = 0;
    this.hiddenAppointment = true;
    this.hiddenOthers = true;
    
    if (item.id == "one-day"){
      this.oneDayMode = true;
      this.hiddenOneDay = false;
      this.hiddenMultiDay = true;
      this.hiddenAppointmentMultiDay = false;
    }
    else if(item.id == "multi-day"){
      this.oneDayMode = false;
      this.hiddenOneDay = true;
      this.hiddenMultiDay = false;
      this.hiddenAppointmentMultiDay = true;
    }
  }

  getCategoryOfForm(item){
    this.categoryMode = item.value;

    if(this.categoryMode == "appointment"){
      this.hiddenAppointment = true;
      this.hiddenOthers = false;
    }
    else if(this.categoryMode != ""){
      this.hiddenAppointment = false;
      this.hiddenOthers = true;
    }
  }

  AddItemValues = {
    oneDayDate: '',
    oneDayTime: '',
    multiDayFromDate: '',
    multiDayToDate: '',
    category: '',
    details: '',
    patient: '',
    reason: '',
  }

  passValuesToCalendar(){
      this.getValuesEvent.emit(this.AddItemValues);
      this.saveToCalendar.emit();
  }
}
