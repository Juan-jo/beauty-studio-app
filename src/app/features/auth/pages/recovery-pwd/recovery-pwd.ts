import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recovery-pwd',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recovery-pwd.html',
  styleUrl: './recovery-pwd.css',
})
export class RecoveryPwd {


  private fb = inject(FormBuilder);

  // Signals para manejar el estado de la vista y la carga
  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  userEmail = signal<string>('');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  doResetPassword() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const emailValue = this.form.value.email;

    // Simulación de llamada a la API
    setTimeout(() => {
      this.userEmail.set(emailValue);
      this.isLoading.set(false);
      this.isSubmitted.set(true); // Cambia a la pantalla de éxito
    }, 1500);
  }

  // Permite al usuario intentar enviar el correo nuevamente
  resendEmail() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }
}
