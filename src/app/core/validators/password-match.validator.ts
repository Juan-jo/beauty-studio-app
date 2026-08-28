import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]+$/;


export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  // Si aún no se ha escrito en confirmPassword, no marcamos error de coincidencia
  if (!confirmPassword) {
    return null;
  }

  // Si no coinciden, seteamos el error 'passwordMismatch' en confirmPassword
  if (newPassword !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  // Si coinciden y tenía el error previamente, lo limpiamos
  const currentErrors = control.get('confirmPassword')?.errors;
  if (currentErrors) {
    delete currentErrors['passwordMismatch'];
    const remainingErrors = Object.keys(currentErrors).length ? currentErrors : null;
    control.get('confirmPassword')?.setErrors(remainingErrors);
  }

  return null;
};