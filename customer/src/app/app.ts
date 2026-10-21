import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { ContactusFooter } from './shared/components/contactus-footer/contactus-footer';
import { VariantPicker } from './shared/components/variant-picker/variant-picker';
import { PickerService } from './core/services/picker';
import { LanguageService } from './core/services/language';
import { DescriptionService } from './core/services/description';
import {inject} from '@angular/core';
import { ProductDiscription } from './shared/components/product-discription/product-discription';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ContactusFooter,VariantPicker,ProductDiscription],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  pickerService = inject(PickerService);
   descriptionService = inject(DescriptionService);
  protected readonly title = signal('choooc');
  lang = inject(LanguageService);
  constructor() {
    this.lang.init();
  }
}

