import { MaterialService } from './../../../shared/material.service';
import { Subscription } from 'rxjs';
import { JiraService } from './../../../services/jira.service';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Task } from 'src/app/shared/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy, OnChanges {
  gSub!: Subscription;
  dSub!: Subscription;
  csSub!: Subscription;
  tasks!: Task[];

  @Input() task!: Task;
  @Input() searchStr!: string;

  todo!: Task[];
  inProgress!: Task[];
  inReview!: Task[];
  done!: Task[];

  constructor(private jiraService: JiraService, private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    this.gSub = this.jiraService.getAllTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.todo = tasks.filter((task) => task.status === 'To Do');
        this.inProgress = tasks.filter((task) => task.status === 'In Progress');
        this.inReview = tasks.filter((task) => task.status === 'In Review');
        this.done = tasks.filter((task) => task.status === 'Done');
      },
      (err) => {
        MaterialService.toast(err.message);
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.gSub) {
      this.gSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }

    if (this.csSub) {
      this.csSub.unsubscribe();
    }
  }

  deleteItem(id: string) {
    this.dSub = this.jiraService.deleteTask(id).subscribe(
      () => {
        this.tasks = this.tasks.filter((task) => task.id !== id);

        this.todo = this.tasks.filter((task) => task.status === 'To Do');
        this.inProgress = this.tasks.filter(
          (task) => task.status === 'In Progress'
        );
        this.inReview = this.tasks.filter(
          (task) => task.status === 'In Review'
        );
        this.done = this.tasks.filter((task) => task.status === 'Done');
      },
      (err) => {
        MaterialService.toast(err.message);
      }
    );
  }

  // drop(event: CdkDragDrop<string[]>) {
  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const newStatus =
        event.container.element.nativeElement.parentElement.children[0]
          .innerText;

      const task = {
        title:
          event.item.element.nativeElement.firstChild.children[0].children[0]
            .childNodes[1].data,
        assignee:
          event.item.element.nativeElement.firstChild.children[0].children[1]
            .childNodes[1].data,
        priority:
          event.item.element.nativeElement.firstChild.children[0].children[2]
            .childNodes[1].data,
        type:
          event.item.element.nativeElement.firstChild.children[0].children[3]
            .childNodes[1].data,
        date:
          event.item.element.nativeElement.firstChild.children[0].children[4]
            .childNodes[1].data,
        status:
          event.item.element.nativeElement.firstChild.children[0].children[5]
            .childNodes[1].data,
        id:
          event.item.element.nativeElement.firstChild.children[0].children[6]
            .childNodes[1].data,
        description:
          event.item.element.nativeElement.firstChild.children[0].children[7]
            .childNodes[1].data,
      };

      this.csSub = this.jiraService.changeStatus(task, newStatus).subscribe(
        () => {},
        (err) => {
          MaterialService.toast(err.message);
        }
      );

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
