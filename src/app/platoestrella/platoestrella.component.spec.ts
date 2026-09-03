import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatoestrellaComponent } from './platoestrella.component';

describe('PlatoestrellaComponent', () => {
  let component: PlatoestrellaComponent;
  let fixture: ComponentFixture<PlatoestrellaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatoestrellaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlatoestrellaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
