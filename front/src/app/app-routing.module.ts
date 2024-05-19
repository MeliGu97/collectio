import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'


import { CollectionsComponent } from './components/collections/collections.component'
import { CollectionDetailPageComponent } from './pages/collection-detail-page/collection-detail-page.component'

import { ElementDetailPageComponent } from './pages/element-detail-page/element-detail-page.component'

import { HomePageComponent } from './pages/home-page/home-page.component'

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'collections/:id', component: CollectionDetailPageComponent },

  { path: 'elements/:id', component: ElementDetailPageComponent },


  // Ajoutez d'autres routes si nécessaire
  // { path: '', redirectTo: '/elements', pathMatch: 'full' } // Redirection par défaut vers /elements
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
