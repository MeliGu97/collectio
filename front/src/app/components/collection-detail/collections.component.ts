import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'

import { CollectionService } from '../../services/collection.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { SignalementService } from '../../services/signalement.service'

import { FormCollectionComponent } from '../form-collection/form-collection.component'
import { FormMoreOptionComponent } from '../form-more-option/form-more-option.component'

@Component({
  selector: 'app-collections',
  standalone: true,
  providers: [CollectionService, UtilisateurService, SignalementService],
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
  @Input() selectedPeriodes: string[] = []

  @Output() collectionsUpdated = new EventEmitter<void>()
  @Output() collectionDeleted = new EventEmitter<void>()

  @Input() collectionId: string = ''

  collection: any = {}
  collections: any[] = []
  AllcollectionsPubliques: any[] = []
  collectionsUtiliPubliques: any[] = []
  collectionsUtiliPrivates: any[] = []

  utilisateur: any = {}
  isCurrentUser: boolean = false

  gradientColors: string[] = []
  isDisabled = false
  isCollection = true

  signalement: any = {}
  signalements: any[] = []
  isCollSignalee: boolean = false
  compris: boolean = false

  constructor(
    private collectionService: CollectionService,
    private utilisateurService: UtilisateurService,
    private signalementService: SignalementService,

    public dialog: Dialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.collection = this.collectionId
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data
      this.filterCollectionsByPeriodes()
    })
    this.getUtilisateurById(this.collection.userId)
    this.getSignalementByCollectionId(this.collection._id)
    // this.getAllSignalements()
  }

  filterCollectionsByPeriodes() {
    if (this.selectedPeriodes.length === 0) {
      return this.collections
    }

    return this.collections.filter((collection) =>
      collection.periodesId.some((periodeId: string) =>
        this.selectedPeriodes.includes(periodeId)
      )
    )
  }

  // LES CRUD GET

  getAllPublicCollections() {
    this.collectionService.getAllPublicCollections().subscribe((data) => {
      this.AllcollectionsPubliques = data
    })
  }

  getCollectionsPubliquesByUtilisateurId() {
    this.collectionService
      .getCollectionsPublicByUtilisateurId(this.collection.userId)
      .subscribe((data) => {
        this.collectionsUtiliPubliques = data
      })
    console.log(
      'this.collectionsUtiliPubliques',
      this.collectionsUtiliPubliques
    )
  }
  getCollectionsPrivatesByUtilisateurId() {
    this.collectionService
      .getCollectionsPrivateByUtilisateurId(this.collection.userId)
      .subscribe((data) => {
        this.collectionsUtiliPrivates = data
      })
  }

  getUtilisateurById(userId: string) {
    this.utilisateurService.getUtilisateurById(userId).subscribe((data) => {
      this.utilisateur = data
    })
  }

  getSignalementByCollectionId(collectionId: string) {
    this.signalementService
      .getSignalementByCollectionId(collectionId)
      .subscribe({
        next: (signalement) => {
          if (signalement) {
            this.isCollSignalee = true
            this.signalement = signalement
          } else {
            this.isCollSignalee = false
            this.signalement = undefined
          }
        },
        error: (error) => {
          if (error.status === 404) {
            this.isCollSignalee = false
            this.signalement = undefined
          } else {
            console.error(
              'Erreur lors de la récupération du signalement',
              error
            )
          }
        }
      })
  }

  // getAllSignalements() {
  //   this.signalementService.getAllSignalements().subscribe({
  //     next: (signalements) => {
  //       const signalement = signalements.find(
  //         (s) => s.collectionId === this.collection._id
  //       )
  //       if (signalement) {
  //         this.isCollSignalee = true
  //       } else {
  //         this.isCollSignalee = false
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors de la récupération des signalements', error)
  //     }
  //   })
  //   console.log('signal', this.signalement)
  // }

  // ANNEXE
  navigateUserPage(id: string) {
    if (id) {
      this.router.navigate(['/utilisateur', id])
    }
  }

  setGradientStyle(collectionPeriodes: any): string {
    const colors = collectionPeriodes.map(
      (periode: { couleur: string }) => periode.couleur
    )
    return `linear-gradient(0.25turn, ${colors.join(', ')})`
  }

  signalementComrpris() {
    this.compris = true
    console.log(this.compris)
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
          this.getCollectionsPubliquesByUtilisateurId()
          this.getCollectionsPrivatesByUtilisateurId()
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
          this.getCollectionsPubliquesByUtilisateurId()
          this.getCollectionsPrivatesByUtilisateurId()
        }
      }
      const userId = this.utilisateurService.getCurrentUtilisateur()._id
      // this.getCollectionsUtiliByPublicStatus(userId)
    })
  }
}
