import { TestBed } from '@angular/core/testing'

import { PeriodeService } from './periode.service'

describe('PeriodeService', () => {
  let service: PeriodeService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(PeriodeService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
