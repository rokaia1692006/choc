import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/themechange';
import { Hero } from "./hero/hero";
import { AboutUS } from './about-us/about-us';
import { FeatureProductCarrousel } from '../../shared/components/feature-product-carrousel/feature-product-carrousel';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, AboutUS, FeatureProductCarrousel],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor(public theme: ThemeService) {}
}