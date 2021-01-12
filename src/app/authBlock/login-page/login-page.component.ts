import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/shared/material.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  hide = true;
  aSub!: Subscription;

  email = new FormControl(null, [Validators.required, Validators.email]);
  password = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
  ]);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    return this.email.hasError('email') ? 'Email is not valid' : '';
  }

  getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'Passowrd is required';
    }

    return this.password.hasError('minlength')
      ? `Password should be bigger then ${
          this.password.errors!['minlength']['requiredLength']
        } symbols. Now it is ${
          this.password.errors!['minlength']['actualLength']
        } symbols.`
      : '';
  }

  onSubmit() {
    this.form.disable();

    if (this.form.invalid) {
      return;
    }

    this.aSub = this.authService
      .login({ ...this.form.value, returnSecureToken: true })
      .subscribe(
        (data) => {
          localStorage.setItem('userName', data!.email);
          this.router.navigate(['/dashboard']);
        },
        (err) => {
          this.form.enable();
          MaterialService.toast(err.error.error.message);
        }
      );
  }
}
