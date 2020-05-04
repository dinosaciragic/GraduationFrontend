import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from '../components/checkout/checkout.component';

@NgModule({
    exports: [

    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    entryComponents: [
        CheckoutComponent
    ],
    declarations: [
        CheckoutComponent
    ],
    providers: [

    ]
})
export class CheckoutSharedModule { }