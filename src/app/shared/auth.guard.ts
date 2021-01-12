import { MaterialService } from 'src/app/shared/material.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // если пользоватьель зарегестрирован - оборачиваем все в true - на страницу можно зайти
    if (this.authService.isAuthenticated()) {
      // оператор of позволяет создавть Observable
      return of(true);
    } else {
      this.router.navigate(['/login']);
      MaterialService.toast('First you have to login to system');

      // запрещаем вход в систему
      return of(false);
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
