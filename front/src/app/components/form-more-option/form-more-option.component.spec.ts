import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormMoreOptionComponent } from './form-more-option.component'

describe('FormMoreOptionComponent', () => {
  let component: FormMoreOptionComponent
  let fixture: ComponentFixture<FormMoreOptionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMoreOptionComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(FormMoreOptionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
