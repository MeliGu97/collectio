import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';

import { PeriodeService } from '../../services/periode.service'


@Component({
  selector: 'app-periode-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [PeriodeService],
  templateUrl: './periode-detail.component.html',
  styleUrl: './periode-detail.component.scss'
})
export class PeriodeDetailComponent implements OnInit {
  @Input() idPeriode: string = "";
  periode: any = {};
  @Input() periodeTaille: string = "";

  constructor(private periodeService: PeriodeService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.periodeService.getPeriodeById(this.idPeriode).subscribe((data) => {
      this.periode = data
    })   
  }
}
