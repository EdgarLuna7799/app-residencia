import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaPage } from './agenda.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaPage
  },{
    path: 'detalle',
    loadChildren: () => import('../detalle/detalle.module').then( m => m.DetallePageModule)
  },
  {
    path: 'evento',
    loadChildren: () => import('../../agenda/nuevo/evento/evento.module').then( m => m.EventoPageModule)
  },
  {
    path: 'detalle-evento',
    loadChildren: () => import('../../agenda/detalle-evento/detalle-evento.module').then( m => m.DetalleEventoPageModule)
  },
  {
    path: 'citanueva',
    loadChildren: () => import('../../agenda/nuevo/citanueva/citanueva.module').then( m => m.CitanuevaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaPageRoutingModule {}
