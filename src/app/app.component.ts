import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html'
})
export class AppComponent {
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private router: Router,
		private alertCtrl: AlertController
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			this.platform.backButton.subscribe(async () => {
				console.log('backbutton: ', this.router.url);

				//if (this.router.isActive('/tabs/tab2', true) && this.router.url === '/tabs/tab2') {
				const alert = await this.alertCtrl.create({
					header: 'Close app?',
					buttons: [
						{
							text: 'Cancel',
							role: 'cancel'
						},
						{
							text: 'Close',
							handler: () => {
								navigator['app'].exitApp();
							}
						}
					]
				});

				await alert.present();
				//}
			});
		});
	}
}
