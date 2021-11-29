import { Component, Input } from '@angular/core';
import { EditorContextService } from '@magnolia/angular-editor';
import { HomeComponent } from './pages/home.component';
import { ContactComponent } from './pages/contact.component';
import { TextComponent } from './components/text.component';

const config = {
  componentMapping: {
    'spa:pages/Home': HomeComponent,
    'spa:pages/Contact': ContactComponent,
    'spa:components/Text': TextComponent,
  },
};

@Component({
  selector: 'app-root',
  template: `<editable-page [content]="content"></editable-page>`,
  styles: [],
})
export class AppComponent {
  @Input() content: any;

  constructor(private editorContext: EditorContextService) {
    this.editorContext.setComponentMapping(config.componentMapping);
    this.getContent();
  }

  async getContent() {
    let templateAnnotations;
    const nodeName = '/spa-home';
    const nodePath =
      nodeName +
      window.location.pathname.replace(
        new RegExp('(.*' + nodeName + '|.html)', 'g'),
        ''
      );

    const contentRes = await fetch('http://localhost:8080/.rest/pages' + nodePath);
    const content = await contentRes.json();

    console.log("CLZ 1")
    if (true || this.editorContext.inEditor()) {
      console.log("CLZ inEditor")
      const templateAnnotationsRes = await fetch(
        'http://localhost:8080/.rest/template-annotations/v1' + nodePath
      );

      templateAnnotations = await templateAnnotationsRes.json();
    }
    console.log("CLZ 2")

    console.log(templateAnnotations);

    if (templateAnnotations)
      this.editorContext.setTemplateAnnotations(templateAnnotations);

    this.content = content;
  }
}
