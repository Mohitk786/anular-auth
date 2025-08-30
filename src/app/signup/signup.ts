import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, Loader],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignUp {
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  constructor(private toaster: ToastrService, public router: Router) {}

  async onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.profileForm.invalid) {
      this.errorMessage.set('Please fill out all fields correctly.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const payload = {
        ...this.profileForm.value,
        phone: String(this.profileForm.value.phone),
      };

      const res = await fetch('http://localhost:5000/auth/signup', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data?.success) {
        this.toaster.success(data?.message);
        this.router.navigate(['/verify', data?.data?.email]);
      } else {
        this.toaster.error(data?.message);
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
