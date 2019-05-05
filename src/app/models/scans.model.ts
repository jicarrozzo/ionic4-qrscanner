export class Record {
	public type: string;
	public icon: string;
	public created: Date;
	constructor(public format: string, public text: string) {
		this.created = new Date();
		this.setType();
	}

	private setType() {
		const beginText = this.text.substr(0, 4);
		switch (beginText) {
			case 'http':
				{
					this.type = 'http';
					this.icon = 'globe';
				}
				break;
			case 'geo:':
				{
					this.type = 'geo';
					this.icon = 'pin';
				}
				break;

			default:
				this.type = 'Unknown';
				this.icon = 'create';
				break;
		}
	}
}
