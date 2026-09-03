import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bebidaestrella',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bebidaestrella.component.html',
  styleUrls: ['./bebidaestrella.component.css']
})
export class BebidaestrellaComponent implements OnInit {

  bebida: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://www.thecocktaildb.com/api/json/v1/1/random.php')
      .subscribe((res: any) => {
        if (res && res.drinks) {
          const item = res.drinks[0];
          this.bebida = {
            nombre: item.strDrink,
            categoria: item.strCategory,
            imagen: item.strDrinkThumb,
            instrucciones: item.strInstructions
          };
        }
      });
  }
}
