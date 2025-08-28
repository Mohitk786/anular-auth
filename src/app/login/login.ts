import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router) {}

  async onSubmit() {
    console.log(this.loginForm.value);
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
        console.log('response from backend', data);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  }
}
