import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestExpedientesPageRoutingModule } from './test-expedientes-routing.module';

import { TestExpedientesPage } from './test-expedientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestExpedientesPageRoutingModule
  ],
  declarations: [TestExpedientesPage]
})
export class TestExpedientesPageModule {}
