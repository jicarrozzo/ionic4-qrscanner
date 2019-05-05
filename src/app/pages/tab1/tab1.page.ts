import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LocalDataService } from 'src/app/services/localdata.service';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: [ 'tab1.page.scss' ]
})
export class Tab1Page {
	slidesOpts = {
		allowSlidePrev: false,
		allowSlideNext: false
	};
	constructor(private barcodeScanner: BarcodeScanner, private localData: LocalDataService) {}

	scan() {
		this.barcodeScanner
			.scan()
			.then((barcodeData) => {
				console.log('Barcode data', barcodeData);
				if (!barcodeData.cancelled) this.localData.save(barcodeData.format, barcodeData.text);
			})
			.catch((err) => {
				console.log('Error', err);

				// this.localData.save('QRCode', 'http://www.infobae.com');
				this.localData.save('QRCode', 'geo:-34.609587,-58.3880315');
			});
	}
}
