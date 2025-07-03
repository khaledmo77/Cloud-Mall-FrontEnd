import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroSlider } from '../../storeComponents/hero-slider/hero-slider';

@Component({
  selector: 'app-Storehome',
  standalone: true,
  imports: [RouterLink, HeroSlider],
  templateUrl: './Storehome.component.html',
  styleUrls: ['./Storehome.component.scss']
})
export class Storehome {}
