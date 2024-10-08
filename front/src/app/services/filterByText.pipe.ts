import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filterElement',
  standalone: true
})
export class FilterPipeElement implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return []
    }
    if (!searchText) {
      return items
    }
    searchText = searchText.toLowerCase()
    return items.filter((item) => {
      return (
        item.label.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      )
    })
  }
}

@Pipe({
  name: 'filterCollection',
  standalone: true
})
export class FilterPipeCollection implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return []
    }
    if (!searchText) {
      return items
    }
    searchText = searchText.toLowerCase()
    return items.filter((item) => {
      return (
        item.label.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        item.categorie.toLowerCase().includes(searchText) ||
        item.sousCategorie.toLowerCase().includes(searchText)
      )
    })
  }
}
