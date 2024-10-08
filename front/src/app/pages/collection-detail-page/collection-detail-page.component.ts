import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Dialog, DialogModule } from '@angular/cdk/dialog'

import { CollectionService } from '../../services/collection.service'
import { ElementService } from '../../services/element.service'

import { ElementDetailPageComponent } from '../element-detail-page/element-detail-page.component'
import { ElementDetailComponent } from '../../components/element-detail/element-detail.component'
import { FormElementComponent } from '../../components/form-element/form-element.component'
import { FormMoreOptionComponent } from '../../components/form-more-option/form-more-option.component'

import { FilterPipeElement } from '../../services/filterByText.pipe'

@Component({
  selector: 'app-collection-detail-page',
  standalone: true,
  providers: [CollectionService, ElementService, FilterPipeElement],
  templateUrl: './collection-detail-page.component.html',
  styleUrl: './collection-detail-page.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    DialogModule,
    FormsModule,
    RouterLink,
    ElementDetailPageComponent,
    ElementDetailComponent,
    FormElementComponent,
    FilterPipeElement
  ]
})
export class CollectionDetailPageComponent implements OnInit {
  collection: any = {}
  collectionDetail: any[] = []
  gradientColors: string[] = []
  elements: any[] = []
  element: any = {}
  isDisabled = false
  isCollection = false

  searchTerm: string = ''

  // pour afficher l'ensemble de la description ou non
  // showAll = false

  constructor(
    private collectionService: CollectionService,
    private elementService: ElementService,
    private route: ActivatedRoute,
    public dialog: Dialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const collectionId = params['id']
      // console.log('collectionId', collectionId)
      this.collectionService
        .getCollectionById(collectionId)
        .subscribe((data) => {
          this.collection = data
          this.loadElements(collectionId)
        })
    })
  }

  // showMore() {
  //   this.showAll = true
  // }

  loadElements(collectionId: string) {
    this.elementService
      .getElementsByCollectionId(collectionId)
      .subscribe((data) => {
        // console.log('data', data)
        this.elements = data
      })
  }

  setGradientStyle(collectionPeriodes: any): string {
    const colors = collectionPeriodes.map(
      (periode: { couleur: string }) => periode.couleur
    )
    return `linear-gradient(0.25turn, ${colors.join(', ')})`
  }

  openPopupAddElem(collectionId: string) {
    this.isDisabled = true
    const dialogRef = this.dialog.open<string>(FormElementComponent, {
      width: '250px',
      data: { collectionIdFromPage: collectionId }
    })

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed')
      if (result) {
        this.loadElements(collectionId)
      }
      this.isDisabled = false
    })
  }

  openPopupUpdateElem(elementId: string) {
    this.isDisabled = true
    const dialogRef = this.dialog.open<any>(FormElementComponent, {
      width: '250px',
      data: {
        element: this.elements.find((e) => e._id === elementId),
        isUpdate: true,
        elementId: elementId
      }
    })

    dialogRef.closed.subscribe((result) => {
      if (result) {
        const index = this.elements.findIndex((e) => e._id === elementId)
        if (index !== -1) {
          this.elements[index] = result // Mettre à jour les données de l'élément local
        }
      }
      this.isDisabled = false
    })
  }

  openPopupMoreOptioneElem(elementId: string) {
    const dialogRef = this.dialog.open<any>(FormMoreOptionComponent, {
      data: {
        element: this.elements.find((e) => e._id === elementId),
        elementId: elementId,
        isCollection: false
      }
    })
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.elements = this.elements.filter((e) => e._id !== result)
      }
    })
  }

  deleteElement(id: string): void {
    const token = localStorage.getItem('storage_token') || 'default_token_value'

    console.log('ID de element supp est :', id)
    this.elementService.deleteElementById(id, token).subscribe({
      next: () => {
        // Element et tout ses events supp en cascade
        this.elements = this.elements.filter((element) => element._id !== id)
      },
      error: (error) => {
        console.error('Error deleting element:', error)
      }
    })
  }
}
