import { Directive, ElementRef } from '@angular/core';;

@Directive({
    selector: '[upperCase]',
    host: {
        '(input)': 'ref.nativeElement.value=$event.target.value.toUpperCase()',
    }
})
export class UpperCaseDirective {
    constructor(private ref: ElementRef) {
    }
}