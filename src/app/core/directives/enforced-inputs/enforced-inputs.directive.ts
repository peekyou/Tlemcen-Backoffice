import { Directive, AfterContentInit, Host, Self, Input } from '@angular/core';
import { MatAutocompleteTrigger, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { NgControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[autoClose]'
})
export class EnforcedInputsDirective implements AfterContentInit {
    subscription: Subscription;

    @Input() matAutocomplete: MatAutocomplete;
    @Input() control: FormControl;

    constructor(@Host() @Self() private readonly autoCompleteTrigger: MatAutocompleteTrigger) {
    }

    ngAfterContentInit() {
        if (this.control === undefined) {
          throw Error('inputCtrl @Input should be provided ')
        }
    
        if (this.matAutocomplete === undefined) {
          throw Error('valueCtrl @Input should be provided ')
        }
    
        setTimeout(() => {
          this.subscribeToClosingActions();
          this.handelSelection();
        }, 0);
      }

    private subscribeToClosingActions(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.autoCompleteTrigger.panelClosingActions
            .subscribe((e) => {
                if (!e || !e.source) {
                    const selected = this.matAutocomplete.options
                        .map(option => option.value)
                        .find(option => option === this.control.value);

                    if (selected == null) {
                        this.control.setValue(null);
                    }
                }
            },
            err => this.subscribeToClosingActions(),
            () => this.subscribeToClosingActions());
    }
        
    private handelSelection() {
        this.matAutocomplete.optionSelected.subscribe((e: MatAutocompleteSelectedEvent) => {
          this.control.setValue(e.option.value);
        });
      }
}