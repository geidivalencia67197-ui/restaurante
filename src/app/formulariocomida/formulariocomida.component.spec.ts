import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariocomidaComponent } from './formulariocomida.component';

describe('FormulariocomidaComponent', () => {
  let component: FormulariocomidaComponent;
  let fixture: ComponentFixture<FormulariocomidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulariocomidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormulariocomidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
