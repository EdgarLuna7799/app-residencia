import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmaPage } from './confirma.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmaPageRoutingModule {}
