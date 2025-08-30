import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, Loader],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword {
  forgotPasswordPayload = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isMailSent = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  constructor(private toaster: ToastrService) {}

  async onForgotPassword() {
    try {
      const payload = {
        email: this.forgotPasswordPayload.value.email,
      };
      this.isSubmitting.set(true);
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (result?.success) {
        this.toaster.success('Password reset link sent to your email.');
        this.isMailSent.set(true);
      } else {
        this.toaster.error(result?.message);
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    }finally {
      this.isSubmitting.set(false);
    }
  }
}
