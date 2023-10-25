import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitanuevaPageRoutingModule } from './citanueva-routing.module';

import { CitanuevaPage } from './citanueva.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitanuevaPageRoutingModule,
    ReactiveFormsModule
    
  ],
  declarations: [CitanuevaPage]
})
export class CitanuevaPageModule {}
