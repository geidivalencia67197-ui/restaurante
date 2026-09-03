import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { FormulariobebidaComponent } from '../formulariobebida/formulariobebida.component';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulariobebidaComponent],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {

  private baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1';
  private preciosCache = new Map<string, number>();

  bebidas: any[] = [];
  cargando = false;
  mensajeVacio = '';

  nombreBusqueda = '';
  ingredienteBusqueda = '';
  tipoSeleccionado = 'todos';
  categoriaSeleccionada = 'todas';

  categorias: string[] = [];

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarBebidasIniciales();
  }

  getPrecio(idDrink: string): number {
    if (!this.preciosCache.has(idDrink)) {
      const precio = Math.floor(Math.random() * (25000 - 12000 + 1)) + 12000;
      this.preciosCache.set(idDrink, precio);
    }
    return this.preciosCache.get(idDrink)!;
  }

  cargarCategorias(): void {
    this.http.get<any>(`${this.baseUrl}/list.php?c=list`).subscribe((res: any) => {
      this.categorias = (res.drinks || []).map((c: any) => c.strCategory);
    });
  }

  cargarBebidasIniciales(): void {
    this.cargando = true;
    this.http.get<any>(`${this.baseUrl}/filter.php?c=Cocktail`).subscribe((res: any) => {
      const basicos = (res.drinks || []).slice(0, 9);
      this.traerDetalleDeVarios(basicos);
    });
  }

  buscarPorNombre(): void {
    if (!this.nombreBusqueda.trim()) return;
    this.cargando = true;
    this.http.get<any>(`${this.baseUrl}/search.php?s=${this.nombreBusqueda}`)
      .subscribe((res: any) => {
        this.bebidas = res.drinks || [];
        this.mensajeVacio = this.bebidas.length === 0 ? 'No se encontraron bebidas con ese nombre.' : '';
        this.cargando = false;
      });
  }

  buscarPorIngrediente(): void {
    if (!this.ingredienteBusqueda.trim()) return;
    this.cargando = true;
    this.http.get<any>(`${this.baseUrl}/filter.php?i=${this.ingredienteBusqueda}`)
      .subscribe((res: any) => {
        const basicos = (res.drinks || []).slice(0, 12);
        if (basicos.length === 0) {
          this.bebidas = [];
          this.mensajeVacio = 'No se encontraron bebidas con ese ingrediente.';
          this.cargando = false;
          return;
        }
        this.traerDetalleDeVarios(basicos);
      });
  }

  filtrarPorTipo(): void {
    if (this.tipoSeleccionado === 'todos') {
      this.cargarBebidasIniciales();
      return;
    }
    this.cargando = true;
    this.http.get<any>(`${this.baseUrl}/filter.php?a=${this.tipoSeleccionado}`)
      .subscribe((res: any) => {
        const basicos = (res.drinks || []).slice(0, 12);
        this.traerDetalleDeVarios(basicos);
      });
  }

  filtrarPorCategoria(): void {
    if (this.categoriaSeleccionada === 'todas') {
      this.cargarBebidasIniciales();
      return;
    }
    this.cargando = true;
    this.http.get<any>(`${this.baseUrl}/filter.php?c=${this.categoriaSeleccionada}`)
      .subscribe((res: any) => {
        const basicos = (res.drinks || []).slice(0, 12);
        this.traerDetalleDeVarios(basicos);
      });
  }

  private traerDetalleDeVarios(basicos: any[]): void {
    if (basicos.length === 0) {
      this.bebidas = [];
      this.mensajeVacio = 'No se encontraron bebidas.';
      this.cargando = false;
      return;
    }
    const peticiones: Observable<any>[] = basicos.map((b: any) =>
      this.http.get<any>(`${this.baseUrl}/lookup.php?i=${b.idDrink}`)
    );
    (forkJoin(peticiones) as Observable<any[]>).subscribe((detalles: any[]) => {
      this.bebidas = detalles
        .filter((d: any) => d && d.drinks && d.drinks[0])
        .map((d: any) => d.drinks[0]);
      this.mensajeVacio = this.bebidas.length === 0 ? 'No se encontraron bebidas.' : '';
      this.cargando = false;
    });
  }

  getIngredientes(drink: any): string {
    const partes: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ing = drink[`strIngredient${i}`];
      const medida = drink[`strMeasure${i}`];
      if (ing && ing.trim()) {
        partes.push(medida && medida.trim() ? `${ing} (${medida})` : ing);
      }
    }
    return partes.join(', ');
  }

  agregarAlCarrito(drink: any): void {
    const precio = this.getPrecio(drink.idDrink);
    this.carritoService.agregarProducto(drink.strDrink, precio, drink.strDrinkThumb);
  }
}