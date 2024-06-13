import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { PeriodeDetailComponent } from "../periode-detail/periode-detail.component";
import { CollectionService } from '../../services/collection.service';
import { FormCollectionComponent } from '../form-collection/form-collection.component';

@Component({
    selector: 'app-collections',
    standalone: true,
    providers: [CollectionService],
    templateUrl: './collections.component.html',
    styleUrl: './collections.component.scss',

    imports: [CommonModule, HttpClientModule, DialogModule, FormsModule, RouterLink, PeriodeDetailComponent]
})
export class CollectionsComponent implements OnInit {
  collections: any[] = []
  gradientColors: string[] = [];

  constructor(
    private collectionService: CollectionService,
    public dialog: Dialog) {}

  ngOnInit() {
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data
    });
  }
  
  getCollections() {
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data;
    });
  }
  
  setGradientStyle(collectionPeriodes: any): string {
    const colors = collectionPeriodes.map((periode: { couleur: string }) => periode.couleur);
    return `linear-gradient(0.25turn, ${colors.join(', ')})`;
  }
  
  openPopup() {
    const dialogRef = this.dialog.open<string>(FormCollectionComponent, {
      width: '250px',
      data: {},
    });
    
    dialogRef.closed.subscribe(result => {
      if (result) {
        this.getCollections();
      }
    });
  }

  deleteCollection(id: string): void {
    this.collectionService.deleteCollectionById(id).subscribe(
      () => {
        // supp en cascade
        this.collections = this.collections.filter(collection => collection._id !== id);
      },
      error => {
        console.error('Error deleting collection:', error);
      }
    );
  }
}
