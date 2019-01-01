import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SafePipe } from './safe';

const PIPES = [
    SafePipe
];

@NgModule({
  imports: [CommonModule],
  exports: PIPES,
  declarations: PIPES
})
export class PipesModule { }
