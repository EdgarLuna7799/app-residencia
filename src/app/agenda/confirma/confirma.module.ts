import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmaPageRoutingModule } from './confirma-routing.module';

import { ConfirmaPage } from './confirma.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmaPageRoutingModule
  ],
  declarations: [ConfirmaPage]
})
export class ConfirmaPageModule {}
