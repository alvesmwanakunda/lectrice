import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AchatsPageRoutingModule } from './achats-routing.module';
import { AchatsPage } from './achats.page';
import { SharedModule } from '../shared/shared.module';
//import { DataAsAgoPipe } from '../shared/pipes/data-as-ago.pipe';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { CalendarModule } from 'ion2-calendar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AchatsPageRoutingModule,
    SharedModule,
    CalendarModule
  ],
  declarations: [AchatsPage],
  providers:[EntrepriseService,{provide:LOCALE_ID, useValue:'fr-FR'}]
})
export class AchatsPageModule {}
