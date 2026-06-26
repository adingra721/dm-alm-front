import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent {
  readonly entityKey = 'profiles';
}
