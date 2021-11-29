import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { MagnoliaModule } from '@magnolia/angular-editor';
// import { EditorContextService } from '@magnolia/angular-editor';
import { HomeComponent } from './pages/home.component';
import { ContactComponent } from './pages/contact.component';
import { TextComponent } from './components/text.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, ContactComponent, TextComponent],
  imports: [BrowserModule, MagnoliaModule],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [HomeComponent, ContactComponent, TextComponent],
})
export class AppModule {}
