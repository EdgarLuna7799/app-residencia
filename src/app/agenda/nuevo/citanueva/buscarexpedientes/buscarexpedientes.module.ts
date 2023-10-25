import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarexpedientesPageRoutingModule } from './buscarexpedientes-routing.module';

import { BuscarexpedientesPage } from './buscarexpedientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarexpedientesPageRoutingModule
  ],
  declarations: [BuscarexpedientesPage]
})
export class BuscarexpedientesPageModule {}
