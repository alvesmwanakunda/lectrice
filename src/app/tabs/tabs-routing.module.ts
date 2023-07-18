import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path:"dashboard",
        loadChildren:()=>import('../dashboard/dashboard.module').then(m=>m.DashboardPageModule)
      },
      {
        path:"visites",
        loadChildren:()=>import('../visites/visites.module').then(m=>m.VisitesPageModule)
      },
      {
        path:"achats",
        loadChildren:()=>import('../achats/achats.module').then(m=>m.AchatsPageModule)
      },
      {
        path:"cadeaux",
        loadChildren:()=>import('../cadeaux/cadeaux.module').then(m=>m.CadeauxPageModule)
      },
      {
        path:"avoirs",
        loadChildren:()=>import('../avoirs/avoirs.module').then(m=>m.AvoirsPageModule)
      },
      {
        path:"profile",
        loadChildren:()=>import('../profile/profile.module').then(m=>m.ProfilePageModule)
      },
      {
        path: 'promotions',
        loadChildren: () => import('../promotions/promotions.module').then( m => m.PromotionsPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
