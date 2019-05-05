import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var mapboxgl: any;

@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: [ './map.page.scss' ]
})
export class MapPage implements OnInit, AfterViewInit {
	lat: number;
	long: number;

	constructor(private route: ActivatedRoute, private router: Router) {}

	ngOnInit() {
		try {
			let geo: string[] = this.route.snapshot.paramMap.get('geo').substr(4).split(',');
			this.lat = Number(geo[0]);
			this.long = Number(geo[1]);
		} catch (error) {
			console.log(error);
		}
	}

	ngAfterViewInit(): void {
		mapboxgl.accessToken =
			'pk.eyJ1IjoiamljYXJyb3p6byIsImEiOiJjanZiMmY2ZmUwdzJyNDBtbWVwZm16OXNsIn0.kW5jBBFUGPbk-KjxDb52-g';
		const map = new mapboxgl.Map({
			style: 'mapbox://styles/mapbox/light-v10',
			center: [ this.long, this.lat ],
			zoom: 15.5,
			pitch: 45,
			bearing: -17.6,
			container: 'map'
		});
		map.on('load', () => {
			map.resize();
			new mapboxgl.Marker().setLngLat([ this.long, this.lat ]).addTo(map);

			// Insert the layer beneath any symbol layer.
			const layers = map.getStyle().layers;
			let labelLayerId;
			for (var i = 0; i < layers.length; i++) {
				if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
					labelLayerId = layers[i].id;
					break;
				}
			}
			map.addLayer(
				{
					id: '3d-buildings',
					source: 'composite',
					'source-layer': 'building',
					filter: [ '==', 'extrude', 'true' ],
					type: 'fill-extrusion',
					minzoom: 15,
					paint: {
						'fill-extrusion-color': '#aaa',
						// use an 'interpolate' expression to add a smooth transition effect to the
						// buildings as the user zooms in
						'fill-extrusion-height': [ 'interpolate', [ 'linear' ], [ 'zoom' ], 15, 0, 15.05, [ 'get', 'height' ] ],
						'fill-extrusion-base': [ 'interpolate', [ 'linear' ], [ 'zoom' ], 15, 0, 15.05, [ 'get', 'min_height' ] ],
						'fill-extrusion-opacity': 0.6
					}
				},
				labelLayerId
			);
		});
	}
}
