import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})
export class ShopsPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateToBook() {
    let navigationExtras: NavigationExtras = {
      state: {
        shopName: "BookShop"
      }
    };

    this.router.navigate(['pages', 'single-shop'], navigationExtras);
  }

  navigateToFlower() {
    let navigationExtras: NavigationExtras = {
      state: {
        shopName: "FlowerShop"
      }
    };

    this.router.navigate(['pages', 'single-shop'], navigationExtras);
  }

  navigateToPerfume() {
    let navigationExtras: NavigationExtras = {
      state: {
        shopName: "PerfumeShop"
      }
    };

    this.router.navigate(['pages', 'single-shop'], navigationExtras);
  }

  navigateToTech() {
    let navigationExtras: NavigationExtras = {
      state: {
        shopName: "TechShop"
      }
    };

    this.router.navigate(['pages', 'single-shop'], navigationExtras);
  }

}
