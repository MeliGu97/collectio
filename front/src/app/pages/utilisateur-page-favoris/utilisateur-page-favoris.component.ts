import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'

import { FavorisService } from '../../services/favoris.service'
import { CollectionService } from '../../services/collection.service'
import { PeriodeService } from '../../services/periode.service'
import { UtilisateurService } from '../../services/utilisateur.service'

import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-utilisateur-page-favoris',
  standalone: true,
  providers: [
    FavorisService,
    CollectionService,
    PeriodeService,
    UtilisateurService
  ],

  templateUrl: './utilisateur-page-favoris.component.html',
  styleUrl: './utilisateur-page-favoris.component.scss',
  imports: [CommonModule, CollectionsComponent]
})
export class UtilisateurPageFavorisComponent implements OnInit {
  utilisateur: any
  isCurrentUser: boolean = false

  newFavorisForm: FormGroup = new FormGroup({})
  favoris: any = {}
  Allfavoris: any[] = []
  favorisExistant: boolean = false

  collectionIds: any[] = []
  collectionId: any = {}
  collection: any = {}

  constructor(
    private favorisService: FavorisService,
    private collectionService: CollectionService,
    private periodeService: PeriodeService,
    private utilisateurService: UtilisateurService,
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

      // recupérer toutes les collections de collectionIds de la table favoris
      // n'afficher la collection que si son statut est public = true
      //
      this.getFavorisCollectionsByUserId(utilisateurId)
    })
  }

  creerFavoris(): void {
    const favorisData = {
      userId: this.utilisateur._id,
      collectionIds: []
    }
    this.favorisService.createFavoris(favorisData).subscribe({
      next: (createFavoris) => {
        this.Allfavoris.push(createFavoris)
        console.log(createFavoris)
        this.getFavorisCollectionsByUserId(this.utilisateur._id)
        this.favorisExistant = true
      },
      error: (error) => {
        console.log('valueFavAjoute', favorisData)
        console.error('Erreur lors de la créa', error)
      }
    })
  }

  getFavorisCollectionsByUserId(userId: string) {
    this.favorisService.getFavorisByUserId(userId).subscribe(
      (data) => {
        if (data.length === 0) {
          // Aucune liste de favori trouvé pour cet utilisateur
          this.favoris = null
          this.favorisExistant = false
        } else {
          this.favoris = data[0]
          if (this.favoris && this.favoris.collectionIds) {
            this.collectionIds = this.favoris.collectionIds.map(
              (collection: any) => collection
            )
            this.favorisExistant = true
          } else {
            this.favorisExistant = false
          }
        }
      },
      (error) => {
        console.error('Error:', error)
        this.favorisExistant = false
      }
    )
  }
}
