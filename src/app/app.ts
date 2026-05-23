import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { ContactusFooter } from './shared/components/contactus-footer/contactus-footer';
import { VariantPicker } from './shared/components/variant-picker/variant-picker';
import { PickerService } from './core/services/picker';
import { LanguageService } from './core/services/language';
import {inject} from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ContactusFooter,VariantPicker],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  pickerService = inject(PickerService);
  protected readonly title = signal('choooc');
  lang = inject(LanguageService);
  constructor() {
    this.lang.init();
  }
}

