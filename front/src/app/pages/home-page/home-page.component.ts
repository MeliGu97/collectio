import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Dialog } from '@angular/cdk/dialog'
import { FormsModule } from '@angular/forms'

import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { LoginComponent } from '../../components/login/login.component'

import { UneService } from '../../services/une.service'
import { CollectionService } from '../../services/collection.service'
import { FilterPipeCollection } from '../../services/filterByText.pipe'
import { PeriodeService } from '../../services/periode.service'

export interface DialogData {
  Isinscription: boolean
  IsLog: boolean
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  providers: [
    UneService,
    CollectionService,
    PeriodeService,
    FilterPipeCollection
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [
    CommonModule,
    RouterLink,
    CollectionsComponent,
    FilterPipeCollection,
    FormsModule
  ]
})
export class HomePageComponent implements OnInit {
  collection: any = {}
  collections: any[] = []

  searchTerm: string = ''

  unes: any[] = []
  collectionId: any = {}
  publicCollections: any[] = []
  collectionsAll: any[] = []

  currentPage: number = 1
  totalPages: number = 0

  periodes: any
  selectedPeriodeId: string | undefined

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
      // console.log('Collections récupérées :', this.collections)
    })
    this.periodeService.getPeriodes().subscribe((data) => {
      this.periodes = data
    })
    this.collectionService.getAllPublicCollections().subscribe((data) => {
      this.collectionsAll = data // Stock toutes les coll
      // console.log('Toutes les collections récupérées :', this.collectionsAll)
      this.publicCollections = this.collectionService.makePagination(
        data,
        this.currentPage,
        8
      )
      // console.log('Collections paginées initiales :', this.publicCollections)
      this.totalPages = Math.ceil(data.length / 8)
    })
  }

  loadCollections() {
    this.collectionService.getAllPublicCollections().subscribe((data) => {
      this.collectionsAll = data // Stock toutes les collections
      // console.log(
      //   'Toutes les collections récupérées (après changement de période) :',
      //   this.collectionsAll
      // )
      this.publicCollections = this.collectionService.makePagination(
        data,
        this.currentPage,
        8
      )
      // console.log(
      //   'Collections paginées après changement de période :',
      //   this.publicCollections
      // )
      this.totalPages = Math.ceil(data.length / 8)
    })
  }

  onCheckboxChange(periodeEvent: any) {
    if (periodeEvent.target.checked) {
      this.publicCollections = this.collectionsAll.filter((collection) =>
        collection.periodesId.some(
          (periode: { _id: any }) => periode._id === periodeEvent.target.value
        )
      )
      // Met à jour la pagination directement à partir de la liste filtrée
      this.currentPage = 1
      this.publicCollections = this.collectionService.makePagination(
        this.publicCollections,
        this.currentPage,
        8
      )
      this.totalPages = Math.ceil(this.publicCollections.length / 8)
    } else {
      // console.log('Désélection de la période :', periodeEvent.target.value)
      this.loadCollections()
    }
  }

  onPeriodeChange() {
    this.currentPage = 1 // Réinitialiser la page actuelle lorsque la période change
    this.loadCollections()
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      this.loadCollections()
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.loadCollections()
    }
  }

  openPopupLog(IsInscription: boolean, IsLog: boolean) {
    const dialogRef = this.dialog.open<any>(LoginComponent, {
      data: {
        IsInscription: IsInscription,
        IsLog: IsLog
      }
    })
    dialogRef.closed.subscribe((response: any) => {
      if (response) {
      }
    })
  }
}
