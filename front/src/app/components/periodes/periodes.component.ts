import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'

import { PeriodeService } from '../../services/periode.service'

@Component({
  selector: 'app-periodes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  providers: [PeriodeService],
  templateUrl: './periodes.component.html',
  styleUrl: './periodes.component.scss'
})
export class PeriodesComponent implements OnInit {
  periodes: any = []
  nouvelPeriode: any = {}

  constructor(private periodeService: PeriodeService) {}

  ngOnInit() {
    this.periodeService.getPeriodes().subscribe((data) => {
      this.periodes = data
    })
  }

  ajouterPeriode(): void {
    this.periodeService.addPeriode(this.nouvelPeriode).subscribe({
      next: (periodeAjoute) => {
        console.log('periode ajoutée avec succès', periodeAjoute)
        this.periodes.push(periodeAjoute)
        this.nouvelPeriode = {} // Met à zéro le formulaire après l'ajout
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout d'une periode", error)
      }
    })
  }
}
