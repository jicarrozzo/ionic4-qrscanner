import { Injectable } from '@angular/core';
import { Record } from '../models/scans.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { environment } from 'src/environments/environment';

const backupfilename = environment.backupfilename;

@Injectable({
	providedIn: 'root'
})
export class LocalDataService {
	records: Record[] = [];

	constructor(
		private storage: Storage,
		private navCtrl: NavController,
		private iab: InAppBrowser,
		private fileCtrl: File,
		private emailComposer: EmailComposer
	) {
		this.load();
	}

	async load() {
		this.records = (await this.storage.get('records')) || [];
	}

	async save(format: string, text: string) {
		await this.load();
		const nr: Record = new Record(format, text);
		this.records.unshift(nr);
		await this.storage.set('records', this.records);
		this.open(nr);
	}

	async open(record: Record) {
		this.navCtrl.navigateForward('/tabs/tab2');

		switch (record.type) {
			case 'http':
				this.iab.create(record.text, '_system');
				break;
			case 'geo':
				this.navCtrl.navigateForward(`/tabs/tab2/map/${record.text}`);
				break;

			default:
				break;
		}
	}

	async export() {
		try {
			const data = await this.buildData();
			const path = await this.createFile(data);
			this.sendEmail(path);
		} catch (error) {
			console.log('Export error', error);
		}
	}
	private buildData() {
		const tmpRcd = [];
		tmpRcd.push('Type, Format, Created, Text\n');
		this.records.forEach((x) => {
			tmpRcd.push(`${x.type}, ${x.format}, ${x.created}, ${x.text.replace(',', ' ')}\n`);
		});
		return tmpRcd.join('');
	}

	private async createFile(recordData: string) {
		try {
			const exists = await this.fileCtrl.checkFile(this.fileCtrl.dataDirectory, backupfilename);
			if (!exists) await this.fileCtrl.createFile(this.fileCtrl.dataDirectory, backupfilename, false);

			await this.fileCtrl.writeExistingFile(this.fileCtrl.dataDirectory, backupfilename, recordData);
			return `${this.fileCtrl.dataDirectory}/${backupfilename}`;
		} catch (error) {
			throw error;
		}
	}
	private async sendEmail(filePath: string) {
		const available = await this.emailComposer.isAvailable();

		if (available) {
			const email = {
				to: 'jhon@doe.com',
				attachments: [ filePath ],
				subject: 'QRScanner Backup',
				body: 'Thanks for using QRScanner (alpha version) from <strong>Rosswell inc.</strong>',
				isHtml: true
			};

			try {
				await this.emailComposer.open(email);
			} catch (error) {
				throw error;
			}
		} else throw new Error('No email composer available');
	}
}
