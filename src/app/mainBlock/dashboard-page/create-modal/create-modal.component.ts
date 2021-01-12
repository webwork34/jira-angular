import { JiraService } from './../../../services/jira.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/shared/material.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  cSub!: Subscription;
  gSub!: Subscription;

  types = ['Epic', 'User Story', 'Task', 'New Feature', 'Bug'];
  priorities = ['Major', 'Blocker', 'Critical', 'Minor', 'Trivial'];
  candidates: string[] = ['Unassigned'];

  title = new FormControl(null, Validators.required);
  type = new FormControl(this.types[0], Validators.required);
  priority = new FormControl(this.priorities[0], Validators.required);
  assignee = new FormControl('Unassigned', Validators.required);
  description = new FormControl(null);
  date = new FormControl(new Date(), Validators.required);

  constructor(
    private jiraService: JiraService,
    public dialogRef: MatDialogRef<CreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      type: this.type,
      title: this.title,
      priority: this.priority,
      assignee: this.assignee,
      description: this.description,
      date: this.date,
    });

    this.gSub = this.jiraService.getAllUsers().subscribe(
      (data) => {
        data.forEach((candidate) => this.candidates.push(candidate.email));
      },
      (err) => {
        MaterialService.toast(err.message);
      }
    );
  }

  ngOnDestroy() {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }

    if (this.gSub) {
      this.gSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.jiraService
      .createTask({ ...this.form.value, status: 'To Do' })
      .subscribe(
        () => {},
        (err) => {
          this.form.enable();
          MaterialService.toast(err.message);
        }
      );
  }
}
