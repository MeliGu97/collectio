import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurDetailPageComponent } from './utilisateur-detail-page.component';

describe('UtilisateurDetailPageComponent', () => {
  let component: UtilisateurDetailPageComponent;
  let fixture: ComponentFixture<UtilisateurDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurDetailPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilisateurDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
