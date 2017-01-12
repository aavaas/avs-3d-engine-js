//global player constructor
//handles UI, UI event, mainloop, 
objarr=[];	
objarr[0]=myobj0;
objarr[1]=myobj1;
objarr[2]=myobj2;
objarr[3]=myobj3;
objarr[4]=myobj4;
objarr[5]=myobj5;
objarr[6]=myobj6;
objarr[7]=myobj7;
objarr[8]=myobj8;
objarr[9]=myobj9;
objarr[10]=myobj10;
objarr[11]=myobj11;
objarr[12]=myobj12;
objarr[13]=myobj13;
objarr[14]=myobj14;
objarr[15]=myobj15;
objarr[16]=myobj16;
objarr[17]=myobj17;
objarr[18]=myobj18;
objarr[19]=myobj19;
objarr[20]=myobj20;
objarr[21]=myobj21;
objarr[22]=myobj22;
objarr[23]=myobj23;
objarr[24]=myobj24;

	
	
function GpsPlayer(arg){	
	//properies
	this.event=arg.event;
	this.canvas= $(arg.canvas);
	this.info= $(arg.info);
	this.playbut=$(arg.playbut);
	this.renderbut= $(arg.but);
	this.slider=$(arg.slider);
	this.modelbut=$(arg.modelbut);
	this.resetbut=$(arg.resetbut);
	this.rotatebut=$(arg.rotatebut);
	
	
	this.state={
		delay: arg.delay,		
		currentframe: 0,
		framerate: arg.delay,
		mainloop:false,//is mainloop running
		angleX:0,
		angleY:0,
		zoom: 1,
		rendering:true,//updating the engine
		playing:false,//playing the object sequence
		rotating:false,
		modelangle:0,
		modelno:2,
		frames:1,
	}//saving this will recover player state
	
	this.time= Date.now();	
	this.starttime= this.time;
	this.currenttime= this.time;
	this.slack=0;
	
	//engine instance for this player
	this.engine = new GPSEngine(this.canvas[0],document.getElementById("mybufferCanvas"));
	this.engine.addLight(vec3.fromValues(0,60,0));
	this.engine.addLight(vec3.fromValues(-60,0,0));
	
	
	///init Ui
	this.playbut.button({ label: "Play" }).click(this.playButFun.bind(this));	
	this.renderbut.button({ label: "Stop Rendering" }).click(this.renderButFun.bind(this));	
	this.modelbut.button({ label: "change model" }).click(this.modelButFun.bind(this));
	this.resetbut.button({ label: "reset model" }).click(this.resetButFun.bind(this));
	this.rotatebut.button({ label: "rotate model" }).click(this.rotateButFun.bind(this));
	
	this.slider.slider();	
	
	//$.getScript("http://localhost/ddd/?frame=1&file=car",((function() {this.objarr[0]=myobj;}).bind(this)));
	//$.getScript("http://localhost/ddd/?frame=1&file=airboat",((function() {this.objarr[1]=myobj;}).bind(this)));	
	$.ajax({
			url: "http://localhost/ddd/?frame=1&file=car",
			dataType: "script",
			success: ((function() {this.objarr[0]=myobj;}).bind(this)),
			async:false,
			});
	$.ajax({
			url: "http://localhost/ddd/?frame=1&file=airboat",
			dataType: "script",
			success: ((function() {this.objarr[1]=myobj;}).bind(this)),
			async:false,
			});
	//copiedObject = $.extend({},originalObject);
	
	this.state.frames=24;
	
	
	
	// var i=0;
	// for (i=0;i<this.state.frames;i++) {
	// $.ajax({
				// url: "http://localhost/ddd/?frame="+(i+1)+"&file=airboat",
				// dataType: "script",
				// success: ((function() {this.objarr[i]=myobj;}).bind(this)),
				// async:false,
				// });
				// console.log(i,"load")
		// }
		
	
	
	
	
	
	

}






//This is the main loop of the GpsPlayer instance
GpsPlayer.prototype.mainLoop = function () {if(!this.mainloop){
	this.starttime=Date.now();
	this.mainloop=true;
	var diff;
	
	
	///main work	
	if(this.state.rendering){
		
		
	
		//update camera state
		if(this.event.mouse.drag == true){	
			diff=this.event.mouse.downX-this.event.mouse.x;
			this.state.angleX+=diff/400;
			
			diff=this.event.mouse.downY-this.event.mouse.y;
			this.state.angleY-=diff/400;
			
		}	else if (this.event.mouse.scroll != 0) {
			this.state.zoom-=this.event.mouse.scroll/20;		
		} 
		
		
		
		
		if (this.state.playing){
			//update player state
			
			if (this.state.currentframe>=this.state.frames){
				this.state.currentframe=0;
			}
			this.slider.slider( "option", "value", this.state.currentframe );
			
			//update model state
			this.state.modelangle+=(this.state.rotating)?0.1:0;
			
			//updatedisplay state();	
			this.updateDisplay();
			// if (this.state.modelno==1){
			// this.updateDisplay(this.objarr[0]);
			// this.state.modelno=2;
			// } else {
			// this.updateDisplay(this.objarr[1]);
			// this.state.modelno=1;		
			// }
			
			this.state.currentframe+=1;
		}

		
		
		
		//debuginfo
		//this.info.text(this.event.info());
		this.info.text("framerate="+this.framerate+" frame"+this.state.currentframe);
		//this.info.text((this.currentframe++).toString());
		//(this.starttime-this.lastrendertime)+);
	
	}
	///end main work
	
	//frame rate control
	this.event.clear();
	this.slack=(Date.now()-this.starttime);
	this.framerate=this.slack;
	diff=this.state.delay-this.slack;	
	this.slack=(diff<0)?0:diff;
	this.framerate=Math.round(1000/(this.framerate+this.slack+5));
	
	setTimeout(this.mainLoop.bind(this),this.slack+5);	//5msec for all call back and processing time
	this.mainloop=false;//let no two mainloop run at the same time
}};


GpsPlayer.prototype.updateDisplay = function (obj){ 		
	
	//camera
	mat4.GPSlookAt(this.engine.viewmat, vec3.fromValues(0, 0,-60), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))
	mat4.rotate(this.engine.viewmat,this.engine.viewmat,this.state.angleX,vec3.fromValues(0,1,0));
	mat4.rotate(this.engine.viewmat,this.engine.viewmat,this.state.angleY,vec3.fromValues(1,0,0));	
	mat4.scale(this.engine.viewmat,this.engine.viewmat,vec3.fromValues(this.state.zoom,this.state.zoom,this.state.zoom));
	
	
	//rotate model by some angle
	mat4.identity(this.engine.modelmat);	
	mat4.rotate(this.engine.modelmat,this.engine.modelmat,this.state.modelangle,vec3.fromValues(0,1,0));
	

	//console.log("reached here");
	this.engine.startDraw();
		//set the color
		this.engine.state.color.setColor(0,100,0);	
		//draw the object
		this.engine.drawObject(objarr[this.state.currentframe]);//this.objarr[this.state.currentframe]);
		

		//engine.drawLine(0,0,0,10,10,0);
	
	this.engine.swapBuffers();
		
}

GpsPlayer.prototype.renderButFun = function() {
			if (this.state.rendering){	
				this.renderbut.button( "option", "label" ,"Start rendering").css('color','maroon');
				this.state.rendering = false;											
			} else {				
				this.renderbut.button( "option", "label" ,"Stop Rendering").css('color','white');
				this.state.rendering = true;		
			}										
}

GpsPlayer.prototype.playButFun = function() {
			if (this.state.playing){	
				this.playbut.button( "option", "label" ,"Play");
				this.state.playing = false;											
			} else {				
				this.playbut.button( "option", "label" ,"Pause");
				this.state.playing = true;		
			}										
}

GpsPlayer.prototype.modelButFun = function() {
	if (this.state.modelno==1){
		this.state.modelno=2;
	} else {
	  this.state.modelno=1;
	}

}

GpsPlayer.prototype.resetButFun = function() {
	this.state.angleX=0;
	this.state.angleY=0;
	this.state.zoom=1;
	this.state.modelangle=0;
	
}

GpsPlayer.prototype.rotateButFun = function() {
	if (this.state.rotating){	
			this.rotatebut.button( "option", "label" ,"Rotate Model");
			this.state.rotating = false;											
		} else {				
			this.rotatebut.button( "option", "label" ,"Pause Rotation");
			this.state.rotating=true;
			
		}	
	
}