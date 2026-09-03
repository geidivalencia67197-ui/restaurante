import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BebidaestrellaComponent } from './bebidaestrella.component';

describe('BebidaestrellaComponent', () => {
  let component: BebidaestrellaComponent;
  let fixture: ComponentFixture<BebidaestrellaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BebidaestrellaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BebidaestrellaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
