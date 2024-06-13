
import { Component, Inject, OnInit } from '@angular/core'
import { DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { CollectionService } from '../../services/collection.service'
import { PopupComponent } from '../../design-system/popup/popup.component';
import { PeriodeService } from '../../services/periode.service'


@Component({
  selector: 'app-form-collection',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DialogModule, ReactiveFormsModule, PopupComponent],
  providers: [CollectionService, PeriodeService],
  templateUrl: './form-collection.component.html',
  styleUrl: './form-collection.component.scss'
})

  export class FormCollectionComponent implements OnInit {
    collection: any = []
    newCollectionForm: FormGroup= new FormGroup({}); 
    newCollection: any = {};
    // periode: any = {};
    periodes: any;
  

  constructor(
    private collectionService: CollectionService, 
    private periodeService: PeriodeService,
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {}
    
  

    ngOnInit() {
      this.newCollectionForm = this.formBuilder.group({
        label: ['', Validators.required],
        description: [''],
        categorie: ['', [Validators.required]],
        sousCategorie: [''],
        imageUrl: [''],
        picto: [''],
        periodesId: this.formBuilder.array([]),  // Utiliser FormArray pour les périodes
      });
    
      this.collectionService.getCollections().subscribe((data) => {
        this.collection = data;
      });
    
      this.periodeService.getPeriodes().subscribe((data) => {
        this.periodes = data;
        // console.log(this.periodes);
      });
    }
    
    onCheckboxChange(e: any) {
      const periodesArray: FormArray = this.newCollectionForm.get('periodesId') as FormArray;
    
      if (e.target.checked) {
        periodesArray.push(new FormControl(e.target.value));
      } else {
        const index = periodesArray.controls.findIndex(x => x.value === e.target.value);
        periodesArray.removeAt(index);
      }
    }

  ajouterCollection(): void {
    if (this.newCollectionForm.valid) {
      this.collectionService.addCollection(this.newCollectionForm.value).subscribe({
        next: (collectionAjoute) => {
          console.log('collection ajoutée avec succès', collectionAjoute);
          this.collection.push(collectionAjoute);
          this.newCollectionForm.reset(); // Réinitialisation du FormArray après la soumission
          (this.newCollectionForm.get('periodesId') as FormArray).clear();
          this.dialogRef.close(collectionAjoute);
        },
        error: (error) => {
          console.log("collectionAjoute", this.newCollectionForm.value);
          console.error("Erreur lors de l'ajout d'une collection", error);
        }
      });
    }
  }
  
  
}