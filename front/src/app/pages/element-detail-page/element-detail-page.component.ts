import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { ElementService } from '../../services/element.service'
import { FormEvenementComponent } from '../../components/form-evenement/form-evenement.component';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-element-detail-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, FormEvenementComponent, DialogModule],
  providers: [ElementService, EvenementService],
  templateUrl: './element-detail-page.component.html',
  styleUrl: './element-detail-page.component.scss'
})
export class ElementDetailPageComponent implements OnInit {
  element: any = {};
  evenements: any[] = [];

  constructor(
    private elementService: ElementService, 
    private evenementService: EvenementService,
    private route: ActivatedRoute, 
    public dialog: Dialog
  ) {}

  ngOnInit() {
    // Récupérer l'ID de l'élément à partir de la route active
    this.route.params.subscribe(params => {
      const elementId = params['id'];
      console.log("elementId", elementId);
      this.elementService.getElementById(elementId).subscribe((data) => {
        this.element = data;
        this.loadEvenements(elementId);
      });
    });
  }

  loadEvenements(elementId: string) {
    this.evenementService.getEvenementsByElementId(elementId).subscribe((data) => {
      this.evenements = data;
    });
  }

  deleteEvenement(id: string): void {
    this.evenementService.deleteEvenementById(id).subscribe(() => {
      this.evenements = this.evenements.filter(evenement => evenement._id !== id);
    });
  }
  
  openPopup(elementId: string) {
    const dialogRef = this.dialog.open<string>(FormEvenementComponent, {
      width: '250px',
      data: {elementIdFromPage: elementId},
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.loadEvenements(elementId);
      }
    });
  }
}
