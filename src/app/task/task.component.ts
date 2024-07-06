import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DemandesServicesService } from '../services/demandes-services.service';
import { HttpErrorResponse } from '@angular/common/http';

interface Task {
  id: number;
  reason: { id: number, name: string };
  user: { id: number, email: string };
  status: string;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  columns = [
    { title: 'In Progress', dataArrayyy: [] as Task[] },
    { title: 'Accepted', dataArrayyy: [] as Task[] },
    { title: 'Refused', dataArrayyy: [] as Task[] } // New column for Refused tasks
  ];
  messageErr: any;
  user: any;

  constructor(private demandesServicesService: DemandesServicesService) {}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    if (this.user && this.user.user && this.user.user.company_id) {
      this.loadTasks();
    } else {
      console.error('User or company ID is not available in session storage.');
    }
  }

  loadTasks(): void {
    this.demandesServicesService.getAllRequestsByCompany(this.user.user.company_id).subscribe(data => {
      console.log(data);
      this.columns[0].dataArrayyy = data.requests.filter((task: Task) => task.status === 'in_progress');
      this.columns[1].dataArrayyy = data.requests.filter((task: Task) => task.status === 'accepted');
      this.columns[2].dataArrayyy = data.requests.filter((task: Task) => task.status === 'refused'); // Update for Refused tasks
      sessionStorage.setItem('requestdetails', JSON.stringify(data));
    }, (err: HttpErrorResponse) => {
      this.messageErr = "We don't found this employee in our database";
      console.error('Error loading employees:', err);
    });
  }

  canDrag(task: Task): boolean {
    return task.status !== 'accepted';
  }

  onTaskDropped(event: CdkDragDrop<Task[]>, column: any) {
    console.log('Task dropped:', event);
    const task = event.item.data as Task;

    if (event.previousContainer === event.container) {
      console.log('Moving item in the same container');
      moveItemInArray(column.dataArrayyy, event.previousIndex, event.currentIndex);
    } else {
      console.log('Transferring item between containers');
      transferArrayItem(
        event.previousContainer.data as Task[],
        event.container.data as Task[],
        event.previousIndex,
        event.currentIndex
      );

      // Update task status based on new column
      let newStatus = '';
      if (column.title === 'In Progress') {
        newStatus = 'in_progress';
      } else if (column.title === 'Accepted') {
        newStatus = 'accepted';
      } else if (column.title === 'Refused') {
        newStatus = 'refused';
      }
      task.status = newStatus;
      console.log('Updating task status to:', newStatus);

      this.demandesServicesService.updateRequestStatus(task.id, newStatus).subscribe(
        () => {
          console.log('Task status updated successfully.');
        },
        (error: any) => {
          console.error('Error updating task status:', error);
          // Revert task move if the update fails
          transferArrayItem(
            event.container.data as Task[],
            event.previousContainer.data as Task[],
            event.currentIndex,
            event.previousIndex
          );
        }
      );
    }
  }
}
