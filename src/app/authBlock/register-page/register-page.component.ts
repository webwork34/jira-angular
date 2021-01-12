import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/interfaces';
import { MaterialService } from 'src/app/shared/material.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  hide = true;
  hideConfirm = true;
  aSub!: Subscription;

  email = new FormControl(null, [Validators.required, Validators.email]);
  password = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
  ]);
  passwordConfirm = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
  ]);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
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

  getErrorMessagePasswordConfirm() {
    if (this.passwordConfirm.hasError('required')) {
      return 'Confirm passowrd is required';
    }

    return this.passwordConfirm.hasError('minlength')
      ? `Confirm passowrd should be bigger then ${
          this.passwordConfirm.errors!['minlength']['requiredLength']
        } symbols. Now it is ${
          this.passwordConfirm.errors!['minlength']['actualLength']
        } symbols.`
      : '';
  }

  onSubmit() {
    this.form.disable();

    if (this.form.invalid) {
      return;
    }

    if (
      this.form.controls.password.value !==
      this.form.controls.passwordConfirm.value
    ) {
      this.form.enable();
      MaterialService.toast(`Passwords don't match`);
    } else {
      const user: User = {
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
        returnSecureToken: true,
      };

      this.aSub = this.authService.register(user).subscribe(
        () => {
          this.authService
            .createNewUser({ email: this.form.controls.email.value })
            .subscribe(
              () => {},
              (err) => {
                MaterialService.toast(err.message);
              }
            );

          MaterialService.toast('User was created successfuly', 'toast-green');
          this.router.navigate(['/login']);
        },
        (err) => {
          this.form.enable();
          MaterialService.toast(err.error.error.message);
        }
      );
    }
  }
}
