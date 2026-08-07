import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DurationPipe } from '../../../core/pipes/duration-pipe';

@Component({
  selector: 'app-duration-picker',
  templateUrl: './duration-picker.html',

  standalone: true,
  imports: [
    CommonModule,
    DurationPipe
  ],
  providers: [

    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DurationPickerComponent),
      multi: true
    }

  ]

})
export class DurationPickerComponent 
implements OnChanges, OnInit, ControlValueAccessor {


@Input()
value = 30;


@Output()
valueChange = new EventEmitter<number>();


@Input()
min = 30;


@Input()
max = 25;


@Input()
interval = 15;



open = false;


openUp = false;


times: number[] = [];



private onChange = (value: number) => {};

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


select(duration: number): void {


  this.value = duration;


  this.valueChange.emit(duration);


  this.onChange(duration);


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


  let min = this.min;
  let max = this.max;

  while(min <= max) {

    this.times.push(min)

    min = min + this.interval;

  }

}






// ControlValueAccessor

writeValue(value:number): void {

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