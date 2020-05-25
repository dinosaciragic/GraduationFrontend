import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleShopPage } from './single-shop.page';

describe('SingleShopPage', () => {
  let component: SingleShopPage;
  let fixture: ComponentFixture<SingleShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
