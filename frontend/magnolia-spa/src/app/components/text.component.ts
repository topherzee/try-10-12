import { Component, Input } from '@angular/core';
 
@Component({
  template: `<div>{{ text }}</div>`,
})
 
export class TextComponent {
  @Input() text: any;
}