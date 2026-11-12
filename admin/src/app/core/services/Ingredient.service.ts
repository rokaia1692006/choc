import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import { Ingredient, RecipeProductDraft } from '../models/Ingredient.model';

@Injectable({ providedIn: 'root' })
export class IngredientService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/admin';

  list(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.api}/ingredients`);
  }

  create(i: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.api}/ingredients`, i);
  }

  update(i: Ingredient): Observable<void> {
    return this.http.put<void>(`${this.api}/ingredients/${i.id}`, i);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/ingredients/${id}`);
  }

  createProductFromRecipe(d: RecipeProductDraft): Observable<{ id: number; price: number }> {
    return this.http.post<{ id: number; price: number }>(`${this.api}/products/from-recipe`, d);
  }
}