import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Casilla {
  id: number;
  tipo: 'plato' | 'bebida' | 'vacio';
  imagen: string;
  revelada: boolean;
}

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

  tablero: Casilla[] = [];
  seleccionadas: Casilla[] = [];

 
  imagenOculta: string = "assets/juegoP/logo.png";
  imagenPlato: string = "assets/juegoP/comid.jpg";
  imagenBebida: string = "assets/juegoP/beb.jpg";

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.tablero = [];
    this.seleccionadas = [];

    
    for (let i = 0; i < 16; i++) {
      this.tablero.push({
        id: i,
        tipo: 'vacio',
        imagen: this.imagenOculta,
        revelada: false
      });
    }

    
    const posPlato = Math.floor(Math.random() * 16);
    let posBebida = Math.floor(Math.random() * 16);

    while (posBebida === posPlato) {
      posBebida = Math.floor(Math.random() * 16);
    }

    
    this.tablero[posPlato].tipo = 'plato';
    this.tablero[posBebida].tipo = 'bebida';
  }

  descubrir(i: number): void {
    const casilla = this.tablero[i];

    
    if (casilla.revelada || this.seleccionadas.length >= 2) {
      return;
    }

    casilla.revelada = true;

   
    if (casilla.tipo === 'plato') {
      casilla.imagen = this.imagenPlato;
    } else if (casilla.tipo === 'bebida') {
      casilla.imagen = this.imagenBebida;
    }

    this.seleccionadas.push(casilla);

    
    if (this.seleccionadas.length === 2) {
      const tienePlato = this.seleccionadas.some(c => c.tipo === 'plato');
      const tieneBebida = this.seleccionadas.some(c => c.tipo === 'bebida');

      if (tienePlato && tieneBebida) {
        setTimeout(() => {
          alert('¡Excelente! Encontraste el plato y la bebida. Se reiniciará en nuevas posiciones.');
          this.iniciarJuego();
        }, 500);
      } else {
        
        setTimeout(() => {
          this.seleccionadas.forEach(c => {
            c.revelada = false;
            c.imagen = this.imagenOculta;
          });
          this.seleccionadas = [];
        }, 1000);
      }
    }
  }
}