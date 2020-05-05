import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { OrdersComponent } from 'src/app/components/orders/orders.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { SingleOrderComponent } from 'src/app/components/single-order/single-order.component';
import { CheckoutSharedModule } from 'src/app/shared/checkout-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    CheckoutSharedModule
  ],
  entryComponents: [
    OrdersComponent,
    SettingsComponent,
    SingleOrderComponent
  ],
  declarations: [
    HomePage,
    OrdersComponent,
    SettingsComponent,
    SingleOrderComponent
  ]
})
export class HomePageModule { }
