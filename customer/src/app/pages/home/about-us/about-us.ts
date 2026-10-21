import { Component } from '@angular/core';
import { CurrencyService } from '../../../core/services/currency';
import { LanguageService } from '../../../core/services/language';
import { LanguagesPipe } from '../../../shared/pipes/languages-pipe';
import { CurrencyPipe } from '../../../shared/pipes/currency-pipe';
@Component({
  selector: 'app-about-us',
  imports: [LanguagesPipe],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUS {}
