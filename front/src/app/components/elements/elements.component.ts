import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ElementService } from '../../services/element.service'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-elements',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ElementService],
  templateUrl: './elements.component.html',
  styleUrl: './elements.component.scss'
})
export class ElementsComponent implements OnInit {
  elements$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  nouvelElement: any = {};

  constructor(private elementService: ElementService, private cdr :ChangeDetectorRef) {}

  ngOnInit() {
    this.elementService.getElements().subscribe((data) => {
      this.elements$.next(data);
    });
  }

  ajouterElement(): void {
    this.elementService.addElement(this.nouvelElement).subscribe({
      next: (elementAjoute) => {
        console.log('élément ajouté avec succès', elementAjoute);
        const currentElements = this.elements$.value;
        this.elements$.next([...currentElements, elementAjoute]);
        this.nouvelElement = {}; // Met à zéro le formulaire après l'ajout
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout d'un élément", error);
      }
    });
  }

  supprimerElementParId(id: string): void {
    console.log('suppr by id : ', id.toString());
    this.elementService.deleteElementById(id.toString()).subscribe({
      next: () => {
        console.log('élément supprimé avec succès');
        const currentElements = this.elements$.value;
        const updatedElements = currentElements.filter((element) => element.id !== id);
        this.elements$.next(updatedElements);
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error("Erreur lors de la suppression de l'élément", error);
      }
    });
  }
}