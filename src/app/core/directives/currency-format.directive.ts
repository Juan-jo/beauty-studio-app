import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormat]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyFormatDirective),
      multi: true,
    },
  ],
})
export class CurrencyFormatDirective implements ControlValueAccessor {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    const currentValue = this.el.nativeElement.value;

    // Permite el punto decimal solo si aún no existe uno en el campo
    if (event.key === '.' || event.key === ',') {
      if (currentValue.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    // Bloquea cualquier tecla que no sea un número (0-9)
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Si ya hay un punto decimal, limita la parte decimal a 2 dígitos
    if (currentValue.includes('.')) {
      const parts = currentValue.split('.');
      const selectionStart = this.el.nativeElement.selectionStart ?? currentValue.length;
      const dotIndex = currentValue.indexOf('.');

      // Si el cursor está después del punto decimal y ya hay 2 dígitos, bloquea la entrada
      if (selectionStart > dotIndex && parts[1] && parts[1].length >= 2) {
        event.preventDefault();
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Reemplaza comas por puntos para homogeneizar la entrada
    value = value.replace(',', '.');

    // Mantiene solo números y el primer punto decimal
    const cleanValue = value.replace(/[^0-9.]/g, '');

    if (!cleanValue) {
      this.el.nativeElement.value = '';
      this.onChange(null);
      return;
    }

    // Si termina en punto (ej: "100."), lo muestra para permitir seguir escribiendo decimales
    if (cleanValue.endsWith('.')) {
      const parts = cleanValue.split('.');
      const integerPart = parseInt(parts[0] || '0', 10);
      this.el.nativeElement.value = `$ ${new Intl.NumberFormat('en-US').format(integerPart)}.`;
      return;
    }

    const parts = cleanValue.split('.');
    const integerPart = parseInt(parts[0] || '0', 10);
    const formattedInteger = new Intl.NumberFormat('en-US').format(integerPart);

    if (parts.length > 1) {
      // Limita la parte decimal a 2 dígitos
      const decimalPart = parts[1].slice(0, 2);
      this.el.nativeElement.value = `$ ${formattedInteger}.${decimalPart}`;
      
      const numericValue = parseFloat(`${integerPart}.${decimalPart}`);
      this.onChange(isNaN(numericValue) ? null : numericValue);
    } else {
      this.el.nativeElement.value = `$ ${formattedInteger}`;
      this.onChange(isNaN(integerPart) ? null : integerPart);
    }
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    
    // Al perder el foco, ajusta a 2 decimales exactos si hay valor (ej. 100.5 -> $ 100.50)
    const currentValue = this.el.nativeElement.value;
    if (currentValue) {
      const cleanDigits = currentValue.replace(/[^0-9.]/g, '');
      const numericValue = parseFloat(cleanDigits);
      if (!isNaN(numericValue)) {
        this.el.nativeElement.value = this.formatCurrency(numericValue);
      }
    }
  }

  writeValue(value: number | string | null): void {
    if (value !== null && value !== undefined && value !== '') {
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      this.el.nativeElement.value = this.formatCurrency(numericValue);
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private formatCurrency(value: number): string {
    if (isNaN(value)) return '';
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    return `$ ${formattedNumber}`;
  }
}