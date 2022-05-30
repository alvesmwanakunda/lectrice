import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VisitesPageRoutingModule } from './visites-routing.module';
import { VisitesPage } from './visites.page';
import { SharedModule } from '../shared/shared.module';
import { EntrepriseService } from '../shared/services/entreprise.service';
//import { DataAsAgoPipe } from '../shared/pipes/data-as-ago.pipe';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitesPageRoutingModule,
    SharedModule,
    CalendarModule
  ],
  declarations: [VisitesPage],
  providers:[EntrepriseService,{provide:LOCALE_ID, useValue:'fr-FR'}]
})
export class VisitesPageModule {}
