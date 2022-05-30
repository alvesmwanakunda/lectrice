import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvoirsPageRoutingModule } from './avoirs-routing.module';
import { AvoirsPage } from './avoirs.page';
import { SharedModule } from '../shared/shared.module';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { CalendarModule } from 'ion2-calendar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvoirsPageRoutingModule,
    SharedModule,
    CalendarModule
  ],
  declarations: [AvoirsPage],
  providers:[EntrepriseService,{provide:LOCALE_ID, useValue:'fr-FR'}]
})
export class AvoirsPageModule {}
