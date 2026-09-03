import { Routes } from '@angular/router';
import { PaginainicioComponent } from './paginainicio/paginainicio.component';
import { ComidasComponent } from './comidas/comidas.component';
import { BebidasComponent } from './bebidas/bebidas.component';
import { PlatoestrellaComponent } from './platoestrella/platoestrella.component';
import { BebidaestrellaComponent } from './bebidaestrella/bebidaestrella.component';
import { FormulariocomidaComponent } from './formulariocomida/formulariocomida.component';
import { FormulariobebidaComponent } from './formulariobebida/formulariobebida.component';
import { JuegoComponent } from './juego/juego.component';
import { PedidoComponent } from './pedido/pedido.component';

export const routes: Routes = [
  { path: "", component: PaginainicioComponent },
  { path: "comidas", component: ComidasComponent },
  { path: "bebidas", component: BebidasComponent },
  { path: "platoestrella", component: PlatoestrellaComponent },
  { path: "bebida", component: BebidaestrellaComponent },
  { path: "formulariocomida", component: FormulariocomidaComponent },
  { path: "formulariobebida", component: FormulariobebidaComponent },
  { path: "juego", component: JuegoComponent },
  { path: "pedido", component: PedidoComponent }
];







