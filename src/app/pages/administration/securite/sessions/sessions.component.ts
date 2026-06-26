import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {
  readonly entityKey = 'sessions';
}
