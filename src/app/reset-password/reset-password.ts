import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, Loader],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  token = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  resetPasswordPayload = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token.set(params['token'] || null);
    });
  }

  async onResetPassword() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.resetPasswordPayload.invalid) {
      this.errorMessage.set('Please fill out all fields correctly.');
      return;
    }

    const { newPassword, confirmNewPassword } = this.resetPasswordPayload.value;
    if (newPassword !== confirmNewPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const payload = {
        resetToken: this.token(),
        newPassword,
        confirmNewPassword,
      };
      const res = await fetch('http://localhost:5000/auth/reset-password', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (result?.success) {
        this.toaster.success('Password reset successful! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else {
        this.toaster.error(result?.message || 'Password reset failed.');
      }
      
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
