import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'spt-booking-shell',
  template: `
        <h1>Apple music</h1>
       <router-outlet></router-outlet>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent  {

}
