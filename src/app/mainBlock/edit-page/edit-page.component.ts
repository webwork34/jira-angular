import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JiraService } from 'src/app/services/jira.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from 'src/app/shared/material.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  gSub!: Subscription;
  guSub!: Subscription;
  uSub!: Subscription;
  id!: string;

  types = ['Epic', 'User Story', 'Task', 'New Feature', 'Bug'];
  priorities = ['Major', 'Blocker', 'Critical', 'Minor', 'Trivial'];
  statuses = ['To Do', 'In Progress', 'In Review', 'Done'];
  candidates: string[] = ['Unassigned'];

  title = new FormControl(null, Validators.required);
  type = new FormControl(null, Validators.required);
  priority = new FormControl(null, Validators.required);
  assignee = new FormControl(null, Validators.required);
  description = new FormControl(null);
  date = new FormControl(null, Validators.required);
  status = new FormControl(null, Validators.required);

  constructor(
    private jiraService: JiraService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.form = new FormGroup({
      title: this.title,
      type: this.type,
      priority: this.priority,
      assignee: this.assignee,
      description: this.description,
      date: this.date,
      status: this.status,
    });

    this.guSub = this.jiraService.getAllUsers().subscribe(
      (data) => {
        data.forEach((candidate) => this.candidates.push(candidate.email));
      },
      (err) => {
        MaterialService.toast(err.message);
      }
    );

    this.gSub = this.jiraService.getTaskById(this.id).subscribe(
      (data) => {
        const existCandidate = this.candidates.some(
          (candidate) => candidate === data.assignee
        );

        existCandidate ? null : this.candidates.push(data.assignee);

        this.title.setValue(data.title);
        this.type.setValue(data.type);
        this.priority.setValue(data.priority);
        this.assignee.setValue(data.assignee);
        this.description.setValue(data.description);
        this.date.setValue(data.date);
        this.status.setValue(data.status);
      },
      (err) => {
        MaterialService.toast(err.message);
      }
    );
  }

  ngOnDestroy() {
    if (this.gSub) {
      this.gSub.unsubscribe();
    }

    if (this.uSub) {
      this.uSub.unsubscribe();
    }

    if (this.guSub) {
      this.guSub.unsubscribe();
    }
  }

  onSubmit() {
    this.uSub = this.jiraService
      .updateTask({ ...this.form.value, id: this.id })
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']);
          MaterialService.toast('Task was updated successfuly', 'toast-green');
        },
        (err) => {
          MaterialService.toast(err.message);
        }
      );
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
