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
  // element: any = {};
  elements: any[] = [];
  

  constructor(
    private collectionService: CollectionService, 
    private elementService: ElementService,
    private route: ActivatedRoute, 
    public dialog: Dialog
  ) {}

  ngOnInit(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.collectionService.getCollectionById(collectionId)
        .subscribe(collection => {
          this.collection = collection;
          this.loadElements();
        });
    }
  }
  
  loadElements(): void {
    this.collection.elementsId.forEach((elementId: string) => {
      this.elementService.getElementById(elementId)
        .subscribe(element => {
          this.elements.push(element);
        });
    });
  }
  

  setGradientStyle(collectionPeriodes: any): string {
    const colors = collectionPeriodes.map((periode: { couleur: string }) => periode.couleur);
    return `linear-gradient(0.25turn, ${colors.join(', ')})`;
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


  openPopupUpdateElem(elementId: string) {
    const dialogRef = this.dialog.open<any>(FormElementComponent, {
      width: '250px',
      data: { element: this.elements.find(e => e._id === elementId), isUpdate: true, elementId: elementId },
    });
  
    dialogRef.closed.subscribe(result => {
      if (result) {
        const index = this.elements.findIndex(e => e._id === elementId);
        if (index !== -1) {
          this.elements[index] = result; // Mettre à jour les données de l'élément local
        }
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
