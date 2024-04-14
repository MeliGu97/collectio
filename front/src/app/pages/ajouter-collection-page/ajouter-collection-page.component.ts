import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router';

import { CollectionService } from '../../services/collection.service'
import { PeriodesComponent } from "../../components/periodes/periodes.component";

@Component({
    selector: 'app-ajouter-collection-page',
    standalone: true,
    providers: [CollectionService],
    templateUrl: './ajouter-collection-page.component.html',
    styleUrl: './ajouter-collection-page.component.scss',
    imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, PeriodesComponent]
})
export class AjouterCollectionPageComponent implements OnInit {
  collections: any = []
  nouvelCollection: any = {}

  constructor(private collectionService: CollectionService) {}

  ngOnInit() {
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data
    })
  }

  ajouterCollection(): void {
    this.collectionService.addCollection(this.nouvelCollection).subscribe({
      next: (collectionAjoute) => {
        console.log('collection ajoutée avec succès', collectionAjoute)
        this.collections.push(collectionAjoute)
        this.nouvelCollection = {} // Met à zéro le formulaire après l'ajout
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout d'une collection", error)
      }
    })
  }

  // Dans le composant Angular
  supprimerCollectionParId(id: string): void {
    console.log('suppr by id : ', id.toString())
    this.collectionService.deleteCollectionById(id.toString()).subscribe({
      next: () => {
        console.log('collection supprimée avec succès')
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la collection', error)
      }
    })
  }
}
