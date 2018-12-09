import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

import { DocumentsManagementRoutingModule } from './documents-management-routing.module';
import { DocumentListComponent } from './document-list/document-list.component';

@NgModule({
  declarations: [DocumentListComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    DocumentsManagementRoutingModule
  ]
})
export class DocumentsManagementModule { }
