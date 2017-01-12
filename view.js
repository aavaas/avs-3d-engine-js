//viewport //interaction
//can define a part of canvas
//shown in one canvas and rendered by one engine

function View (event,fps) {	
	this.event =event;
	
	this.mainLoop;
	this.fps=fps;
	this.prevtime =Date.now();
	this.delay;
	this.curID;
}

View.prototype.startMainLoop = function (){	
	var now=Date.now();
	if (now-this.prevtime >= this.fps){
		this.delay=now-this.prevtime;
		this.prevtime = Date.now();
		this.mainLoop(this.event.state);
		this.event.clear();
		console.log("here");
	}
	this.curID=window.requestAnimationFrame(this.startMainLoop.bind(this));	
};

View.prototype.stopMainLoop = function () {
	cancelAnimationFrame(this.curID);
}








