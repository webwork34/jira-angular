import { environment } from './../../environments/environment';
import { FbCreateResponse, Task } from './../shared/interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JiraService {
  tasks: Task[] = [];

  constructor(private http: HttpClient) {}

  createTask(task: Task): Observable<Task> {
    return this.http.post<any>(`${environment.fbDbUrl}/tasks.json`, task).pipe(
      map((response: FbCreateResponse) => {
        return {
          ...task,
          id: response.name,
          date: new Date(task.date),
        };
      })
    );
  }

  getAllTasks() {
    return this.http.get(`${environment.fbDbUrl}/tasks.json`).pipe(
      map((response: { [key: string]: any }) => {
        if (response) {
          return Object.keys(response).map((key) => {
            return {
              ...response[key],
              id: key,
              date: new Date(response[key].date).toDateString(),
            };
          });
        }
        return [];
      })
    );
  }

  getAllUsers() {
    return this.http.get(`${environment.fbDbUrl}/users.json`).pipe(
      map((response: { [key: string]: any }) => {
        if (response) {
          return Object.keys(response).map((key) => {
            return {
              ...response[key],
              id: key,
            };
          });
        }
        return [];
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${environment.fbDbUrl}/tasks/${id}.json`).pipe(
      map((task: Task) => {
        return {
          ...task,
          id,
          date: new Date(task.date),
        };
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/tasks/${id}.json`);
  }

  changeStatus(task: Task, status: string): Observable<Task> {
    return this.http.patch<Task>(
      `${environment.fbDbUrl}/tasks/${task.id}.json`,
      {
        ...task,
        status,
      }
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(
      `${environment.fbDbUrl}/tasks/${task.id}.json`,
      task
    );
  }
}
