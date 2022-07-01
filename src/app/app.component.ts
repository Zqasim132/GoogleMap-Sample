import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-google-maps-app';

  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  zoom = 12;
  maxZoom = 25;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    mapTypeId: 'roadmap',
    maxZoom:this.maxZoom,
    minZoom:this.minZoom,
  }
  markers = []  as  any;
  infoContent = ''

  latitude!: any;
  longitude!: any;
  country: string | string[] | null = 'PK';

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement,
      {
        fields: ["place_id", "geometry", "formatted_address", "name"],
        componentRestrictions: {country: this.country}
      }
    );
    // Align search box to center
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();
        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };
      });
    });
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })



    // const map = new google.maps.Map(
    //   document.getElementById("map") as HTMLElement,
    //   {
    //     center: { lat: -33.8688, lng: 151.2195 },
    //     zoom: 13,
    //   }
    // );

  //   const input = document.getElementById("pac-input") as HTMLInputElement;

  // // Specify just the place data fields that you need.
  // const autocomplete = new google.maps.places.Autocomplete(input, {
  //   fields: ["place_id", "geometry", "formatted_address", "name"],
  // });

  // autocomplete.bindTo("bounds", map);

  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // const infowindow = new google.maps.InfoWindow();
  // const infowindowContent = document.getElementById(
  //   "infowindow-content"
  // ) as HTMLElement;

  // infowindow.setContent(infowindowContent);

  // const marker = new google.maps.Marker({ map: map });

  // marker.addListener("click", () => {
  //   infowindow.open(map, marker);
  // });

  // autocomplete.addListener("place_changed", () => {
  //   infowindow.close();

  //   const place = autocomplete.getPlace();

  //   if (!place.geometry || !place.geometry.location) {
  //     return;
  //   }

  //   if (place.geometry.viewport) {
  //     map.fitBounds(place.geometry.viewport);
  //   } else {
  //     map.setCenter(place.geometry.location);
  //     map.setZoom(17);
  //   }

  //   // Set the position of the marker using the place ID and location.
  //   // @ts-ignore This should be in @typings/googlemaps.
  //   marker.setPlace({
  //     placeId: place.place_id,
  //     location: place.geometry.location,
  //   });

  //   marker.setVisible(true);

  //   (
  //     infowindowContent.children.namedItem("place-name") as HTMLElement
  //   ).textContent = place.name as string;
  //   (
  //     infowindowContent.children.namedItem("place-id") as HTMLElement
  //   ).textContent = place.place_id as string;
  //   (
  //     infowindowContent.children.namedItem("place-address") as HTMLElement
  //   ).textContent = place.formatted_address as string;
  //   infowindow.open(map, marker);
  // });
  }

  zoomIn() {
    if (this.zoom < this.maxZoom) this.zoom++;
    console.log('Get Zoom',this.map.getZoom());
  }

  zoomOut() {
    if (this.zoom > this.minZoom) this.zoom--;
  }

  eventHandler(event: any ,name:string){
    console.log(event,name);
    
    // Add marker on double click event
    if(name === 'mapDblclick'){
      this.dropMarker(event)
    }
  }

  // Markers
  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }

  dropMarker(event:any) {
    this.markers.push({
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      label: {
        color: 'blue',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }
}