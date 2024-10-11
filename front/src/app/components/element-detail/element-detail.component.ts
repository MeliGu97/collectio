import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { ElementService } from '../../services/element.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { PhotoService } from '../../services/photo.service'

@Component({
  selector: 'app-element-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ElementService, UtilisateurService, PhotoService],
  templateUrl: './element-detail.component.html',
  styleUrl: './element-detail.component.scss'
})
export class ElementDetailComponent implements OnInit {
  @Input() idElement: any = ''
  element: any = {}

  photoElement: any

  constructor(
    private elementService: ElementService,
    private utilisateurService: UtilisateurService,
    private photoService: PhotoService,

    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.element = this.idElement
    this.loadElement()
    // console.log('id de element', this.idElement)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idElement'] && !changes['idElement'].firstChange) {
      this.loadElement()
    }
  }

  loadElement() {
    this.elementService.getElementById(this.idElement._id).subscribe((data) => {
      this.element = data
    })
    if (this.element.imageUrl) {
      this.photoService.getPhoto(this.element.imageUrl).subscribe((photo) => {
        this.photoElement = photo
      })
    }
  }
}
