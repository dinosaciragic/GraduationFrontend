import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SinglerestaurantPage } from './singlerestaurant.page';

describe('SinglerestaurantPage', () => {
  let component: SinglerestaurantPage;
  let fixture: ComponentFixture<SinglerestaurantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglerestaurantPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SinglerestaurantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
