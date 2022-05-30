import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitesPage } from './visites.page';

const routes: Routes = [
  {
    path: '',
    component: VisitesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitesPageRoutingModule {}
