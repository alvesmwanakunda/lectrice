import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewPasswordPageRoutingModule } from './new-password-routing.module';
import { NewPasswordPage } from './new-password.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPasswordPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [NewPasswordPage],
  providers:[AuthService]
})
export class NewPasswordPageModule {}
