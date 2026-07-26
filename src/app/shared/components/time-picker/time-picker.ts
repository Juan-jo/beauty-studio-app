/*
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';



@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-picker.html',
  providers: [

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }

  ]
})
export class TimePickerComponent implements OnChanges, ControlValueAccessor {



  @Input()
  value = '09:00';


  @Output()
  valueChange = new EventEmitter<string>();


  @Input()
  min = '00:00';


  @Input()
  max = '23:59';


  @Input()
  interval = 15;


  open = false;


  times: string[] = [];


  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['min'] ||
      changes['max'] ||
      changes['interval']
    ) {
      this.generateTimes();
    }

  }


  ngOnInit() {
    this.generateTimes();
  }


  toggle() {
    this.open = !this.open;
  }


  select(time:string) {

    this.value = time;

    this.valueChange.emit(time);

    this.open = false;

    this.value = time;

    this.onChange(time);

    this.onTouched();
  }


  private generateTimes() {

    this.times = [];


    const start = this.toMinutes(this.min);

    const end = this.toMinutes(this.max);


    for(
      let current = start;
      current <= end;
      current += this.interval
    ){

      this.times.push(
        this.formatTime(current)
      );

    }

  }



  private toMinutes(time:string):number {

    const [
      hour,
      minute
    ] = time.split(':')
      .map(Number);


    return hour * 60 + minute;

  }



  private formatTime(minutes:number):string {

    const hour = Math.floor(minutes / 60);

    const minute = minutes % 60;


    return `${hour
      .toString()
      .padStart(2,'0')}:${minute
      .toString()
      .padStart(2,'0')}`;

  }


  private onChange = (value:string)=>{};


  private onTouched = ()=>{};


  writeValue(obj: any): void {
    this.value = obj ?? '';

  }
  registerOnChange(fn: any): void {
        this.onChange = fn;

  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;

  }
  setDisabledState?(isDisabled: boolean): void {
    
  }

}*/

import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';


@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './time-picker.html',
  providers: [

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }

  ]
})
export class TimePickerComponent
  implements OnChanges, OnInit, ControlValueAccessor {


  @Input()
  value = '09:00';


  @Output()
  valueChange = new EventEmitter<string>();


  @Input()
  min = '00:00';


  @Input()
  max = '23:59';


  @Input()
  interval = 15;



  open = false;


  openUp = false;


  times: string[] = [];



  private onChange = (value: string) => {};

  private onTouched = () => {};



  constructor(
    private elementRef: ElementRef
  ) {}



  ngOnInit(): void {

    this.generateTimes();

  }



  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['min'] ||
      changes['max'] ||
      changes['interval']
    ) {

      this.generateTimes();

    }

  }
  dropdownStyle: any = {};

  toggle() {

    this.open = !this.open;
  
  
    if(this.open){
  
      requestAnimationFrame(() => {
  
  
        const button =
          this.elementRef.nativeElement
            .querySelector('button');
  
  
        if(!button){
          return;
        }
  
  
        const rect =
          button.getBoundingClientRect();
  
  
  
        this.dropdownStyle = {
  
          top: `${rect.bottom + 8}px`,
  
          left: `${rect.left}px`,
  
          width: `${rect.width}px`
  
        };
  
  
      });
  
    }
  
  }

  /*toggle(): void {

    this.open = !this.open;


    if(this.open){

      setTimeout(() => {

        this.calculatePosition();

      });

    }

  }*/



  select(time: string): void {


    this.value = time;


    this.valueChange.emit(time);


    this.onChange(time);


    this.onTouched();


    this.open = false;

  }



  private calculatePosition(): void {


    const button =
      this.elementRef.nativeElement
        .querySelector('button');


    if(!button){
      return;
    }


    const rect =
      button.getBoundingClientRect();



    const spaceBottom =
      window.innerHeight - rect.bottom;



    const dropdownHeight = 280;



    this.openUp =
      spaceBottom < dropdownHeight;

  }




  private generateTimes(): void {


    this.times = [];


    const start =
      this.toMinutes(this.min);


    const end =
      this.toMinutes(this.max);



    for(
      let current = start;
      current <= end;
      current += this.interval
    ){

      this.times.push(
        this.formatTime(current)
      );

    }

  }




  private toMinutes(time:string): number {


    const [
      hour,
      minute
    ] = time
      .split(':')
      .map(Number);


    return (
      hour * 60
      + minute
    );

  }




  private formatTime(minutes:number): string {


    const hour =
      Math.floor(minutes / 60);


    const minute =
      minutes % 60;



    return `${hour
      .toString()
      .padStart(2,'0')}:${minute
      .toString()
      .padStart(2,'0')}`;

  }




  // ControlValueAccessor

  writeValue(value:string): void {

    this.value = value ?? '';

  }



  registerOnChange(fn:any): void {

    this.onChange = fn;

  }



  registerOnTouched(fn:any): void {

    this.onTouched = fn;

  }



  setDisabledState(isDisabled:boolean): void {

  }




  // cerrar al hacer click fuera

  @HostListener(
    'document:click',
    ['$event']
  )
  clickOutside(event: MouseEvent): void {


    if(
      !this.elementRef.nativeElement
      .contains(event.target)
    ){

      this.open = false;

    }

  }


}