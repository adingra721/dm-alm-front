import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  loading = false;
  error = '';
  resetToken = '';

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.resetToken = '';

    this.auth.requestPasswordReset(this.form.getRawValue().email ?? '').subscribe({
      next: (token) => {
        this.resetToken = token;
        this.loading = false;
      },
      error: (error) => {
        this.error = error?.error?.message ?? 'Impossible de generer le lien de reinitialisation.';
        this.loading = false;
      }
    });
  }
}
