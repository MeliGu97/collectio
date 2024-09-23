import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurPageFavorisComponent } from './utilisateur-page-favoris.component';

describe('UtilisateurPageFavorisComponent', () => {
  let component: UtilisateurPageFavorisComponent;
  let fixture: ComponentFixture<UtilisateurPageFavorisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurPageFavorisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilisateurPageFavorisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
