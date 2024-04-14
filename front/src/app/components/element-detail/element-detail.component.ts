import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';

import { ElementService } from '../../services/element.service'


@Component({
  selector: 'app-element-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ElementService],
  templateUrl: './element-detail.component.html',
  styleUrl: './element-detail.component.scss'
})
export class ElementDetailComponent implements OnInit {
  @Input() idElement: string = "";
  element: any = {};

  constructor(private elementService: ElementService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.elementService.getElementById(this.idElement).subscribe((data) => {
      this.element = data
    })   
  }
}
