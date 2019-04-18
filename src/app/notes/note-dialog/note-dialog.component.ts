import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { Note } from '../note.model';
import { NoteService } from '../note.service';
import { LookupService } from '../../core/services/lookup.service';
import { Lookup } from '../../core/models/lookup.model';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss']
})
export class NoteDialogComponent implements OnInit {
    form: FormGroup;
    loader: Subscription;
    loading = false;
    note: Note = new Note();
    isEdit = false;

    constructor(
      private service: NoteService,
      private lookupService: LookupService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<NoteDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: MatDialog) {
          if (data && data.note) {
            this.note = data.note;
            this.isEdit = true;
          }
    }

    ngOnInit() {
        this.form = this.fb.group({
            title: this.fb.control(this.note.title, Validators.required),
            content: this.fb.control(this.note.content, Validators.required),
        });
    }

    cancel() {
      this.dialogRef.close();
    }

    saveNote() {
        this.loading = true;
        this.note.title = this.form.value.title;
        this.note.content = this.form.value.content;
        this.loader = this.save()
            .subscribe(
                res => {
                    this.loading = false;
                    this.dialogRef.close(res);
                },
                err => this.loading = false
            );
    }

    private save() : Observable<Note> {
        return this.isEdit ? this.service.updateNote(this.note) : this.service.createNote(this.note);
    }
}
