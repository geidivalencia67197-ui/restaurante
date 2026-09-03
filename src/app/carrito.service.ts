import { Injectable, signal } from '@angular/core';

export interface ItemCarrito {
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsSignal = signal<ItemCarrito[]>([]);
  items = this.itemsSignal.asReadonly();

  agregarProducto(nombre: string, precio: number, imagenUrl?: string): void {
    const actuales = this.itemsSignal();
    const existente = actuales.find(i => i.nombre === nombre);

    if (existente) {
      this.itemsSignal.set(
        actuales.map(i => i.nombre === nombre ? { ...i, cantidad: i.cantidad + 1 } : i)
      );
    } else {
      this.itemsSignal.set([...actuales, { nombre, precio, cantidad: 1, imagenUrl }]);
    }
  }

  eliminarProducto(nombre: string): void {
    this.itemsSignal.set(this.itemsSignal().filter(i => i.nombre !== nombre));
  }

  vaciarCarrito(): void {
    this.itemsSignal.set([]);
  }

  getTotal(): number {
    return this.itemsSignal().reduce((t, i) => t + i.precio * i.cantidad, 0);
  }
}