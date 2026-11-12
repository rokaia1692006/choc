import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-line',
  templateUrl: './error-line.html',
  styleUrl: './error-line.css',
})
export class ErrorLine {
  message = input('');
}