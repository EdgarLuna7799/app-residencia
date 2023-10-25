import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitanuevaPage } from './citanueva.page';

const routes: Routes = [
  {
    path: '',
    component: CitanuevaPage
  },
  {
    path: 'buscarexpedientes',
    loadChildren: () => import('./buscarexpedientes/buscarexpedientes.module').then( m => m.BuscarexpedientesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitanuevaPageRoutingModule {}
