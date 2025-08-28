import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup,FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignUp {
   profileForm = new FormGroup({
        name: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        password: new FormControl(''),
});

  constructor(private router: Router) { }

  async onSubmit() {   
    console.log(this.profileForm.value)
    try {
      const res = await fetch('http://localhost:5000/auth/signup', {
        body: JSON.stringify(this.profileForm.value),
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json();
      if(data?.success){
        console.log("response from backend", data)
        this.router.navigate(['/verify', data?.data?.email])
      }

    } catch (error:any) {
      console.error(error?.message)
    } 
             
           }

}