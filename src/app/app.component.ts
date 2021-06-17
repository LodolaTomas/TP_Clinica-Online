import { Component } from '@angular/core';
import { ReCaptchaV3Service } from 'ngx-captcha';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private reCaptchaV3Service: ReCaptchaV3Service){
    reCaptchaV3Service.execute('6LfNePUaAAAAAGw6WNq63GAODS48kTzXDyrK9oqn', 'homepage', (token) => {
    }, {
        useGlobalDomain: false
    });
  }
  title = 'TPClinicaOnline';
  
}
