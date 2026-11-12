import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/product.model';

@Component({ selector: 'app-categories', imports: [ReactiveFormsModule], templateUrl: './categories.html', styleUrl: './categories.css' })
export class Categories implements OnInit {
  private svc = inject(CategoryService);
  private fb = inject(FormBuilder);
  items = signal<Category[]>([]);
  editing = signal<number | null>(null);
  error = signal('');
  form = this.fb.nonNullable.group({ name: ['', Validators.required], nameAr: ['', Validators.required], sortOrder: 0, isActive: true });

  ngOnInit() { this.load(); }
  load() { this.svc.list().subscribe({ next: c => this.items.set(c), error: () => this.error.set('Could not load categories.') }); }
  edit(c: Category) { this.editing.set(c.id); this.form.patchValue({ name: c.name, nameAr: c.nameAr, sortOrder: c.sortOrder ?? 0, isActive: c.isActive ?? true }); }
  reset() { this.editing.set(null); this.form.reset({ name: '', nameAr: '', sortOrder: 0, isActive: true }); }
  save() {
    if (this.form.invalid) return;
    const id = this.editing();
    const req = id ? this.svc.update(id, this.form.getRawValue()) : this.svc.create(this.form.getRawValue());
    req.subscribe({ next: () => { this.reset(); this.load(); }, error: () => this.error.set('Could not save the category.') });
  }
  remove(c: Category) {
    if (!confirm(`Delete "${c.name}"? Products in it will need a new category.`)) return;
    this.svc.remove(c.id).subscribe({ next: () => this.load(), error: () => this.error.set('Could not delete. Move its products to another category first.') });
  }
}
