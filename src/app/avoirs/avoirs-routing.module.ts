import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvoirsPage } from './avoirs.page';

const routes: Routes = [
  {
    path: '',
    component: AvoirsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvoirsPageRoutingModule {}
