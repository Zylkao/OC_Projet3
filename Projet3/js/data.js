

window.onload = function(){
  // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
  map.initMap();

};
//Récuperation du temps restant de la réservation au chargement de la page
window.addEventListener('load', (e) => {
  slider.autoPlay();
  if (sessionStorage.getItem('finDeLaReservation')) {
    map.initTimer();
  }
});

// on crée la class Map

class Map {
  constructor(){
    this.canvas = canvas;
    this.name = "";
    this.surname = "";
    this.interval;
    this.stationBooked ="";
    this.numberBikes="";
    this.gare="";
    this.macarte="";
  }


//méthode pour afficher la GoogleMap
  initMap(){
    var lat = 45.7627855;
    var lng = 4.8364665;
    this.macarte = null;


      this.map = new L.map('map').setView([lat, lng], 13);

      // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
      L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
          // Il est toujours bien de laisser le lien vers la source des données
          attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
          minZoom: 1,
          maxZoom: 20
      }).addTo(this.map);
}

//méthode de récupération des donnée de l'API
  getRequestResponse(url) {

    let req= new XMLHttpRequest();
      req.open("GET", url);
      req.send(null);
      req.addEventListener("load", () =>{
        if (req.status >= 200 && req.status < 400) {
          //si ma requête s'est bien passée et que j'ai toutes les infos que je veux, je peux les afficher avec la méthode "affiche" contenue dans la classe


          this.pins = this.affiche(req.responseText);
        } else {
          console.error(req.status + " " + req.statusText + " " + url);
        }
      });
      req.addEventListener("error", function (){
        console.error("Erreur réseau avec l'url " + url)
      });
  }

  initTimer(){
    let timer = document.getElementById('timer'),
        tempsRestant;

    this.interval = setInterval(() => {
      var now = new Date().getTime();
       tempsRestant = sessionStorage.finDeLaReservation - now;
       tempsRestant = Math.round(tempsRestant / 1000);  // on arrondit le temps restant en secondes

      if(tempsRestant > 0){
      timer.innerHTML = Math.floor(tempsRestant / 60 ) + " min " + Math.round(tempsRestant % 60) + " s."
      bkg.innerHTML = "Vous avez reservé un vélo à " + "<strong>" + sessionStorage.getItem('station') + "</strong>"  + " au nom de " + "<strong>" + localStorage.name + " " + localStorage.surname + "</strong>" + "<br /> Temps Restant : " + "<strong id='timer'>" + timer.innerHTML + "</strong>";
    } else {
      clearInterval(this.interval);
      sessionStorage.removeItem('finDeLaReservation');
        bkg.innerHTML = "Votre réservation est dépassé";
      }
    }, 1000);
  }
// Métode d'affichage des donnée utilisé
  affiche(reponse){

    let adresse,
        status,
        stands,
        a_stands,
        bike,
        lat,
        lng;

    const data = JSON.parse(reponse);

    //recuperation des données
    let pin,
        markerClusters,
        marker,
        markers = [];

        markerClusters = L.markerClusterGroup();
    for (let i in data){
      lat= data[i].position.lat;
      lng= data[i].position.lng;
      adresse = data[i].address;
      status = data[i].status;
      stands = data[i].bike_stands;
      a_stands = data[i].available_bike_stands;
      bike = data[i].available_bikes;
      pin = {index : i, address: adresse, statut: status, stand: stands, a_stand: a_stands, bikes: bike};

      //Affichage des marqueur selon les donnée de latitude et longitude
      var iconBase = '../img/m/';
      var myIcon = L.icon({
			iconUrl: iconBase + 'm1',
			iconSize: [50, 50],
			iconAnchor: [25, 30],
			popupAnchor: [-3, -76],
		});


  		marker = L.marker([data[i].position.lat, data[i].position.lng], { icon: myIcon }); // pas de addTo(macarte), l'affichage sera géré par la bibliothèque des clusters
  		marker.bindPopup(adresse);
  		markerClusters.addLayer(marker); // Nous ajoutons le marqueur aux groupes
      this.map.addLayer(markerClusters);

      //evenement d'affichage des donnée lors d'un clique sur un marqueur
      marker.addEventListener('click', ()=>{
        document.getElementById("no_sign").style.visibility = "hidden";
        let info = document.getElementById("info");
        let sign = document.getElementById("sign");

        this.stationBooked = data[i].address;
        this.numberBikes = data[i].available_bikes;
        this.gare = data[i].status;

        info.innerHTML = "</br>" + "<strong>" + "Adresse: " + "</strong>" + "</br>" + data[i].address + "</br>" + "</br>" +
        "<strong>" + "Statut: " + "</strong>" + data[i].status + "</br>" + "</br>" +
        "<strong>" + " Places: " + "</strong>" + data[i].bike_stands + "</br>" + "</br>" +
        "<strong>" + "Places disponible: " + "</strong>" + data[i].available_bike_stands + "</br>" + "</br>" +
        "<strong>" + "Vélos: " + "</strong>" + data[i].available_bikes +
        "<button id='btn_bkg'> Reserver</button>" ;
        this.btn_bkg = document.getElementById('btn_bkg');
        this.btn_bkg.addEventListener('click', function(e){
        sign.style.display = 'block';
        canvas.canvas.style.display= 'block';
        btn_bkg.style.display= 'none';

        });
      });
    }



      // Code du Timer reservation
      let ok = document.getElementById("btn_ok"),
          bkg = document.getElementById("bkg");


      // Fonction qui détérmine les limites du timer
      this.setTimer = function(){
        var now = new Date().getTime();
         sessionStorage.finDeLaReservation = now + 1200000;
         this.initTimer();
       }

      //Validation de la reservation, les autres evenement des boutons se trouve dans canvas.js

      let myForm = document.getElementById('booking-form');
      myForm.addEventListener('submit', (e) =>{
      let noSign = document.getElementById('no_sign');

        e.preventDefault();
      if(canvas.canOk == true && this.numberBikes > 0 && this.gare == "OPEN"){
        this.name = document.getElementById('name').value;
        this.surname = document.getElementById('surname').value;
        sessionStorage.setItem('station',this.stationBooked)
        bkg.innerHTML = "Vous avez reservé un vélo à " + "<strong>" + this.stationBooked + "</strong>"  + " au nom de " + "<strong>" + this.name + " " + this.surname + "</strong>" + "<br /> Temps Restant : " + "<strong id='timer'>20 min 00 s.</strong>";
        sign.style.display = 'none';
        canvas.canvas.style.display= 'none';
        canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.canOk = false;
        document.getElementById("no_sign").style.visibility = "hidden";
        this.setTimer();
        storageNames.idStorage();
      }
      else if(this.numberBikes == 0){
        noSign.innerHTML = "Pas de vélo disponible";
        noSign.style.visibility ="visible";
      }
      else if(this.gare == "CLOSE"){
        noSign.innerHTML = "Gare fermé";
        noSign.style.visibility ="visible";
      }
      else if(canvas.canOk == false){
        noSign.innerHTML = "Signature Manquante";
        noSign.style.visibility ="visible";
      }
    });
  }
}

var map = new Map();
const url = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=692f00218265e22095a98fbe60102fe88f67119d";

map.getRequestResponse(url);
