import { NgModule } from '@angular/core';

import { EnforcedInputsDirective } from './enforced-inputs/enforced-inputs.directive';

const DECLARE_AND_EXPORT = [ EnforcedInputsDirective ];

@NgModule({
  declarations: DECLARE_AND_EXPORT,
  exports: DECLARE_AND_EXPORT,
})
export class DirectivesModule { }
