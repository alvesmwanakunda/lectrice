import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataAsAgo'
})
export class DataAsAgoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {

    if (!value) { return 'il y a longtemps'; }
    let time = (Date.now() - Date.parse(value)) / 1000;
    if (time < 10) {
      return 'juste maintenant';
    } else if (time < 60) {
      return 'il y a un moment';
    }
    const divider = [60, 60, 24, 30, 12];
    const string = [' second', ' minute', ' heure', ' jour', ' moi', ' an'];
    let i;
    for (i = 0; Math.floor(time / divider[i]) > 0; i++) {
      time /= divider[i];
    }
    const plural = Math.floor(time) > 1 ? 's' : '';
    return 'il y a ' + Math.floor(time) + string[i] + plural;
  }

}
