import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormulariocomidaComponent } from '../formulariocomida/formulariocomida.component';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulariocomidaComponent],
  templateUrl: './comidas.component.html',
  styleUrls: ['./comidas.component.css']
})
export class ComidasComponent implements OnInit {

  private baseUrl = 'https://www.themealdb.com/api/json/v1/1';
  private preciosCache = new Map<string, number>();

  vista: 'categorias' | 'resultados' = 'categorias';

  categorias: any[] = [];
  comidasPorCategoria: { [key: string]: any[] } = {};

  resultados: any[] = [];
  cargando = false;
  mensajeVacio = '';

  nombreBusqueda = '';
  ingredienteBusqueda = '';

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  getPrecio(idMeal: string): number {
    if (!this.preciosCache.has(idMeal)) {
      const precio = Math.floor(Math.random() * (95000 - 25000 + 1)) + 25000;
      this.preciosCache.set(idMeal, precio);
    }
    return this.preciosCache.get(idMeal)!;
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.http.get<any>(`${this.baseUrl}/categories.php`).subscribe((res: any) => {
      const todas = res.categories || [];
      this.categorias = todas.slice(0, 6);

      this.categorias.forEach((cat: any) => {
        this.http.get<any>(`${this.baseUrl}/filter.php?c=${cat.strCategory}`)
          .subscribe((resComidas: any) => {
            const comidas = resComidas.meals || [];
            this.comidasPorCategoria[cat.strCategory] = comidas.slice(0, 4);
          });
      });
      this.cargando = false;
    });
  }

  buscarPorNombre(): void {
    if (!this.nombreBusqueda.trim()) return;
    this.cargando = true;
    this.vista = 'resultados';

    this.http.get<any>(`${this.baseUrl}/search.php?s=${this.nombreBusqueda}`)
      .subscribe((res: any) => {
        this.resultados = res.meals || [];
        this.mensajeVacio = this.resultados.length === 0 ? 'No se encontraron comidas con ese nombre.' : '';
        this.cargando = false;
      });
  }

  buscarPorIngrediente(): void {
    if (!this.ingredienteBusqueda.trim()) return;
    this.cargando = true;
    this.vista = 'resultados';

    this.http.get<any>(`${this.baseUrl}/filter.php?i=${this.ingredienteBusqueda}`)
      .pipe(
        switchMap((res: any) => {
          const basicos = res.meals || [];
          if (basicos.length === 0) {
            return of([] as any[]);
          }

          const peticiones: Observable<any>[] = basicos.slice(0, 12).map((m: any) =>
            this.http.get<any>(`${this.baseUrl}/lookup.php?i=${m.idMeal}`)
          );
          return forkJoin(peticiones) as Observable<any[]>;
        })
      )
      .subscribe((detalles: any[]) => {
        this.resultados = detalles
          .filter((d: any) => d && d.meals && d.meals[0])
          .map((d: any) => d.meals[0]);
        this.mensajeVacio = this.resultados.length === 0 ? 'No se encontraron comidas con ese ingrediente.' : '';
        this.cargando = false;
      });
  }

  volverACategorias(): void {
    this.vista = 'categorias';
    this.nombreBusqueda = '';
    this.ingredienteBusqueda = '';
  }

  getIngredientes(meal: any): string {
    const partes: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const medida = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        partes.push(medida && medida.trim() ? `${ing} (${medida})` : ing);
      }
    }
    return partes.join(', ');
  }

  agregarAlCarrito(meal: any): void {
    const precio = this.getPrecio(meal.idMeal);
    this.carritoService.agregarProducto(meal.strMeal, precio, meal.strMealThumb);
  }
}