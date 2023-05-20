import { Observable, from, of } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private ngbModal: NgbModal) { }

  confirm(
    prompt = 'Really?', title = 'Confirmation'
  ): Observable<boolean> {
    const modal = this.ngbModal.open(
      ConfirmationDialogComponent, { backdrop: 'static' });

    modal.componentInstance.prompt = prompt;
    modal.componentInstance.title = title;

    return from(modal.result).pipe(
      catchError(error => {
        console.warn(error);
        return of(false);
      })
    );
  }
}