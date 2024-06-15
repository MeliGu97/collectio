import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { CollectionService } from '../../services/collection.service';
import { ElementService } from '../../services/element.service';
import { ElementDetailPageComponent } from "../element-detail-page/element-detail-page.component";
import { ElementDetailComponent } from "../../components/element-detail/element-detail.component";
import { FormElementComponent } from "../../components/form-element/form-element.component";
import { FormCollectionComponent } from '../../components/form-collection/form-collection.component';



@Component({
    selector: 'app-collection-detail-page',
    standalone: true,
    providers: [CollectionService, ElementService],
    templateUrl: './collection-detail-page.component.html',
    styleUrl: './collection-detail-page.component.scss',
    imports: [CommonModule, HttpClientModule, DialogModule, FormsModule, RouterLink, ElementDetailPageComponent, ElementDetailComponent, FormElementComponent]
})
export class CollectionDetailPageComponent implements OnInit {
  collection: any = {};
  gradientColors: string[] = [];
  element: any = {};
  elements: any[] = [];


  constructor(
    private collectionService: CollectionService, 
    private elementService: ElementService,
    private route: ActivatedRoute, 
    public dialog: Dialog
  ) {}

  ngOnInit() {
    // Récupérer l'ID de la collection à partir de la route active
    this.route.params.subscribe(params => {
      const collectionId = params['id'];
      //console.log("collectionId :",collectionId)
      this.collectionService.getCollectionById(collectionId).subscribe((data) => {
        //console.log("data",data)
        this.collection = data
        this.loadElements(collectionId);
      })
    });
  }
  
  loadElements(collectionId: string) {
    this.elementService.getElementsByCollectionId(collectionId).subscribe((data) => {
      this.elements = data;
    });
  }

  setGradientStyle(collectionPeriodes: any): string {
    const colors = collectionPeriodes.map((periode: { couleur: string }) => periode.couleur);
    return `linear-gradient(0.25turn, ${colors.join(', ')})`;
  }

  openPopupUpdateColl(collectionId: string) {
    const dialogRef = this.dialog.open<string>(FormCollectionComponent, {
      width: '250px',
      data: {collection: this.collection, isUpdate: true},
    });
  
    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log("result: ", result)
        this.collection = result;
      }
    });
  }  

  // Si la liste des elements change 
  updateElementDetail(element: any) {
    const index = this.collection.elementsId.indexOf(element._id);
    if (index !== -1) {
      this.collection.elementsId.splice(index, 1, element._id);
    } else {
      this.collection.elementsId.push(element._id);
    }
  }

  openPopupAddElem(collectionId: string) {
    const dialogRef = this.dialog.open<string>(FormElementComponent, {
      width: '250px',
      data: {collectionIdFromPage: collectionId},
    });
  
    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.updateElementDetail(result);
      }
    });
  }

  deleteElement(id: string): void {
    console.log('ID de element supp est :', id);
    this.elementService.deleteElementById(id).subscribe({
      next: () => {
        // Element et tout ses events supp en cascade
        this.elements = this.elements.filter(element => element._id !== id);
    },
    error: (error) => {
      console.error('Error deleting element:', error);
    }
  });

}
  
  
}
