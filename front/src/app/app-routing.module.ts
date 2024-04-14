import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'


import { CollectionsComponent } from './components/collections/collections.component'
import { CollectionDetailPageComponent } from './pages/collection-detail-page/collection-detail-page.component'
import { AjouterCollectionPageComponent } from './pages/ajouter-collection-page/ajouter-collection-page.component'

import { ElementsComponent } from './components/elements/elements.component'
import { ElementDetailPageComponent } from './pages/element-detail-page/element-detail-page.component'

import { EvenementsComponent } from './components/evenements/evenements.component'
import { PeriodesComponent } from './components/periodes/periodes.component'
import { HomePageComponent } from './pages/home-page/home-page.component'

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'collections/:id', component: CollectionDetailPageComponent },
  { path: 'ajouter-collection', component: AjouterCollectionPageComponent },

  { path: 'elements', component: ElementsComponent },
  { path: 'elements/:id', component: ElementDetailPageComponent },

  { path: 'evenements', component: EvenementsComponent },
  { path: 'periodes', component: PeriodesComponent },

  // Ajoutez d'autres routes si nécessaire
  // { path: '', redirectTo: '/elements', pathMatch: 'full' } // Redirection par défaut vers /elements
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
