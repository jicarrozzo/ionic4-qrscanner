import { Component, OnInit } from '@angular/core';
import { Record } from 'src/app/models/scans.model';
import { LocalDataService } from 'src/app/services/localdata.service';
import { AlertController } from '@ionic/angular';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: [ 'tab2.page.scss' ]
})
export class Tab2Page implements OnInit {
	records: Record[] = [];

	constructor(public localData: LocalDataService, private alertCtrl: AlertController) {}

	ngOnInit() {}

	async export() {
		const alert = await this.alertCtrl.create({
			header: 'Send by email',
			message: 'Do you wish to export your history via <strong>email</strong>?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary'
				},
				{
					text: 'Okay',
					handler: () => {
						this.localData.export();
					}
				}
			]
		});

		await alert.present();
	}
	async open(record: Record) {
		this.localData.open(record);
	}
}
