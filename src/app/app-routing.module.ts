import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPageComponent } from './mainBlock/edit-page/edit-page.component';
import { DashboardPageComponent } from './mainBlock/dashboard-page/dashboard-page.component';
import { MainLayoutComponent } from './mainBlock/main-layout/main-layout.component';
import { RegisterPageComponent } from './authBlock/register-page/register-page.component';
import { LoginPageComponent } from './authBlock/login-page/login-page.component';
import { AuthLayoutComponent } from './authBlock/auth-layout/auth-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'task/:id/edit', component: EditPageComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
