import { Component } from '@angular/core';
import { environment } from 'playground/environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { KitchenSinkComponent } from '../kitchen-sink/kitchen-sink.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, KitchenSinkComponent]
})
export class ExamplesComponent {
  public config = environment;
}
