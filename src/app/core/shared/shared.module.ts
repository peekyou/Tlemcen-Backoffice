import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { DndModule } from 'ngx-drag-drop';

import { AppMaterialModules } from './material.module';
import { DirectivesModule } from '../directives';
import { PipesModule } from '../pipes';

const IMPORTS = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    NgxPaginationModule,
    DndModule,
    AppMaterialModules,
    DirectivesModule,
    PipesModule
];

const DECLARATIONS = [
    
];

@NgModule({
  imports: [IMPORTS],
  exports: [IMPORTS, ...DECLARATIONS],
  declarations: [DECLARATIONS]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
      return {
          ngModule: SharedModule,
          providers: []
      };
  }
}