import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CollectionService } from '../../services/collection.service';
import { ElementService } from '../../services/element.service';
import { ElementDetailPageComponent } from "../element-detail-page/element-detail-page.component";
import { ElementDetailComponent } from "../../components/element-detail/element-detail.component";


@Component({
    selector: 'app-collection-detail-page',
    standalone: true,
    providers: [CollectionService],
    templateUrl: './collection-detail-page.component.html',
    styleUrl: './collection-detail-page.component.scss',
    imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, ElementDetailPageComponent, ElementDetailComponent]
})
export class CollectionDetailPageComponent implements OnInit {
  collection: any = {};

  constructor(private collectionService: CollectionService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupérer l'ID de la collection à partir de la route active
  this.route.params.subscribe(params => {
    const collectionId = params['id'];
    console.log("collectionId",collectionId)
    this.collectionService.getCollectionById(collectionId).subscribe((data) => {
      console.log("data",data)
      this.collection = data
      
    })
  });
   
  }
}
