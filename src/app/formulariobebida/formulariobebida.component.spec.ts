import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariobebidaComponent } from './formulariobebida.component';

describe('FormulariobebidaComponent', () => {
  let component: FormulariobebidaComponent;
  let fixture: ComponentFixture<FormulariobebidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulariobebidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormulariobebidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
