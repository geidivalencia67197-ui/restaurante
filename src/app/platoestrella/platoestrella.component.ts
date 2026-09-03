import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-platoestrella',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './platoestrella.component.html',
  styleUrls: ['./platoestrella.component.css']
})
export class PlatoestrellaComponent implements OnInit {

  plato: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://www.themealdb.com/api/json/v1/1/random.php')
      .subscribe((res: any) => {
        if (res && res.meals) {
          const comida = res.meals[0];
          this.plato = {
            nombre: comida.strMeal,
            categoria: comida.strCategory,
            imagen: comida.strMealThumb,
            instrucciones: comida.strInstructions
          };
        }
      });
  }
}