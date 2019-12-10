class Slider{
  constructor(){
      this.myImg = document.querySelector('#slideshow #slider');
      this.myImg.style.left = 0;
      this.count = 1;
      this.decal = 0;
      this.leftPosition = 0;
      this.interval;
      this.intervalAutoPlay;
      this.canMove = true;
      this.canPlay = true;
      this.right = document.getElementById('btn-right');
      this.left = document.getElementById('btn-left');
  }

  //Fonction pour faire déplacer les images vers la droite
  moveToRight() {
    if(this.count < 5 && this.canMove) {
      this.count++;
      this.canMove = false;
      this.interval = setInterval( e => {
        if (this.decal <= 19.5) {

           this.decal += 0.5;
           this.leftPosition -= 0.5;
           this.myImg.style.left = this.leftPosition + '%';
        } else {

          clearInterval(this.interval);
          this.decal = 0;
          this.canMove = true;
        }

      }, 14);

    } else {

      this.count = 1;
      this.moveToStart();
    }
  }

  //Fonction pour faire déplacer les images vers la gauche
  moveToLeft(){

   if(this.count > 1 && this.canMove) {
      this.count--;
      this.canMove = false;
      this.interval = setInterval( e => {

        if (this.decal <= 19.5) {

           this.decal += 0.5;
           this.leftPosition += 0.5;
           this.myImg.style.left = this.leftPosition + '%';
        } else {

          clearInterval(this.interval);
          this.decal = 0;
        }

      }, 14);
    }
  }

  moveToStart(){
    this.canMove = false;
    this.interval = setInterval( e => {

      if (this.leftPosition < 0) {
         this.leftPosition += 0.5;
         this.myImg.style.left = this.leftPosition + '%';
      } else {

        clearInterval(this.interval);
        this.canMove = true;
        this.leftPosition = 0;
      }

    }, 14);
  }

  autoPlay(){
    this.intervalAutoPlay = setInterval( () => {

      this.moveToRight();
    }, 5000);

  }
}
//Suite d'évenement: à chaque fois que l'on presse la touche "gauche" ou "droite" les images se déplace vers la direction choisi
document.addEventListener("keydown",(e) =>{
  let key = e.keyCode || e.which;

  if (slider.canMove) {

    if (slider.count < 5 && key == 39) {

      slider.moveToRight();
    } else if (slider.count > 1 && key == 37) {

      slider.moveToLeft();
    }
  }

});

//Evenement de direction au clique
 document.getElementById('btn-right').addEventListener("click",(e) =>{

    if (slider.count < 5 && slider.canMove) {
      slider.moveToRight();
    }

});

document.getElementById('btn-left').addEventListener("click",(e) =>{
    if (slider.count > 1 && slider.canMove) {
      slider.moveToLeft();
    }
});

document.getElementById('btn-stop').addEventListener("click",(e) =>{
  if (slider.intervalAutoPlay){
    clearInterval(slider.intervalAutoPlay);
    slider.intervalAutoPlay = false;
  }
});

document.getElementById('btn-play').addEventListener("click",(e) =>{

  if (!slider.intervalAutoPlay) {
    slider.autoPlay();
  }
});

var slider = new Slider();
