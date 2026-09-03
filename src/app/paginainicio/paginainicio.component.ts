import { Component } from '@angular/core';
import { PlatoestrellaComponent } from "../platoestrella/platoestrella.component";
import { BebidaestrellaComponent } from "../bebidaestrella/bebidaestrella.component";

@Component({
  selector: 'app-paginainicio',
  standalone: true,
  imports: [PlatoestrellaComponent, BebidaestrellaComponent],
  templateUrl: './paginainicio.component.html',
  styleUrl: './paginainicio.component.css'
})
export class PaginainicioComponent {

}
