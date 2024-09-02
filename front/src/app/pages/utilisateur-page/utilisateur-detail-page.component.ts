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

@Component({
  selector: 'app-utilisateur-detail-page',
  standalone: true,
  providers: [CollectionService, UtilisateurService],
  templateUrl: './utilisateur-detail-page.component.html',
  styleUrl: './utilisateur-detail-page.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    DialogModule,
    FormsModule,
    RouterLink,
    CollectionsComponent
  ]
})
export class UtilisateurDetailPageComponent implements OnInit {
  collection: any = {}
  collections: any[] = []
  isDisabled = false
  privateCollections: any[] = []
  publicCollections: any[] = []
  getCollectionsByUtilisateurId: any
  collectionId: any

  constructor(
    private collectionService: CollectionService,
    public dialog: Dialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const utilisateurId = params['id']
      this.getCollectionsByStatus(false, utilisateurId)
      this.getCollectionsByStatus(true, utilisateurId)

      // décompte nombre de coll
      this.loadCollection(utilisateurId)
    })
  }

  loadCollection(userId: string) {
    this.collectionService
      .getCollectionsByUtilisateurId(userId)
      .subscribe((data) => {
        // console.log('data', data)
        this.collections = data
      })
  }

  getUserId(): string {
    return this.route.snapshot.params['id']
  }

  getCollectionsByStatus(isPublic: boolean, userId?: string) {
    this.collectionService
      .getCollectionsByPublicStatus(isPublic, userId)
      .subscribe((data) => {
        if (isPublic) {
          this.publicCollections = data
        } else {
          this.privateCollections = data
        }
      })
  }
  getCollectionsByUtilisateurIdUpdate(userId: string) {
    this.collectionService
      .getCollectionsByUtilisateurId(userId)
      .subscribe((data) => {
        this.collections = data
        // Mettre à jour les collections publiques et privées
        this.publicCollections = this.collections.filter(
          (collection) => collection.public
        )
        this.privateCollections = this.collections.filter(
          (collection) => !collection.public
        )
      })
  }

  openPopupCreateColl() {
    this.isDisabled = true
    const dialogRef = this.dialog.open<string>(FormCollectionComponent, {
      data: {}
    })

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.getCollectionsByStatus(false, this.route.snapshot.params['id'])
        this.getCollectionsByStatus(true, this.route.snapshot.params['id'])
      }
      this.isDisabled = false
    })
  }
}
