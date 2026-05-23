import { Component, ViewEncapsulation, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/themechange';
import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  encapsulation: ViewEncapsulation.None
})
export class Navbar {
  drawerOpen = false;
  auth = inject(AuthService);

  constructor(public theme: ThemeService, public cartService: CartService) {}

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.drawerOpen) this.drawerOpen = false;
  }

  onToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked !== this.theme.isDark()) this.theme.toggle();
  }

  toggleDrawer() { this.drawerOpen = !this.drawerOpen; }
  closeDrawer() { this.drawerOpen = false; }
}