import { Pipe, PipeTransform } from "@angular/core";
import { Destination } from "../models/destination";

@Pipe({
  name: "alphabetical",
})

export class AlphabeticalPipe implements PipeTransform {

  public transform(destinations: Destination[]): Destination[] {
    function compare(a, b) {
      return a.name < b.name ? -1 : 1;
    }

    return Array.prototype.sort.call(destinations, compare);
  }
}
