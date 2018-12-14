import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

import { DocumentsManagementRoutingModule } from './documents-management-routing.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentDialogComponent } from './document-dialog/document-dialog.component';

@NgModule({
  declarations: [DocumentListComponent, DocumentDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    DocumentsManagementRoutingModule
  ],
  entryComponents: [DocumentDialogComponent]
})
export class DocumentsManagementModule { }
