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
import { FilterPipe } from '../../services/filterByText.pipe'
import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { UneService } from '../../services/une.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { PopupComponent } from '../../design-system/popup/popup.component'
import { SignalementService } from '../../services/signalement.service'

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
    this.newSignalement = this.formBuilder.group({
      description: ['']
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

  signalementCollection() {
    if (this.newSignalement.valid) {
      const signalement = {
        description: this.newSignalement.value.description,
        collectionId: this.collectionSelect,
        date: new Date()
      }
      console.log('envoie du signalement :', signalement)
      this.signalementService.createSignalement(signalement).subscribe({
        next: (signalementAjoute) => {
          console.log('Signalement ajouté avec succès', signalementAjoute)
          // paff on envoie le signalement
          this.signalements.push(signalementAjoute)

          this.newSignalement.reset()
          this.formSignalement = false
        },

        error: (error) => {
          console.error("Erreur lors de l'ajout d'un signalement", error)
        }
      }),
        this.collectionService
          .updateCollectionPublic(this.collectionSelect, false)
          .subscribe({
            next: (collectionMiseAJour) => {
              console.log(
                'Collection mise à jour avec succès',
                collectionMiseAJour
              )
            },
            error: (error) => {
              console.error(
                'Erreur lors de la mise à jour de la collection',
                error
              )
            }
          })
    }
  }
}
