import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadeauxPage } from './cadeaux.page';

const routes: Routes = [
  {
    path: '',
    component: CadeauxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadeauxPageRoutingModule {}
