import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordPage } from './password.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordPage
  },
  {
    path: 'reset/:phone',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'new-password/:phone/:code',
    loadChildren: () => import('./new-password/new-password.module').then( m => m.NewPasswordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordPageRoutingModule {}
