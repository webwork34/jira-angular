import { Task } from 'src/app/shared/interfaces';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() item!: Task;
  @Output() removeTask = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  deleteTask(id: string) {
    this.removeTask.emit(id);
  }
}
