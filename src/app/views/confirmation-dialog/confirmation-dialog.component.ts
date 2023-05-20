import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <div>
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
    </div>
    <div class="modal-body">
      <p>{{prompt}}</p>
    </div>
    <div class="modal-footer">
      <button type="button"
        class="btn btn-outline-dark"
        (click)="activeModal.close(true)">OK</button>
        <button type="button"
        class="btn btn-outline-dark"
        (click)="activeModal.close(false)">CANCEL</button>
    </div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent implements OnInit {

    title: string='';
    prompt: string='';
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }


}