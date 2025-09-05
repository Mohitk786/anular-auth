import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import  {RecaptchaModule}  from 'ng-recaptcha-2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatIcon, RecaptchaModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    recaptcha: new FormControl('', [Validators.required]),
  });

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  inputType = signal<string>('password');

  constructor(
    private toaster: ToastrService,
    private authService: AuthService,
    public router: Router
  ) {}

  async onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.loginForm.invalid) {
      this.errorMessage.set('please enter valid values');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        body: JSON.stringify(this.loginForm.value),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();

      if (data?.success) {
        this.errorMessage.set(null);
        this.toaster.success('Login Successfull! Redirecting....');
        this.authService.login(data?.token, data?.user);

        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);
      } else {
        this.successMessage.set(null);
        this.toaster.error(data?.message);
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onCaptchaResolved(token: string | null) {
    if (token) {
      this.loginForm.get('recaptcha')?.setValue(token);
    } else {
      this.loginForm.get('recaptcha')?.setValue(null);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
    if (this.showPassword()) {
      this.inputType.set('text');
    } else {
      this.inputType.set('password');
    }
  }
}
