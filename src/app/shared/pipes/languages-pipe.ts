import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService,Translations } from '../../core/services/language';

@Pipe({
  name: 'translate',
  pure: false 
})
export class LanguagesPipe implements PipeTransform {
  private lang = inject(LanguageService);

  transform(key: keyof Translations): string{
    return this.lang.t()[key] ?? key;
  }
}