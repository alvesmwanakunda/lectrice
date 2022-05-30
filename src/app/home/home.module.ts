import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    HomePageRoutingModule,
    RouterModule
  ],
  declarations: [HomePage],
  providers:[AuthService]
})
export class HomePageModule {}
