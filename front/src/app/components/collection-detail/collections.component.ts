import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'
import { Observable } from 'rxjs/internal/Observable'
import { map } from 'rxjs'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2'

import { CollectionService } from '../../services/collection.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { SignalementService } from '../../services/signalement.service'
import { FavorisService } from '../../services/favoris.service'
import { PhotoService } from '../../services/photo.service'

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
    FavorisService,
    PhotoService
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
    ReactiveFormsModule,
    SweetAlert2Module
  ]
})
export class CollectionsComponent implements OnInit {
  @Input() selectedPeriodes: string[] = []
  @Input() collectionId: string = ''

  @Output() collectionsUpdated = new EventEmitter<void>()
  @Output() collectionDeleted = new EventEmitter<void>()

  collection: any = {}
  collections: any[] = []
  AllcollectionsPubliques: any[] = []
  collectionsUtiliPubliques: any[] = []
  collectionsUtiliPrivates: any[] = []

  utilisateur: any = {}
  isCurrentUser: boolean = false

  // Pour savoir si l'utili connecté est le meme que le createur de la coll
  collUserId: any
  utilisateurId: any
  isCreator: boolean = false

  // Pour la couleur de fond si plusieurs periodes
  gradientColors: string[] = []

  BtnAddOrUpdateIsDisabled = false
  isCollection = true

  signalement: any = {}
  reduit: boolean = false
  formSignalement: boolean = false
  updateSignalement: FormGroup = new FormGroup({})
  needReponse: boolean = true

  isCollFav: boolean = false
  favoris: any = {}
  Allfavoris: any[] = []
  favorisExistant: boolean = false
  collectionIds: any[] = []

  photo: any

  constructor(
    private collectionService: CollectionService,
    private utilisateurService: UtilisateurService,
    private signalementService: SignalementService,
    private favorisService: FavorisService,
    private photoService: PhotoService,

    public dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  // ---------------------------------
  ngOnInit() {
    this.collection = this.collectionId
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data

      this.collUserId = this.collection.userId

      this.compareId()

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
    this.getImageById()
    // recup l'utili conneté :
    const utilisateurId = this.utilisateurService.getCurrentUtilisateur()._id
    if (utilisateurId) {
      // Récupérer les favoris de l'utilisateur connecté
      this.getFavorisCollectionsByUserId(utilisateurId)
      this.isCurrentUser = true
    } else {
      // console.log('Aucun utilisateur connecté')
      this.isCurrentUser = false
    }

    // pour afficher le nom de l'utilisateur a la fin de la carte collection
    this.getUtilisateurById(this.collection.userId)
  }

  // ---------------------------------------

  compareId() {
    const token = localStorage.getItem('storage_token')
    if (token) {
      // on utilise le service secu pour recup id de l'utili
      this.utilisateurService.getCurrentUtilisateurSecur().subscribe(
        (utilisateurId: any) => {
          this.utilisateurId = utilisateurId._id
          // console.log(' this.collUserId', this.collUserId)
          // console.log('this.utilisateurId', this.utilisateurId)
          if (this.collUserId === this.utilisateurId) {
            this.isCreator = true
          } else {
            this.isCreator = false
          }
        },
        (error: any) => {
          console.error(
            "Erreur lors de la récupération de l'ID de l'utilisateur connecté:",
            error
          )
        }
      )
    }
  }

  getImageById(): void {
    if (this.collection.imageUrl) {
      this.photoService
        .getPhoto(this.collection.imageUrl)
        .subscribe((photo) => {
          this.photo = photo
        })
    }
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
    // console.log(
    //   'this.collectionsUtiliPubliques',
    //   this.collectionsUtiliPubliques
    // )
  }

  getCollectionsPrivatesByUtilisateurId() {
    const token = localStorage.getItem('storage_token') || 'default_token_value'
    this.collectionService
      .getCollectionsPrivateByUtilisateurId(this.collection.userId, token)
      .subscribe((data) => {
        this.collectionsUtiliPrivates = data
      })
  }

  // pour afficher le nom du créateur de la collection
  getUtilisateurById(userId: string) {
    this.utilisateurService.getUtilisateurById(userId).subscribe((data) => {
      this.utilisateur = data
    })
  }

  // ---------------------------------------
  // LES FAVORIS

  getFavorisCollectionsByUserId(userId: string) {
    this.favorisService.getFavorisByUserId(userId).subscribe(
      (data) => {
        if (data.length === 0) {
          // Aucune liste de favori trouvé pour cet utilisateur
          this.favoris = null
        } else {
          this.favoris = data[0]
          if (this.favoris && this.favoris.collectionIds) {
            this.collectionIds = this.favoris.collectionIds.map(
              (collection: any) => collection
            )
            // console.log(this.collectionIds)
            // console.log('je me recharge')
            this.CheckIfCollIsInFav(this.collection._id)
          }
        }
      },
      (error) => {
        console.error('Error:', error)
      }
    )
  }
  CheckIfCollIsInFav(collectionId: string) {
    // Vérifier si l'identifiant de la collection courante se trouve dans le tableau collectionIds
    if (
      this.collectionIds.some(
        (collection: any) => collection._id === collectionId
      )
    ) {
      this.isCollFav = true
    } else {
      this.isCollFav = false
    }
  }

  AddToFavoris(collectionId: string) {
    const utilisateurId = this.utilisateurService.getCurrentUtilisateur()._id
    if (utilisateurId) {
      this.favorisService
        .addCollectionToFavoris(utilisateurId, collectionId)
        .subscribe({
          next: () => {
            // Mettre à jour le tableau collectionIds avec la nouvelle collection favorite
            this.collectionIds.push(collectionId)
            this.isCollFav = true
            console.log('[compo] Collection ajoutée aux favoris avec succès !')
          },
          error: (error) => {
            console.error(
              "[compo] Erreur lors de l'ajout de la collection aux favoris :",
              error
            )
          }
        })
    } else {
      // console.log('Aucun utilisateur connecté')
    }
  }

  RemoveToFavoris(collectionId: string) {
    const utilisateurId = this.utilisateurService.getCurrentUtilisateur()._id
    this.favorisService
      .removeCollectionFromFavoris(utilisateurId, collectionId)
      .subscribe({
        next: () => {
          // console.log('[compo] collectionId', collectionId)
          this.isCollFav = false

          // Mettre à jour la liste des favoris de l'utilisateur connecté
          this.getFavorisCollectionsByUserId(utilisateurId)
          // console.log('recharge toi')
        },
        error: (error) => {
          console.error(
            "Erreur lors du retrait de l'identifiant de collection des favoris :",
            error
          )
        }
      })
  }

  // ---------------------------------------
  // LES SIGNALEMENTS

  openPopupSignalement(collectionId: string) {
    this.formSignalement = true
    this.collection = collectionId
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

  updateSignalementCollection() {
    if (this.updateSignalement.valid) {
      const updatedSignalement = {
        ...this.signalement,
        ...this.updateSignalement.value
      }

      this.signalementService
        .updateSignalement(updatedSignalement)
        .subscribe((data) => {
          this.getSignalemetByCollId(this.collection._id)
        })
      this.needReponse = false
    }
    this.ClosePopupSignalement()
  }

  ClosePopupSignalement() {
    this.formSignalement = false
  }

  // ANNEXE
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

  // ----
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

  // ALERT
  showAlertConfirmeSendMessageToAdmin() {
    Swal.fire({
      title: 'Attention',
      text: "Vous ne pouvez envoyé qu'une argumentation. Êtes vous sûr de confirmer l'envoi ?",
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: "Confirmer l'envoi",

      customClass: {
        title: 'titre-popup',
        icon: 'picto-popup',
        confirmButton: 'btn-primary btn-small btn-success',
        cancelButton: 'btn-primary btn-small btn-error'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateSignalementCollection()
        Swal.fire({
          title: 'Demande envoyée!',
          text: 'Votre message a été envoyé.',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: {
            title: 'titre-popup',
            confirmButton: 'btn-primary btn-small'
          },
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Annuler',
          text: "Votre message n'a pas été envoyé.",
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            title: 'titre-popup',
            confirmButton: 'btn-primary btn-small'
          },
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      }
    })
  }
}
