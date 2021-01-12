import { Task } from 'src/app/shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalComponent } from './create-modal/create-modal.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  searchStr = '';

  task!: Task;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openCreateModal() {
    const dialogRef = this.dialog.open(CreateModalComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.task = result;
    });
  }
}
