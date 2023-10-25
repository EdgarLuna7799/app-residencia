import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestExpedientesPage } from './test-expedientes.page';

const routes: Routes = [
  {
    path: '',
    component: TestExpedientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestExpedientesPageRoutingModule {}
