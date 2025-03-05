import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private userService:UsersService, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log("clicked")
      this.userService.login(this.loginForm.value).subscribe({
        next: (data) => {
          console.log("enters next")
          const token = data.access_token;
          const decodedToken: any = jwtDecode(token);
          const id = decodedToken._id; 
          this.userService.connect(id)
          this.router.navigate(["/dashboard", id])
          console.log(data)
        },
        error: (error) => {
          console.log(error)
          alert(error.error.msg)
        },
        complete: () => {
          console.log("complete")
          alert("User has logged in")
        }
      })
    }
  }

}
