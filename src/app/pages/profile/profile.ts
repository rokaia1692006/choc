import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  auth = inject(AuthService);
  router = inject(Router);
  editing = signal(false);
  saved = signal(false);

  form = {
    name: this.auth.user()?.name || '',
    phone: this.auth.user()?.phone || '',
    address: this.auth.user()?.address || '',
    city: this.auth.user()?.city || '',
    apartment: this.auth.user()?.apartment || '',
  };

  save() {
    this.auth.updateProfile(this.form);
    this.editing.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
  forgetPass() {
    this.router.navigate(['forgetpass']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}