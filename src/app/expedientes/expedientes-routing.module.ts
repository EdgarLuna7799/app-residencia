import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpedientesPage } from './expedientes.page';

const routes: Routes = [
  {
    path: '',
    component: ExpedientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpedientesPageRoutingModule {}
