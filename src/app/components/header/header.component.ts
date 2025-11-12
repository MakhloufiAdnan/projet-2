import { Component, Input } from '@angular/core';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { CommonModule } from '@angular/common';

export interface HeaderIndicator {
  label: string;
  value: number | string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) indicators: HeaderIndicator[] = [];
}
