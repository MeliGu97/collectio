// form-collection.component = formulaire pour ajouter ou modifier une collection
import { Component, Inject, OnInit } from '@angular/core'
import { DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog'
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
  FormControl
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { CollectionService } from '../../services/collection.service'
import { PopupComponent } from '../../design-system/popup/popup.component'
import { PeriodeService } from '../../services/periode.service'
import { UtilisateurService } from '../../services/utilisateur.service'

@Component({
  selector: 'app-form-collection',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    PopupComponent
  ],
  providers: [CollectionService, PeriodeService, UtilisateurService],
  templateUrl: './form-collection.component.html',
  styleUrl: './form-collection.component.scss'
})
export class FormCollectionComponent implements OnInit {
  collection: any = []
  newCollectionForm: FormGroup = new FormGroup({})
  newCollection: any = {}
  periodes: any
  popUpPeriodeIsOpen: boolean = false

  constructor(
    private collectionService: CollectionService,
    private periodeService: PeriodeService,
    private formBuilder: FormBuilder,
    private utilisateurService: UtilisateurService,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const storage_user_id = this.utilisateurService.getCurrentUtilisateur()
    this.newCollectionForm = this.formBuilder.group({
      label: ['', Validators.required],
      description: [''],
      categorie: ['', [Validators.required]],
      sousCategorie: [''],
      imageUrl: [''],
      picto: ['fa-hippo'],
      //ajouter une validation pour que ça ne soit pas vide
      periodesId: this.formBuilder.array([]),
      public: false,
      userId: [storage_user_id._id || ''],
      signalement: false
    })

    if (this.data.isUpdate) {
      this.newCollectionForm.patchValue(this.data.collection)
    }

    this.periodeService.getPeriodes().subscribe((data) => {
      this.periodes = data
      const periodesArray: FormArray = this.newCollectionForm.get(
        'periodesId'
      ) as FormArray

      if (this.data.isUpdate) {
        // 'periodesId' basé sur la liste de case à cocher 'periodes' vérifie quelle case est cochée
        this.periodes.forEach((periode: any) => {
          const isChecked = this.data.collection.periodesId.some(
            (period: any) => period._id === periode._id
          )
          periodesArray.push(new FormControl(isChecked ? periode._id : false))
        })
      } else {
        this.periodes.forEach(() => {
          periodesArray.push(new FormControl(false))
        })
      }
    })
  }

  // Regarde si les cases periodes sont cochées ou non
  onCheckboxChange(e: any) {
    const periodesArray: FormArray = this.newCollectionForm.get(
      'periodesId'
    ) as FormArray

    if (e.target.checked) {
      periodesArray.push(new FormControl(e.target.value))
    } else {
      const index = periodesArray.controls.findIndex(
        (x) => x.value === e.target.value
      )
      periodesArray.removeAt(index)
    }
  }

  createOrUpdateCollection(): void {
    if (this.newCollectionForm.valid) {
      const periodesIds = this.newCollectionForm.value.periodesId.filter(
        (id: any) => typeof id === 'string'
      )
      const collectionData = {
        ...this.newCollectionForm.value,
        periodesId: periodesIds
      }
      // MODIFIER
      if (this.data.isUpdate) {
        // console.log('Données de la collection :', this.data.collection)
        const updatedCollection = { ...this.data.collection, ...collectionData }
        this.collectionService.updateCollection(updatedCollection).subscribe({
          next: (updatedCollection) => {
            // console.log('collection mise à jour avec succès', updatedCollection)
            this.dialogRef.close(updatedCollection)
          },
          error: (error) => {
            console.log('updatedCollection', updatedCollection)
            console.error(
              "Erreur lors de la mise à jour d'une collection",
              error
            )
          }
        })
      } else {
        // AJOUTER
        // RAF ouvrir forcement l'onglet coll privée car a la création une collection est forcement privée
        this.collectionService.addCollection(collectionData).subscribe({
          next: (createCollection) => {
            // console.log('collection ajoutée avec succès', createCollection)
            this.collection.push(createCollection)
            this.newCollectionForm.reset()
            ;(this.newCollectionForm.get('periodesId') as FormArray).clear()
            this.dialogRef.close(createCollection)
          },
          error: (error) => {
            console.log('ValueCollAjoute', collectionData)
            console.error("Erreur lors de l'ajout d'une collection", error)
          }
        })
      }
    }
  }
}
