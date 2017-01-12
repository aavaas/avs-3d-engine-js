//renderer


function Engine (canvas,w,h) {	
	//init canvas
	this.canvas = document.getElementById(canvas);
	this.canvas.width  = w;
	this.canvas.height = h;	 
	this.canvasWidth  = this.canvas.width;
	this.canvasHeight = this.canvas.height;	
	this.ctx = this.canvas.getContext('2d');
	this.imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);	
	//2Xfaster pixel manipulation; but makes processor endianness dependent
	//http://jsfiddle.net/andrewjbaker/Fnx2w/
	this.buf = new ArrayBuffer(this.imageData.data.length);
	this.buf8 = new Uint8ClampedArray(this.buf);	
	this.data = new Uint32Array(this.buf);
	///=============================================================
	//init state
	this.colorstate = [0,255,0,255];	
	this.pipemat = mat4.create();		
	
	this.edgeTable = [];
}



Engine.prototype.swapBuffers= function () {	
	this.imageData.data.set(this.buf8); 
	this.ctx.putImageData(this.imageData, 0, 0);
};

Engine.prototype.putPixel= function (x,y,c=this.colorstate) {
	//bounds checking may not be done after clipping in rendering
	if (!isNaN(x) && !isNaN(y) && x < this.canvasHeight && x > 0 && y < this.canvasWidth && y > 0) {
		this.data[Math.floor(y)*this.canvasWidth+Math.floor(x)] = 
			(255  << 24) |    // alpha
			(c[2] << 16) |    // blue
			(c[1] <<  8) |    // green
			 c[0];            // red
	}
};

Engine.prototype.clear= function () {	
	var x = this.canvasHeight*this.canvasWidth;
	while (x !== 0) {	
		this.data[x--] = -16777216 ;this.data[x--] = -16777216;
		this.data[x--] = -16777216;this.data[x--] = -16777216;
		this.data[x--] = -16777216;this.data[x--] = -16777216;
		this.data[x--] = -16777216;this.data[x--] = -16777216;		
	}
	this.data[x--] = -16777216;	//black with alpha 255
};





///utilities function
Engine.prototype.lineDDA= function (c1,c2) {		
	var x1 =c1[0],y1=c1[1],x2=c2[0],y2=c2[1];
	var xdiff = x2-x1;
	var ydiff = y2-y1;	
	var steps= (Math.abs(xdiff) >= Math.abs(ydiff)) ?xdiff :ydiff;
	steps= Math.abs(steps);
	steps =(steps>1000)?1000:steps; //ultra long lines clip
	var xinc = xdiff/steps;
	var yinc= ydiff/steps;		
	for (var i =0;i<=steps ;i++){			
		this.putPixel(Math.floor(x1),Math.floor(y1));			
		y1+=yinc;
		x1+=xinc;
	}	
};

Engine.prototype.lineBre = function (c1,c2) {	
    var x0 = Math.floor(c1[0]),
		y0 = Math.floor(c1[1]),
		x1 = Math.floor(c2[0]),
		y1 = Math.floor(c2[1]),    
		dx = Math.abs(x1 - x0),		
		dy = Math.abs(y1 - y0),
		sx = x0 < x1 ? 1 : -1,		
		sy = y0 < y1 ? 1 : -1, 
		err = (dx>dy ? dx : -dy)/2;
	
	while (true) {
		this.putPixel(x0,y0);
		if (x0 === x1 && y0 === y1) break; //infinite loop if any error
		var e2 = err;
			if (e2 > -dx) { err -= dy; x0 += sx; }
			if (e2 < dy) { err += dx; y0 += sy; }
	}
};

Engine.prototype.circle = function (c1,r){
	var xc =c1[0],yc=c1[1],
		x=0,
		y=r,
		p=1-r;	
	while (x<=y){
		this.putPixel(xc+x,yc+y);
		this.putPixel(xc-x,yc+y);
		this.putPixel(xc+x,yc-y);
		this.putPixel(xc-x,yc-y);
		this.putPixel(xc+y,yc+x);
		this.putPixel(xc-y,yc+x);
		this.putPixel(xc+y,yc-x);
		this.putPixel(xc-y,yc-x);
		x++;
		if (p<0)
			p+= 2 * x + 1;
		else {
			y--;
			p+= 2 * (x-y) + 1 ;
		}
	}	
};

	
