import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { PasswordPageRoutingModule } from './password-routing.module';
import { PasswordPage } from './password.page';
import { AuthService } from '../shared/services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [PasswordPage],
  providers:[AuthService]
})
export class PasswordPageModule {}
