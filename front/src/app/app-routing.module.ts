import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './components/login/login.component'
import { HomePageComponent } from './pages/home-page/home-page.component'
import { UtilisateurDetailPageComponent } from './pages/utilisateur-page/utilisateur-detail-page.component'

import { CollectionDetailPageComponent } from './pages/collection-detail-page/collection-detail-page.component'
import { ElementDetailPageComponent } from './pages/element-detail-page/element-detail-page.component'
import { AuthGuard } from './auth.guard'
import { LoginPageComponent } from './pages/login-page/login-page.component'

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'homePage', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'collections/:id', component: CollectionDetailPageComponent },
  // { path: 'collections', component: CollectionsComponent },
  { path: 'elements/:id', component: ElementDetailPageComponent },
  {
    path: 'utilisateur/:id',
    component: UtilisateurDetailPageComponent,
    canActivate: [AuthGuard]
  }

  // Ajoutez d'autres routes si nécessaire
  // { path: '', redirectTo: '/elements', pathMatch: 'full' } // Redirection par défaut vers /elements
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
