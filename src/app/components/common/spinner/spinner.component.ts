import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  styleUrls: ['./spinner.component.scss'],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit {
  @Input() loader: Subscription;
  @Input() top: boolean;
  @Input() diameter = 100;

  @HostBinding('style.position')
  position = 'static';

  constructor() { }

  ngOnInit() {
    if (this.top === true) {
        this.position = 'absolute';
    }
  }
}
