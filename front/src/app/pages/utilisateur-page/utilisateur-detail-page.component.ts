import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2'

import { CollectionService } from '../../services/collection.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { PeriodeService } from '../../services/periode.service'
import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { FormCollectionComponent } from '../../components/form-collection/form-collection.component'

import { FilterByPeriodesPipe } from '../../services/filterByPeriodes.pipe'
import { FilterPipeCollection } from '../../services/filterByText.pipe'

@Component({
  selector: 'app-utilisateur-detail-page',
  standalone: true,
  providers: [
    CollectionService,
    PeriodeService,
    UtilisateurService,
    FilterPipeCollection,
    FilterByPeriodesPipe
  ],
  templateUrl: './utilisateur-detail-page.component.html',
  styleUrl: './utilisateur-detail-page.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    DialogModule,
    FormsModule,
    RouterLink,
    CollectionsComponent,
    FilterPipeCollection,
    FilterByPeriodesPipe,
    SweetAlert2Module
  ]
})
export class UtilisateurDetailPageComponent implements OnInit {
  collection: any = {}
  collections: any[] = []
  collectionId: string = ''

  // privateCollections: any[] = []
  // publicCollections: any[] = []
  collectionsPublic: any[] = []
  collectionsPrivate: any[] = []

  periodes: any
  selectedPeriodes: string[] = []
  getCollectionsByPeriodeId: any[] = []

  utilisateur: any
  isCurrentUser: boolean = false

  isDisabled = false
  searchTerm: string = ''

  constructor(
    private collectionService: CollectionService,
    private periodeService: PeriodeService,
    private utilisateurService: UtilisateurService,

    public dialog: Dialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const utilisateurId = params['id']
      this.utilisateurService
        .getUtilisateurById(utilisateurId)
        .subscribe((data) => {
          this.utilisateur = data
          this.isCurrentUser =
            this.utilisateurService.getCurrentUtilisateur()._id ===
            utilisateurId
        })

      this.getCollectionsPublicByUtilisateurId(utilisateurId)
      this.getCollectionsPrivateByUtilisateurId(utilisateurId)
    })
    this.periodeService.getPeriodes().subscribe((data) => {
      this.periodes = data
    })
  }

  getUserId(): string {
    return this.route.snapshot.params['id']
  }

  getCollectionsPublicByUtilisateurId(userId: string) {
    this.collectionService
      .getCollectionsPublicByUtilisateurId(userId)
      .subscribe((data) => {
        this.collections = data
        this.collectionsPublic = data
        // Met à jour les collections publiques
        this.collectionsPublic = this.collections.filter(
          (collection) => collection.public
        )
      })
  }

  getCollectionsPrivateByUtilisateurId(userId: string) {
    const token = localStorage.getItem('storage_token') || 'default_token_value'
    this.collectionService
      // On passe bien les deux arguments : l'id de l'utili et le token qu'on est allé cherché dans le localStorage
      .getCollectionsPrivateByUtilisateurId(userId, token)
      .subscribe((data) => {
        this.collections = data
        this.collectionsPrivate = data
        // Met à jour les collections privées
        this.collectionsPrivate = this.collections.filter(
          (collection) => !collection.public
        )
      })
  }

  getCollectionsByUtilisateurId(userId: string) {
    const token = localStorage.getItem('storage_token') || 'default_token_value'
    console.log(localStorage)
    this.collectionService
      .getCollectionsPrivateByUtilisateurId(userId, token)
      .subscribe((data) => {
        this.collections = data
        this.collectionsPrivate = data
        // Mettre à jour les collections privées
        this.collectionsPrivate = this.collections.filter(
          (collection) => !collection.public
        )
      })
    this.collectionService
      .getCollectionsPublicByUtilisateurId(userId)
      .subscribe((data) => {
        this.collections = data
        this.collectionsPublic = data
        // Mettre à jour les collections publiques
        this.collectionsPublic = this.collections.filter(
          (collection) => collection.public
        )
      })
    console.log('public coll', this.collectionsPublic)
  }

  onCheckboxChange(periodeEvent: any, userId: string) {
    if (periodeEvent.target.checked) {
      this.collectionsPublic = this.collectionsPublic.filter((collection) =>
        collection.periodesId.some(
          (periode: { _id: any }) => periode._id === periodeEvent.target.value
        )
      )
      this.collectionsPrivate = this.collectionsPrivate.filter((collection) =>
        collection.periodesId.some(
          (periode: { _id: any }) => periode._id === periodeEvent.target.value
        )
      )
    } else {
      this.getCollectionsPublicByUtilisateurId(userId)
      this.getCollectionsPrivateByUtilisateurId(userId)
    }
  }

  openPopupCreateColl() {
    this.isDisabled = true
    const dialogRef = this.dialog.open<string>(FormCollectionComponent, {
      data: {}
    })

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.getCollectionsPrivateByUtilisateurId(
          this.route.snapshot.params['id']
        )
        this.showAlertCreateColl()
        this.checkTab2()
      }
      this.isDisabled = false
    })
  }

  checkTab2() {
    const tab2 = document.getElementById('tab2') as HTMLInputElement
    if (tab2) {
      tab2.checked = true
    }
  }

  // ALERT
  showAlertCreateColl() {
    Swal.fire({
      title: 'Félicitation',
      text: 'Votre collection a été créee avec succès',
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
}
