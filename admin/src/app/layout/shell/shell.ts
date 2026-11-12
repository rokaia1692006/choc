import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-shell', imports: [RouterOutlet, RouterLink, RouterLinkActive], templateUrl: './shell.html', styleUrl: './shell.css' })
export class Shell {
  auth = inject(AuthService);
  private router = inject(Router);
  logout() { this.auth.logout().subscribe({ complete: () => this.router.navigate(['/login']), error: () => this.router.navigate(['/login']) }); }
}
