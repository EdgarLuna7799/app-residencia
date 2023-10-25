import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },  
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'expedientes',
    loadChildren: () => import('./expedientes/expedientes.module').then( m => m.ExpedientesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'agenda',
    loadChildren: () => import('./agenda/agenda/agenda.module').then( m => m.AgendaPageModule)
  },
  {
    path: 'confirma',
    loadChildren: () => import('./agenda/confirma/confirma.module').then( m => m.ConfirmaPageModule)
  },
  {
    path: 'ingresos',
    loadChildren: () => import('./ingresos/ingresos/ingresos.module').then( m => m.IngresosPageModule)
  },
  {
    path: 'test-expedientes',
    loadChildren: () => import('./test-expedientes/test-expedientes.module').then( m => m.TestExpedientesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
