import { TestBed } from '@angular/core/testing'

import { UneService } from './une.service'

describe('UneService', () => {
  let service: UneService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(UneService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
