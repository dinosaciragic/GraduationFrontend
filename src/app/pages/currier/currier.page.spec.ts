import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CurrierPage } from './currier.page';

describe('CurrierPage', () => {
  let component: CurrierPage;
  let fixture: ComponentFixture<CurrierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrierPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
