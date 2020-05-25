import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-shop',
  templateUrl: './single-shop.page.html',
  styleUrls: ['./single-shop.page.scss'],
})
export class SingleShopPage implements OnInit {

  shopName: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.shopName = this.router.getCurrentNavigation().extras.state.shopName;
    console.log('name shop', this.shopName)
  }

}
