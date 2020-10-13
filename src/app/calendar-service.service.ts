import { Injectable } from '@angular/core';
import { BehaviorSubject   } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarServiceService {

  private content = new BehaviorSubject<string>("Default Value");
  public share =  this.content.asObservable();

  constructor() { }

  updateData(text){
    this.content.next(text);
  }
}
