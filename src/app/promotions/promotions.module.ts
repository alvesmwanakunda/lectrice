import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PromotionsPageRoutingModule } from './promotions-routing.module';
import { PromotionsPage } from './promotions.page';
import { SharedModule } from '../shared/shared.module';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import {QRCodeModule } from 'angularx-qrcode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotionsPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  declarations: [PromotionsPage],
  providers:[EntrepriseService, QRScanner,BarcodeScanner]
})
export class PromotionsPageModule {}
