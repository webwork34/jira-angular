import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './authBlock/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './mainBlock/main-layout/main-layout.component';
import { RegisterPageComponent } from './authBlock/register-page/register-page.component';
import { LoginPageComponent } from './authBlock/login-page/login-page.component';
import { DashboardPageComponent } from './mainBlock/dashboard-page/dashboard-page.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { CreateModalComponent } from './mainBlock/dashboard-page/create-modal/create-modal.component';
import { TasksComponent } from './mainBlock/dashboard-page/tasks/tasks.component';
import { ListComponent } from './mainBlock/dashboard-page/tasks/list/list.component';
import { SearchTaskPipe } from './shared/search-task.pipe';
import { EditPageComponent } from './mainBlock/edit-page/edit-page.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    RegisterPageComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CreateModalComponent,
    TasksComponent,
    ListComponent,
    SearchTaskPipe,
    EditPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
