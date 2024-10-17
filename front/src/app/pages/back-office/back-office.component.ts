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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2'

import { CollectionService } from '../../services/collection.service'
import { PeriodeService } from '../../services/periode.service'
import { UneService } from '../../services/une.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { SignalementService } from '../../services/signalement.service'

import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { PopupComponent } from '../../design-system/popup/popup.component'

import { FilterPipeCollection } from '../../services/filterByText.pipe'
import { map, Observable } from 'rxjs'

@Component({
  selector: 'app-back-office',
  standalone: true,
  providers: [
    CollectionService,
    PeriodeService,
    FilterPipeCollection,
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
    FilterPipeCollection,
    FormsModule,
    PopupComponent,
    ReactiveFormsModule,
    SweetAlert2Module
  ]
})
export class BackOfficeComponent implements OnInit {
  IsAcces: boolean = false
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
    private utilisateurService: UtilisateurService,

    private formBuilder: FormBuilder,
    public dialog: Dialog
  ) {}

  ngOnInit() {
    const userId = this.utilisateurService.getCurrentUtilisateur()._id
    this.checkUserRole(userId, 'administrateur').subscribe((isAdmin) => {
      if (isAdmin) {
        this.IsAcces = true
      } else {
        this.IsAcces = false
        console.error(
          "You don't have the required role to perform this action."
        )
      }
    })
    this.refreshUne()

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

  // MISE EN PLACE
  loadCollections() {
    this.collectionService.getAllPublicCollections().subscribe((data) => {
      this.publicCollections = data
    })
  }
  refreshUne() {
    this.uneService.getUnes().subscribe((data) => {
      this.unes = data
      this.collections = this.unes.map((une) => une.collectionId)
    })
  }

  checkUserRole(userId: string, requiredRole: string): Observable<boolean> {
    return this.utilisateurService
      .getUserRoleById(userId)
      .pipe(map((role) => role === requiredRole))
  }

  // UNES

  // Add to une
  addToUne(collId: string) {
    console.log('HOUHOU je passe par une pour add cet id', collId)

    const une = {
      date: new Date(),
      collectionId: collId
    }
    this.uneService.addUne(une).subscribe({
      next: (uneAjoute) => {
        this.unes.push(uneAjoute)
        this.showAlertAddCollToUne()
        this.checkTab1()
        this.refreshUne()
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout de la une", error)
      }
    })
  }

  removeUne(collId: string) {
    this.uneService.deleteUneById(collId).subscribe(() => {
      this.unes = this.unes.filter((une) => une._id !== collId)
    })
    this.refreshUne()
  }

  // SIGNALEMENT
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
          this.showAlertCreateSignalement()
          this.getSignalements()
          // on ouvre l'onglet des signalements
          this.checkTab2()
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

  suppSignalementCollection(collId: string, signalementId: string) {
    console.log('id du signalement', signalementId)
    this.collectionService
      .updateCollectionSignalement(collId, false)
      .subscribe({
        next: (collectionMiseAJour) => {
          console.log(
            'Signalement de la Collection mit à jour avec succès',
            collectionMiseAJour
          )
          this.showAlertRemoveSignalement()
          this.getSignalements()
        },
        error: (error) => {
          console.error(
            'Erreur lors de la modif du paramettre signalement de la coll',
            error
          )
        }
      })
    this.signalementService
      .deleteSignalementBySignalementId(signalementId)
      .subscribe(() => {
        this.signalements = this.signalements.filter(
          (signalement) => signalement._id !== collId
        )
      })
  }

  // REDIRECTION ONGLETS
  checkTab1() {
    const tab1 = document.getElementById('tab1') as HTMLInputElement
    if (tab1) {
      tab1.checked = true
    }
  }

  checkTab2() {
    const tab2 = document.getElementById('tab2') as HTMLInputElement
    if (tab2) {
      tab2.checked = true
    }
  }

  // ANNEXE

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

  // ALERT
  showAlertAddCollToUne() {
    Swal.fire({
      title: 'Félicitation',
      text: 'La collection a été ajoutée en Une',
      icon: 'success',
      confirmButtonText: 'Ok',
      customClass: {
        title: 'titre-popup',
        confirmButton: 'btn-primary btn-small text-btn-popup'
      },
      buttonsStyling: false,
      timer: 2000, // Close the popup after 2 seconds (2000 milliseconds)
      timerProgressBar: true, // Show a progress bar indicating the time remaining
      didOpen: (toast) => {
        // arrete le chargement si l'utilisateur survol la popup
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  }

  showAlertCreateSignalement() {
    Swal.fire({
      title: 'Attention',
      text: 'Un signalement a été envoyé pour cette collection',
      icon: 'warning',
      confirmButtonText: 'Ok',
      customClass: {
        title: 'titre-popup',
        confirmButton: 'btn-primary btn-small text-btn-popup'
      },
      buttonsStyling: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        // arrete le chargement si l'utilisateur survol la popup
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  }

  showAlertRemoveSignalement() {
    Swal.fire({
      title: 'Signalement levé',
      text: 'Le signalement a été levé pour cette collection',
      icon: 'success',
      confirmButtonText: 'Ok',
      customClass: {
        title: 'titre-popup',
        confirmButton: 'btn-primary btn-small text-btn-popup'
      },
      buttonsStyling: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        // arrete le chargement si l'utilisateur survol la popup
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  }
}
