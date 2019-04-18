import { NgModule } from '@angular/core';

import { EnforcedInputsDirective } from './enforced-inputs.directive';
import { UpperCaseDirective } from './upper-case.directive';

const DECLARE_AND_EXPORT = [ EnforcedInputsDirective, UpperCaseDirective ];

@NgModule({
  declarations: DECLARE_AND_EXPORT,
  exports: DECLARE_AND_EXPORT,
})
export class DirectivesModule { }
