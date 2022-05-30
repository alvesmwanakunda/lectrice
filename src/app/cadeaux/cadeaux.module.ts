import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CadeauxPageRoutingModule } from './cadeaux-routing.module';
import { CadeauxPage } from './cadeaux.page';
import { SharedModule } from '../shared/shared.module';
//import { DataAsAgoPipe } from '../shared/pipes/data-as-ago.pipe';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { CalendarModule } from 'ion2-calendar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadeauxPageRoutingModule,
    SharedModule,
    CalendarModule
  ],
  declarations: [CadeauxPage],
  providers:[EntrepriseService,{provide:LOCALE_ID, useValue:'fr-FR'}]
})
export class CadeauxPageModule {}
