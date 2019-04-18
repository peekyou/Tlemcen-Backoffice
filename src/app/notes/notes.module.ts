import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { NotesRoutingModule } from './notes-routing.module';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { NoteListComponent } from './note-list/note-list.component';

@NgModule({
  declarations: [NoteDialogComponent, NoteListComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    NotesRoutingModule
  ],
  entryComponents: [NoteDialogComponent]
})
export class NotesModule { }
