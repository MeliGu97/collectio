import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2'

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
    UtilisateurService,
    SweetAlert2Module
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
    private route: ActivatedRoute,
    private router: Router
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

        this.showAlertCreateFavList()
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
          console.log('si fav est null', this.favorisExistant)
        } else {
          this.favoris = data[0]
          if (this.favoris && this.favoris.collectionIds) {
            this.collectionIds = this.favoris.collectionIds.map(
              (collection: any) => collection
            )
            this.favorisExistant = true
            console.log('si fav a 0coll', this.favorisExistant)
          } else {
            this.favorisExistant = false
            console.log('si fav a au moins 1coll', this.favorisExistant)
          }
        }
      },
      (error) => {
        console.error('Error:', error)
        this.favorisExistant = false
      }
    )
  }

  navigateHomePage() {
    this.router.navigate(['/homePage'])
  }

  // ALERT
  showAlertCreateFavList() {
    Swal.fire({
      title: 'Favoris',
      text: 'Vous avez débloqué votre liste de favoris',
      icon: 'success',
      customClass: {
        title: 'titre-popup'
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
