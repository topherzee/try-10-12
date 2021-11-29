import { Component, Input } from '@angular/core';

@Component({
  template: `<div>
    <h1>{{ title }}</h1>
    <h2>ContactComponent</h2>
    <div editable-area [content]="main"></div>
  </div>`,
})
export class ContactComponent {
  @Input() title: any;
  @Input() main: any;
}
