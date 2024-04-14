import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';

import { ElementService } from '../../services/element.service'


@Component({
  selector: 'app-element-detail-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ElementService],
  templateUrl: './element-detail-page.component.html',
  styleUrl: './element-detail-page.component.scss'
})
export class ElementDetailPageComponent implements OnInit {
  element: any = {};

  constructor(private elementService: ElementService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupérer l'ID de la element à partir de la route active
  this.route.params.subscribe(params => {
    const elementId = params['id'];
    console.log("elementId",elementId)
    this.elementService.getElementById(elementId).subscribe((data) => {
      this.element = data
    })
  });
   
  }
}
