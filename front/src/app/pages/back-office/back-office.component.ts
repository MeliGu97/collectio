import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Dialog } from '@angular/cdk/dialog'
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms'

import { CollectionService } from '../../services/collection.service'
import { PeriodeService } from '../../services/periode.service'
import { UneService } from '../../services/une.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { SignalementService } from '../../services/signalement.service'

import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { PopupComponent } from '../../design-system/popup/popup.component'

import { FilterPipe } from '../../services/filterByText.pipe'

@Component({
  selector: 'app-back-office',
  standalone: true,
  providers: [
    CollectionService,
    PeriodeService,
    FilterPipe,
    UneService,
    UtilisateurService,
    SignalementService
  ],
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.scss',
  imports: [
    CommonModule,
    RouterLink,
    CollectionsComponent,
    FilterPipe,
    FormsModule,
    PopupComponent,
    ReactiveFormsModule
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

  formSignalement: boolean = false
  collectionSelect: string = ''
  newSignalement: FormGroup = new FormGroup({})
  signalements: any[] = []
  AllSignalements: any[] = []
  IsFiltreSignalement: boolean = false

  constructor(
    private uneService: UneService,
    private collectionService: CollectionService,
    private periodeService: PeriodeService,
    private signalementService: SignalementService,

    private formBuilder: FormBuilder,
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
    this.getSignalements()

    // pour la crea d'un signalement
    this.newSignalement = this.formBuilder.group({
      description: [''],
      // Ne pas remplir ces champs, mais les créer quand même
      reponseUtili: [''],
      reponseDate: ['']
    })
  }

  loadCollections() {
    this.collectionService.getAllPublicCollections().subscribe((data) => {
      this.publicCollections = data
    })
  }

  openPopupSignalement(collectionId: string) {
    this.formSignalement = true
    this.collectionSelect = collectionId
    console.log(this.collectionId)
  }

  ClosePopupSignalement() {
    this.formSignalement = false
  }

  // Creer un signalement
  createSignalementCollection() {
    if (this.newSignalement.valid) {
      const signalement = {
        description: this.newSignalement.value.description,
        collectionId: this.collectionSelect,
        date: new Date(),
        reponseUtili: '',
        reponseDate: ''
      }
      console.log('envoie du signalement :', signalement)
      this.signalementService.createSignalement(signalement).subscribe({
        next: (signalementAjoute) => {
          console.log('Signalement ajouté avec succès')
          // paff on envoie le signalement
          this.signalements.push(signalementAjoute)

          this.newSignalement.reset()
          this.formSignalement = false
        },

        error: (error) => {
          console.error(
            "Erreur lors de l'ajout des renseignements d'un signalement",
            error
          )
        }
      }),
        this.collectionService
          .updateCollectionPublic(this.collectionSelect, false)
          .subscribe({
            next: () => {
              console.log('Collection passée en privée')
              this.loadCollections()
            },

            error: (error) => {
              console.error('Erreur lors du passage à privée', error)
            }
          })
      this.collectionService
        .updateCollectionSignalement(this.collectionSelect, true)
        .subscribe({
          next: () => {
            console.log('Collection signalée avec succès')
          },
          error: (error) => {
            console.error('Erreur lors de la déclaration de signalement', error)
          }
        })
    }
  }

  // onCheckboxChange(periodeEvent: any) {
  //   if (periodeEvent.target.checked) {
  //     console.log('publicColl: ', this.publicCollections)
  //     this.publicCollections = this.publicCollections.filter((collection) =>
  //       collection.periodesId.some(
  //         (periode: { _id: any }) => periode._id === periodeEvent.target.value
  //       )
  //     )
  //   } else {
  //     this.loadCollections()
  //   }
  // }

  getSignalements() {
    this.signalementService.getAllSignalements().subscribe((data) => {
      this.AllSignalements = data.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      if (this.IsFiltreSignalement) {
        this.AllSignalements = this.AllSignalements.filter(
          (signalement) => signalement.reponseUtili !== ''
        )
      }
    })
  }

  // pour filtrer sur les signalements qui ont une réponse
  toggleSignalementReponse(event: any): void {
    this.IsFiltreSignalement = event.target.checked
    this.getSignalements()
  }

  suppSignalementCollection(collId: string) {
    this.collectionService
      .updateCollectionSignalement(collId, false)
      .subscribe({
        next: (collectionMiseAJour) => {
          console.log(
            'Signalement de la Collection mit à jour avec succès',
            collectionMiseAJour
          )
        },
        error: (error) => {
          console.error(
            'Erreur lors de la modif du paramettre signalement de la coll',
            error
          )
        }
      })
    this.signalementService
      .deleteSignalementByCollectionId(collId)
      .subscribe(() => {
        this.signalements = this.signalements.filter(
          (signalement) => signalement._id !== collId
        )
        this.getSignalements()
      })
  }
}
