import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PharmacyPage } from './pharmacy.page';
import { RouterModule } from '@angular/router';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';
import { CheckoutSharedModule } from 'src/app/shared/checkout-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PharmacyPage
      }
    ]),
    CheckoutSharedModule
  ],
  entryComponents: [
    
  ],
  declarations: [
    PharmacyPage
  ]
})
export class PharmacyPageModule { }
