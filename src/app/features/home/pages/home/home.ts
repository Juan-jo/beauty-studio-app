import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallPwa } from "../../../../shared/components/install-pwa/install-pwa";

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    InstallPwa
],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
