class Canvas{
	constructor(canvasContainerId, containerId){
		this.container = document.getElementById(containerId);
		this.canvas = document.createElement("canvas");
		this.canvas.height=70;
		this.canvas.width= 200;
		this.canvas.className = "my-canvas";
		document.getElementById(canvasContainerId).appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.canDraw = false;
		this.canOk = false;
		this.cancel = document.getElementById("btn_cancel");
		this.addClearBtn();
		this.addEvents();
	}

	addClearBtn(){
		this.clear = document.createElement("button");
		this.clear.className = "btn_del";
		this.clear.textContent ="Effacer";
		this.container.appendChild(this.clear);
	}

	addEvents(){
		//Evenement : quand le bouton de la souris est cliquer sur le canvas on peut dessiner dedans
		this.canvas.addEventListener('mousedown', (e) =>{
			this.canDraw = true;
			this.canOk = true;
		  this.ctx.beginPath();
		})

		//Recuperation de la position de la souris à chaque déplacement pour pouvoir ecrire
		this.canvas.addEventListener('mousemove', (e) =>{
			if(this.canDraw){
				let x = e.offsetX,
				 		y = e.offsetY;
				this.ctx.lineTo(x,y);
				this.ctx.stroke();
			}
		})

		//Lorsque le bouton de la souris est relaché. On ne dessine plus.
		this.canvas.addEventListener('mouseup',(e) =>{
			this.canDraw = false;
		})

		this.canvas.addEventListener('touchstart', (e) =>{
			this.canDraw = true;
			this.canOk = true;
			this.ctx.beginPath();
		})

		this.canvas.addEventListener('touchmove', (e) => {
			e.preventDefault();
					if(this.canDraw){
						let pos 			= e.targetTouches['0'],
						canvasOffset 	= this.canvas.getBoundingClientRect(),
						x = pos.clientX - canvasOffset.left,
						y = pos.clientY - canvasOffset.top;

						this.ctx.lineTo(x,y);
						this.ctx.stroke();
					}
				});

		this.canvas.addEventListener('touchend',(e) =>{
			this.canDraw = false;
		})

		//Fonction des différent bouton en dessous du canvas
		//Celui-ci permet d'effacer le contenu du canvas.
		this.clear.addEventListener('click',(e) =>{
			this.canOk = false;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		})

		//Ce bouton permet d'annuler l'affichage du canvas , le vide et fait disparaitre tout le contenu lié au canvas(le canvas et les 3 boutons)
		this.cancel.addEventListener('click',(e) =>{
			this.canOk = false;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.container.style.display = 'none';
			this.canvas.style.display= 'none';
			btn_bkg.style.display= 'block';
		})

	}
}

var canvas = new Canvas("my-canvas-container", "sign");
