import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DemandesServicesService } from 'src/app/services/demandes-services.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;
  addRequestForm: FormGroup;
  updateRequestForm: FormGroup;
  selectedFile: File | null = null;
  date: any;
  dataArray: any[] = [];
  dataa: any;
  events: any;
  selectedEvent: any;
  reasons: any[] = []; // Store reasons list

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private demandesServicesService: DemandesServicesService
  ) {
    this.dataa = JSON.parse(sessionStorage.getItem('user')!);

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      initialView: 'dayGridMonth',
      selectable: true,
      select: this.handleDateSelect.bind(this),
      events: [],
      eventClick: this.handleEventClick.bind(this)
    };

    this.addRequestForm = this.fb.group({
      start_date: [''],
      end_date: [''],
      reason_id: [''], // Initialize with empty string
      description: ['']
    });

    this.updateRequestForm = this.fb.group({
      start_date: [''],
      end_date: [''],
      reason_id: [''], // Initialize with empty string
      description: ['']
    });
  }

  ngOnInit(): void {
    this.demandesServicesService.getAllReasons().subscribe(data => {
      this.reasons = data.reasons; // Assuming data contains an array of reasons
    }, (err: HttpErrorResponse) => {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Failed to fetch reasons list!',
        showConfirmButton: true,
        timer: 1500
      });
    });
    this.updateCalendarEvents();
    this.fetchReasons(); // Fetch reasons list on component initialization
  }

  fetchReasons() {
    this.demandesServicesService.getAllReasons().subscribe(data => {
      this.reasons = data.reasons; // Assuming data contains an array of reasons
    }, (err: HttpErrorResponse) => {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Failed to fetch reasons list!',
        showConfirmButton: true,
        timer: 1500
      });
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateCalendarEvents() {
    if (this.dataa.role == 'employee') {
      this.demandesServicesService.getRequestsByID(this.dataa.user.id).subscribe(
        data => {
          const events = data.requests.map((request: any) => ({
            title: request.reason.name + " for " + request.user.email,
            start: request.start_date,
            end: request.end_date,
            data: request
          }));
          this.calendarOptions.events = events;
        },
        (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "We don't found this request in our database",
          });
        }
      );
    } else {
      this.demandesServicesService.getAllRequests().subscribe(
        data => {
          console.log(data)
          const events = data.requests.map((request: any) => ({
            title: request.reason.name + " for " + request.user.email,
            start: request.start_date,
            end: request.end_date,
            data: request
          }));
          this.calendarOptions.events = events;
        },
        (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "We don't found this request in our database",
          });
        }
      );
    }
  }

  handleDateSelect(selectInfo: any) {
    Swal.fire({
      title: 'Create an Event',
      html: `
        <div class="form-group">
          <input class="form-control" placeholder="Event Title" id="event-title">
        </div>
        <div class="form-group">
          <textarea class="form-control" placeholder="Description" id="event-description"></textarea>
        </div>
        <div class="form-group">
          <select class="form-control" id="event-reason">
            <option value="" disabled selected>Select a reason</option>
            ${this.reasons.map(reason => `<option value="${reason.id}">${reason.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <input class="form-control" type="file" id="event-certificate">
        </div>
      `,
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
      preConfirm: () => {
        const fileInput = document.getElementById('event-certificate') as HTMLInputElement;
        const selectedFile = fileInput.files?.[0] || null;
        return {
          eventTitle: (document.getElementById('event-title') as HTMLInputElement).value,
          eventDescription: (document.getElementById('event-description') as HTMLInputElement).value,
          eventReason: (document.getElementById('event-reason') as HTMLSelectElement).value,
          eventCertificate: selectedFile
        };
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        const { eventTitle, eventDescription, eventReason, eventCertificate } = result.value;

        if (eventTitle) {
          const calendarApi = selectInfo.view.calendar;
          calendarApi.addEvent({
            title: eventTitle,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });

          this.addRequestForm.patchValue({
            start_date: selectInfo.startStr,
            end_date: selectInfo.endStr,
            reason_id: eventReason,
            description: eventDescription
          });

          this.selectedFile = eventCertificate;
          this.addRequest(this.addRequestForm);
        }
        selectInfo.view.calendar.unselect();
      }
    });
  }

  handleEventClick(clickInfo: any) {
    this.selectedEvent = clickInfo.event.extendedProps.data;

    this.updateRequestForm.patchValue({
      start_date: this.selectedEvent.start_date,
      end_date: this.selectedEvent.end_date,
      reason_id: this.selectedEvent.reason_id,
      description: this.selectedEvent.description
    });

    $('#exampleModal').modal('show');
  }

  addRequest(form: FormGroup) {
    const formData = new FormData();

    formData.append('start_date', form.value.start_date);
    formData.append('end_date', form.value.end_date);
    formData.append('reason_id', form.value.reason_id);
    formData.append('description', form.value.description);
    formData.append('user_id', this.dataa.user.id);
    if (this.selectedFile) {
      formData.append('certificate', this.selectedFile, this.selectedFile.name);
    }

    this.date = moment(Date.now()).format("YYYY-MM-DD");
    if (form.value.start_date > this.date) {
      if (form.value.start_date <= form.value.end_date) {
        this.demandesServicesService.addRequest(formData).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Saved !',
            showConfirmButton: true,
            timer: 1500
          });
          this.updateCalendarEvents();
        }, (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Fields required or not valid !',
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Start Date must be before End Date !',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Start Date must be after current date !',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  updaterequest(f: any): void {
    const data = f.value;
    const formData = new FormData();
    formData.append('start_date', data.start_date);
    formData.append('end_date', data.end_date);
    formData.append('reason_id', data.reason_id);
    formData.append('description', data.description);
    if (this.selectedFile) {
      formData.append('certificate', this.selectedFile, this.selectedFile.name);
    }

    this.date = moment(Date.now()).format("YYYY-MM-DD");
    if (data.start_date > this.date) {
      if (data.start_date <= data.end_date) {
        if (this.selectedEvent) {
          this.demandesServicesService.updateRequest(this.selectedEvent.id, formData).subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Request Updated!',
              showConfirmButton: true,
              timer: 1500
            });
            $('#exampleModal').modal('hide');
            this.updateCalendarEvents();
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Start Date must be before End Date !',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Start Date must be after current date !',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
}
