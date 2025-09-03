import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Loader } from '../loader/loader';
import {NgOtpInputComponent} from 'ng-otp-input'

@Component({
  selector: 'app-verify',
  imports: [ReactiveFormsModule, Loader, NgOtpInputComponent],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify {
  email: string | null = null;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  verifyForm = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor(
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email');
  }

  async onSubmit() {

    if (this.verifyForm.invalid) {
      this.errorMessage.set('please enter valid values');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const payload = {
        email: this.email,
        otp: this.verifyForm.value.otp,
      };
      const res = await fetch('http://localhost:5000/auth/verify', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result?.success) {
        this.toaster.success('OTP Verified,  Redirectin....');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.toaster.error(result?.message);
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async resendOtp() {
    try {
      const payload = {
        email: this.email,
      };
      const res = await fetch('http://localhost:5000/auth/resend-otp', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (result?.success) {
        this.toaster.success('Otp Resent Successfully');
      } else {
        this.toaster.error(result?.message);
      }
    } catch (error: any) {
      console.error(error?.message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
