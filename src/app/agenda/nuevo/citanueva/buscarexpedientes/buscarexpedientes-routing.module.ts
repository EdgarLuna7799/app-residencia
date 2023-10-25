import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarexpedientesPage } from './buscarexpedientes.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarexpedientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarexpedientesPageRoutingModule {}
