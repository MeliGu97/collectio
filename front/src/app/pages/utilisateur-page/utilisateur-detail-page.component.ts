import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'

import { CollectionService } from '../../services/collection.service'
import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { FormCollectionComponent } from '../../components/form-collection/form-collection.component'
import { UtilisateurService } from '../../services/utilisateur.service'
import { FilterPipe } from '../../services/filterByText.pipe'
import { PeriodeService } from '../../services/periode.service'
import { FilterByPeriodesPipe } from '../../services/filterByPeriodes.pipe'

@Component({
  selector: 'app-utilisateur-detail-page',
  standalone: true,
  providers: [
    CollectionService,
    PeriodeService,
    UtilisateurService,
    FilterPipe,
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
    FilterPipe,
    FilterByPeriodesPipe
  ]
})
export class UtilisateurDetailPageComponent implements OnInit {
  collection: any = {}
  collections: any[] = []
  collectionId: any

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

      // décompte nombre de coll
      // this.loadCollection(utilisateurId)
    })
    this.periodeService.getPeriodes().subscribe((data) => {
      this.periodes = data
    })
  }

  // loadCollection(userId: string) {
  //   this.collectionService
  //     .getCollectionsPublicByUtilisateurId(userId)
  //     .subscribe((data) => {
  //       // console.log('data', data)
  //       this.collections = data
  //     })
  // }

  getUserId(): string {
    return this.route.snapshot.params['id']
  }

  // getCollectionsByStatus(userId?: string) {
  //   this.collectionService
  //     .getCollectionsUtiliByPublicStatus(userId)
  //     .subscribe((data) => {
  //       if (isPublic) {
  //         this.publicCollections = data
  //       } else {
  //         this.privateCollections = data
  //       }
  //     })
  // }

  getCollectionsPublicByUtilisateurId(userId: string) {
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

  getCollectionsPrivateByUtilisateurId(userId: string) {
    this.collectionService
      .getCollectionsPrivateByUtilisateurId(userId)
      .subscribe((data) => {
        this.collections = data
        this.collectionsPrivate = data
        // Mettre à jour les collections privées
        this.collectionsPrivate = this.collections.filter(
          (collection) => !collection.public
        )
      })
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
        this.getCollectionsPublicByUtilisateurId(
          this.route.snapshot.params['id']
        )
        this.getCollectionsPrivateByUtilisateurId(
          this.route.snapshot.params['id']
        )
      }
      this.isDisabled = false
    })
  }
}
