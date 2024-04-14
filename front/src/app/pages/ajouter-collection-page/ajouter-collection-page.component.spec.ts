import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCollectionPageComponent } from './ajouter-collection-page.component';

describe('AjouterCollectionPageComponent', () => {
  let component: AjouterCollectionPageComponent;
  let fixture: ComponentFixture<AjouterCollectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterCollectionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterCollectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
