import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'

import { CollectionService } from '../../services/collection.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { SignalementService } from '../../services/signalement.service'
import { FavorisService } from '../../services/favoris.service'

import { FormCollectionComponent } from '../form-collection/form-collection.component'
import { FormMoreOptionComponent } from '../form-more-option/form-more-option.component'
import { PopupComponent } from '../../design-system/popup/popup.component'

@Component({
  selector: 'app-collections',
  standalone: true,
  providers: [
    CollectionService,
    UtilisateurService,
    SignalementService,
    FavorisService
  ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',

  imports: [
    CommonModule,
    HttpClientModule,
    DialogModule,
    FormsModule,
    RouterLink,
    PopupComponent,
    ReactiveFormsModule
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

  BtnAddOrUpdateIsDisabled = false
  isCollection = true

  signalement: any = {}
  reduit: boolean = false
  formSignalement: boolean = false
  updateSignalement: FormGroup = new FormGroup({})
  needReponse: boolean = true

  constructor(
    private collectionService: CollectionService,
    private utilisateurService: UtilisateurService,
    private signalementService: SignalementService,
    private favorisService: FavorisService,

    public dialog: Dialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.collection = this.collectionId
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data
      this.filterCollectionsByPeriodes()

      // si la collection a un signalement a true
      // alors va chercher ce signalement par l'id de la coll
      if (this.collection.signalement) {
        this.getSignalemetByCollId(this.collection._id)
      }

      this.updateSignalement = this.formBuilder.group({
        reponseUtili: [''],
        reponseDate: [new Date()]
      })
    })
    this.getUtilisateurById(this.collection.userId)
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

  getSignalemetByCollId(collectionId: string) {
    this.signalementService
      .getSignalementByCollectionId(collectionId)
      .subscribe((data) => {
        this.signalement = data
        if (this.signalement.reponseUtili === '') {
          this.needReponse = true
        } else {
          this.needReponse = false
        }
      })
  }

  signalementReduit(Isreduit: boolean) {
    this.reduit = Isreduit
  }

  // LES POST
  AddToFavoris(collectionId: string) {
    const userId = this.utilisateurService.getCurrentUtilisateur()._id
    this.favorisService.addToFavoris(userId, collectionId).subscribe({
      next: () => {
        // Mettre à jour la propriété isFavorite de la collection
        this.collection.isFavorite = true
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  updateSignalementCollection() {
    if (this.updateSignalement.valid) {
      const updatedSignalement = {
        ...this.signalement,
        ...this.updateSignalement.value
      }

      this.signalementService
        .updateSignalement(updatedSignalement)
        .subscribe((data) => {
          console.log('Updated signalement:', data)
          this.needReponse = false
        })
    }
    this.ClosePopupSignalement()
  }

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

  openPopupUpdateColl(collectionId: string) {
    this.BtnAddOrUpdateIsDisabled = true
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
      this.BtnAddOrUpdateIsDisabled = false
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

  openPopupSignalement(collectionId: string) {
    this.formSignalement = true
    this.collection = collectionId
  }
  ClosePopupSignalement() {
    this.formSignalement = false
  }
}
