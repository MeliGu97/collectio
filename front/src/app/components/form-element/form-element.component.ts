import { Component, Inject, Input, OnInit } from '@angular/core'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog'
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  FormsModule
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { ElementService } from '../../services/element.service'
import { PhotoService } from '../../services/photo.service'

import { PopupComponent } from '../../design-system/popup/popup.component'
import { PhotoComponent } from '../photo/photo.component'

export interface DialogElementData {
  collectionIdFromPage: string
  element?: any
  isUpdate?: boolean
}

@Component({
  selector: 'app-form-element',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    PopupComponent,
    PhotoComponent
  ],
  providers: [ElementService, PhotoService],
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss'
})
export class FormElementComponent implements OnInit {
  @Input() photoSelected: number | undefined

  elements: any[] = []
  element: any = {}
  nouvelElementForm: FormGroup = new FormGroup({})
  nouvelElement: any = {}
  // isUpdate = false;

  popUpPhotoIsOpen: boolean = false
  selectedPhoto: any

  constructor(
    private elementService: ElementService,
    private photoService: PhotoService,

    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA)
    public data: DialogElementData
  ) {}

  ngOnInit() {
    console.log('Data received:', this.data)
    this.nouvelElementForm = this.formBuilder.group({
      collectionsId: [this.data.collectionIdFromPage],
      label: ['', Validators.required],
      description: [''],
      imageUrl: ['']
    })

    if (this.data.element && this.data.isUpdate) {
      this.nouvelElementForm.patchValue(this.data.element)
      // Si modif alors montre l'image de couv
      this.getPhotoDetails(this.data.element.imageUrl)
    }

    this.elementService.getElements().subscribe((data) => {
      this.elements = data
    })
  }

  updateImageUrl(id: number): void {
    this.popUpPhotoIsOpen = false
    // on vient renseigner le champ imageUrl de la collection
    this.nouvelElementForm.patchValue({ imageUrl: id })
    console.log('hey j ai une donnee: ', id)

    this.getPhotoDetails(id)
  }

  getPhotoDetails(id: number): void {
    this.photoService.getPhoto(id).subscribe((photo) => {
      console.log('Photo details depuis formulaire:', photo)
      this.photoSelected = photo.id
      this.selectedPhoto = photo
    })
  }

  createOrUpdateElement(): void {
    const token = localStorage.getItem('storage_token') || 'default_token_value'
    if (this.nouvelElementForm.valid) {
      if (this.data.isUpdate && this.data.element) {
        const updatedElement = {
          ...this.data.element,
          ...this.nouvelElementForm.value
        }
        this.elementService.updateElement(updatedElement, token).subscribe({
          next: (updatedElement) => {
            console.log('Element updated successfully', updatedElement)
            this.dialogRef.close(updatedElement)
          },
          error: (error) => {
            console.error("Error lors de la mise à jour d'un élement", error)
          }
        })
      } else {
        this.elementService
          .addElement(this.nouvelElementForm.value, token)
          .subscribe({
            next: (elementAjoute) => {
              console.log('element ajouté avec succès', elementAjoute)
              this.elements.push(elementAjoute)
              this.nouvelElementForm.reset() // Réinitialisation du formulaire après l'ajout
              this.dialogRef.close(elementAjoute)
            },
            error: (error) => {
              console.log('elementAjoute', this.nouvelElementForm.value)
              console.error("Erreur lors de l'ajout d'un element", error)
            }
          })
      }
    }
  }
}
