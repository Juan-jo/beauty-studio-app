import {
    Directive,
    ElementRef,
    HostListener,
    forwardRef,
    inject
  } from '@angular/core';
  
  import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
  } from '@angular/forms';
  
  @Directive({
    selector: 'input[appPhoneFormat]',
    standalone: true,
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PhoneFormatDirective),
        multi: true
      }
    ]
  })
  export class PhoneFormatDirective implements ControlValueAccessor {
  
    private readonly el = inject(ElementRef<HTMLInputElement>);
  
    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};
  
    private disabled = false;
  
    // ---------------------------------------------------------
    // Usuario escribe en el input
    // ---------------------------------------------------------
  
    @HostListener('input')
    onInput(): void {
  
      const input = this.el.nativeElement;
  
      // Obtener solamente números
      const digits = input.value
        .replace(/\D/g, '')
        .slice(0, 10);
  
      // Formatear visualmente
      const formatted = this.formatPhoneNumber(digits);
  
      input.value = formatted;
  
      // Mandar solamente números al FormControl
      this.onChange(digits);
    }
  
    // ---------------------------------------------------------
    // Usuario sale del input
    // ---------------------------------------------------------
  
    @HostListener('blur')
    onBlur(): void {
      this.onTouched();
    }
  
    // ---------------------------------------------------------
    // Angular establece un valor
    // Ejemplo:
    // form.patchValue({ phone: '7712200330' })
    // ---------------------------------------------------------
  
    writeValue(value: string | null): void {
  
      const digits = String(value ?? '')
        .replace(/\D/g, '')
        .slice(0, 10);
  
      this.el.nativeElement.value =
        this.formatPhoneNumber(digits);
    }
  
    // ---------------------------------------------------------
    // Angular registra el callback para cambios
    // ---------------------------------------------------------
  
    registerOnChange(fn: (value: string) => void): void {
      this.onChange = fn;
    }
  
    // ---------------------------------------------------------
    // Angular registra el callback para touched
    // ---------------------------------------------------------
  
    registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
    }
  
    // ---------------------------------------------------------
    // Angular habilita / deshabilita el control
    // ---------------------------------------------------------
  
    setDisabledState(isDisabled: boolean): void {
  
      this.disabled = isDisabled;
  
      this.el.nativeElement.disabled = isDisabled;
    }
  
    // ---------------------------------------------------------
    // Formato
    // 7712200330
    // ↓
    // (77) (1220) (0330)
    // ---------------------------------------------------------
  
    private formatPhoneNumber(digits: string): string {
  
      if (!digits) {
        return '';
      }
  
      if (digits.length <= 2) {
        return `${digits}`;
      }
  
      if (digits.length <= 6) {
        return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      }
  
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
  }