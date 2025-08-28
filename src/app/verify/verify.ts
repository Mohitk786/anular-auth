import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [ReactiveFormsModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify {
  email: string | null = null;

  verifyForm = new FormGroup({
    otp: new FormControl(''),
  });

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email');
  }

  async onSubmit() {
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
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  }
}
