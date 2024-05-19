import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormCollectionComponent } from './form-collection.component'

describe('FormCollectionComponent', () => {
  let component: FormCollectionComponent
  let fixture: ComponentFixture<FormCollectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCollectionComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(FormCollectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  
})
