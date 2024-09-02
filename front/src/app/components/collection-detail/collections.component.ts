import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'

import { CollectionService } from '../../services/collection.service'
import { FormCollectionComponent } from '../form-collection/form-collection.component'
import { FormMoreOptionComponent } from '../form-more-option/form-more-option.component'
import { UtilisateurService } from '../../services/utilisateur.service'

@Component({
  selector: 'app-collections',
  standalone: true,
  providers: [CollectionService, UtilisateurService],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',

  imports: [
    CommonModule,
    HttpClientModule,
    DialogModule,
    FormsModule,
    RouterLink
  ]
})
export class CollectionsComponent implements OnInit {
  @Output() collectionsUpdated = new EventEmitter<void>()
  @Output() collectionDeleted = new EventEmitter<void>()

  @Input() collectionId: string = ''
  collection: any = {}
  collections: any[] = []
  gradientColors: string[] = []
  isDisabled = false
  collectionsStatus: any[] = []
  isCollection = true

  constructor(
    private collectionService: CollectionService,
    private utilisateurService: UtilisateurService,
    public dialog: Dialog
  ) {}

  ngOnInit() {
    this.collection = this.collectionId
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data
    })
  }

  getCollections() {
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data
      // console.log('Liste des collections mise à jour :', this.collections)
    })
  }

  getCollectionsByPublicStatus(userId: string) {
    this.collectionService
      .getCollectionsByPublicStatus(this.collection.public, userId)
      .subscribe((data) => {
        this.collectionsStatus = data
        // console.log(
        //   'Liste des collections publiques et privées mise à jour :',
        //   this.collectionsStatus
        // )
      })
  }

  getCollectionsByUtilisateurId() {
    this.collectionService
      .getCollectionsByUtilisateurId(this.collection.userId)
      .subscribe((data) => {
        this.collection
      })
  }

  setGradientStyle(collectionPeriodes: any): string {
    const colors = collectionPeriodes.map(
      (periode: { couleur: string }) => periode.couleur
    )
    return `linear-gradient(0.25turn, ${colors.join(', ')})`
  }

  openPopupUpdateColl(collectionId: string) {
    this.isDisabled = true
    const dialogRef = this.dialog.open<any>(FormCollectionComponent, {
      data: {
        collection: this.collections.find((e) => e._id === collectionId),
        isUpdate: true,
        collectionId: collectionId
      }
    })
    dialogRef.closed.subscribe((result) => {
      if (result) {
        const index = this.collections.findIndex((e) => e._id === collectionId)
        if (index !== -1) {
          this.collections[index] = result
          this.collectionsUpdated.emit()
          // console.log('collectionsUpdated emitted')
          this.getCollectionsByUtilisateurId()
        }
      }
      this.isDisabled = false
    })
  }

  openPopupMoreOptionColl(collectionId: string) {
    const dialogRef = this.dialog.open<any>(FormMoreOptionComponent, {
      data: {
        collection: this.collections.find((e) => e._id === collectionId),
        collectionId: collectionId,
        isCollection: true
      }
    })
    dialogRef.closed.subscribe((result) => {
      if (result) {
        const index = this.collections.findIndex((e) => e._id === collectionId)
        if (index !== -1) {
          this.collections[index] = result // Mettre à jour la collection dans la liste
          this.collectionsUpdated.emit()
          this.getCollectionsByUtilisateurId()
        }
      }
      const userId = this.utilisateurService.getCurrentUtilisateur()._id
      this.getCollectionsByPublicStatus(userId)
    })
  }
}
