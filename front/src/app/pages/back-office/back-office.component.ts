import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Dialog } from '@angular/cdk/dialog'
import { FormsModule } from '@angular/forms'

import { CollectionService } from '../../services/collection.service'
import { PeriodeService } from '../../services/periode.service'
import { FilterPipe } from '../../services/filterByText.pipe'
import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { UneService } from '../../services/une.service'
import { UtilisateurService } from '../../services/utilisateur.service'

@Component({
  selector: 'app-back-office',
  standalone: true,
  providers: [
    CollectionService,
    PeriodeService,
    FilterPipe,
    UneService,
    UtilisateurService
  ],
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.scss',
  imports: [
    CommonModule,
    RouterLink,
    CollectionsComponent,
    FilterPipe,
    FormsModule
  ]
})
export class BackOfficeComponent implements OnInit {
  collection: any = {}
  collections: any[] = []

  searchTerm: string = ''

  unes: any[] = []
  collectionId: any = {}
  publicCollections: any[] = []

  periodes: any

  constructor(
    private uneService: UneService,
    private collectionService: CollectionService,
    private periodeService: PeriodeService,
    public dialog: Dialog
  ) {}

  ngOnInit() {
    this.uneService.getUnes().subscribe((data) => {
      this.unes = data
      this.collections = this.unes.map((une) => une.collectionId)
    })
    this.periodeService.getPeriodes().subscribe((data) => {
      this.periodes = data
    })
    this.loadCollections()
  }

  loadCollections() {
    this.collectionService.getAllPublicCollections().subscribe((data) => {
      this.publicCollections = data
    })
  }

  onCheckboxChange(periodeEvent: any) {
    if (periodeEvent.target.checked) {
      console.log('publicColl: ', this.publicCollections)
      this.publicCollections = this.publicCollections.filter((collection) =>
        collection.periodesId.some(
          (periode: { _id: any }) => periode._id === periodeEvent.target.value
        )
      )
    } else {
      this.loadCollections()
    }
  }
}
