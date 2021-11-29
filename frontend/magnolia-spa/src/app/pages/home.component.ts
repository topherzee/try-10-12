import { Component, Input } from '@angular/core';

@Component({
  template: `<div>
    <h1>{{ title }}</h1>
    <div editable-area [content]="main"></div>
  </div>`,
})
export class HomeComponent {
  @Input() title: any;
  @Input() main: any;
}
