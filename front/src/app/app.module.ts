// logiquement ne sert à rien car app.component.ts est en standlone:true => plus besoin de module
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'

import { CollectionService } from './services/collection.service'
import { ElementService } from './services/element.service'

import { PeriodeService } from './services/periode.service'
import { EvenementService } from './services/evenement.service'
import { UtilisateurService } from './services/utilisateur.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    CollectionService,
    ElementService,
    PeriodeService,
    EvenementService,
    UtilisateurService
  ]
})
export class AppModule {}
