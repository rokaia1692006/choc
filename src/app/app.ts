import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { ContactusFooter } from './shared/components/contactus-footer/contactus-footer';
import { VariantPicker } from './shared/components/variant-picker/variant-picker';
import { PickerService } from './core/services/picker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ContactusFooter,VariantPicker],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('choooc');
  constructor(public pickerService: PickerService) {}
}

