import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ElementDetailPageComponent } from './element-detail-page.component'

describe('ElementDetailPageComponent', () => {
  let component: ElementDetailPageComponent
  let fixture: ComponentFixture<ElementDetailPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementDetailPageComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(ElementDetailPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
