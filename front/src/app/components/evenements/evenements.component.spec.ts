import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementsComponent } from './evenements.component';

describe('EvenementsComponent', () => {
  let component: EvenementsComponent;
  let fixture: ComponentFixture<EvenementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvenementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvenementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
