import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'

import { EvenementService } from '../../services/evenement.service'
import { ElementService } from '../../services/element.service'
import { CollectionService } from '../../services/collection.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { PhotoService } from '../../services/photo.service'

import { FormEvenementComponent } from '../../components/form-evenement/form-evenement.component'

@Component({
  selector: 'app-element-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FormEvenementComponent,
    DialogModule
  ],
  providers: [
    ElementService,
    EvenementService,
    CollectionService,
    UtilisateurService,
    PhotoService
  ],
  templateUrl: './element-detail-page.component.html',
  styleUrl: './element-detail-page.component.scss'
})
export class ElementDetailPageComponent implements OnInit {
  collection: any = {}
  element: any = {}
  evenement: any = {}
  evenements: any[] = []
  isDisabled = false

  utilisateurId: any
  isCreator: boolean = false

  photo: any

  constructor(
    private elementService: ElementService,
    private evenementService: EvenementService,
    private collectionService: CollectionService,
    private utilisateurService: UtilisateurService,
    private photoService: PhotoService,

    private route: ActivatedRoute,
    public dialog: Dialog
  ) {}

  ngOnInit() {
    this.getCurrentUtilisateurId()
    // Récupérer l'ID de l'élément à partir de la route active
    this.route.params.subscribe((params) => {
      const elementId = params['id']
      // console.log('elementId', elementId)
      this.elementService.getElementById(elementId).subscribe((data) => {
        this.element = data
        this.loadEvenements(elementId)
        this.getCollectionByElementId(elementId)

        this.getImageById()
      })
    })
  }

  getCurrentUtilisateurId() {
    const token = localStorage.getItem('storage_token')
    if (token) {
      this.utilisateurService.getCurrentUtilisateurSecur().subscribe(
        (utilisateurId: any) => {
          // console.log("ID de l'utilisateur connecté:", utilisateurId._id)
          this.utilisateurId = utilisateurId._id
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
    if (this.element.imageUrl) {
      this.photoService.getPhoto(this.element.imageUrl).subscribe((photo) => {
        this.photo = photo
      })
    }
  }
  loadEvenements(elementId: string) {
    this.evenementService
      .getEvenementsByElementId(elementId)
      .subscribe((data) => {
        this.evenements = data
      })
  }

  getCollectionByElementId(elementId: string) {
    this.elementService.getElementById(elementId).subscribe({
      next: (element) => {
        if (
          element &&
          element.collectionsId &&
          element.collectionsId.length > 0
        ) {
          const collectionId = element.collectionsId[0]

          this.collectionService.getCollectionById(collectionId).subscribe({
            next: (collection) => {
              this.collection = collection
              // console.log('collection.userId', collection.userId)
              // console.log('this.utilisateurId', this.utilisateurId)
              if (collection.userId === this.utilisateurId) {
                this.isCreator = true
              } else {
                this.isCreator = false
              }
            },
            error: (error) => {
              console.error('Error on attend une collection:', error)
            }
          })
        } else {
          console.log('Element a pas de collections')
        }
      },
      error: (error) => {
        console.error('Error on attend element:', error)
      }
    })
  }

  // ---
  openPopupAddEvent(elementId: string) {
    this.isDisabled = true
    const dialogRef = this.dialog.open<string>(FormEvenementComponent, {
      width: '250px',
      data: { elementIdFromPage: elementId }
    })

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadEvenements(elementId)
      }
      this.isDisabled = false
    })
  }

  openPopupUpdateEvent(evenementId: string) {
    this.isDisabled = true
    const dialogRef = this.dialog.open<any>(FormEvenementComponent, {
      width: '250px',
      data: {
        evenement: this.evenements.find((e) => e._id === evenementId),
        isUpdate: true,
        evenementId: evenementId
      }
    })

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const index = this.evenements.findIndex((e) => e._id === evenementId)
        if (index !== -1) {
          this.evenements[index] = result // Mettre à jour les données de l'événement local
        }
      }
      this.isDisabled = false
    })
  }

  deleteEvenement(id: string): void {
    this.evenementService.deleteEvenementById(id).subscribe(() => {
      this.evenements = this.evenements.filter(
        (evenement) => evenement._id !== id
      )
    })
  }
}
