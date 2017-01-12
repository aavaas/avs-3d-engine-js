/*Event handling routine*/

//asynchronous Event handler for the entity
function Event(entity){
        var self=this;
		this.entity=entity;
				
		//state object
		this.state = {			
			x:0,
			y:0,
			downX:0,
			downY:0,
			down:false,				
			drag:false,
			scroll:0,			
		};					
		
		//call back functions////////////////////////////
		this.mouseDrag = function(e) {
			self.state.drag=true;
			self.state.x=e.pageX-this.offsetLeft;
			self.state.y=e.pageY-this.offsetTop;	
			return false;//stop propogation
		};		
		this.mouseDown = function (e){
			self.state.down=true;					
			self.state.x=e.pageX-this.offsetLeft;
			self.state.y=e.pageY-this.offsetTop;
			if (self.state.drag != true){
				self.state.downX=self.state.x;
				self.state.downY=self.state.y;				
				self.entity.mousemove(self.mouseDrag);//bind mousemove
			}	
		};	
		this.mouseUp = function (e){	
			self.entity.unbind("mousemove");  //unbind mousemove
			self.state.down=false;
			self.state.drag=false;			
			self.state.x=e.pageX-this.offsetLeft;
			self.state.y=e.pageY-this.offsetTop;						
		};
		this.mouseLeave = function(e) {
			if (self.state.down == true)
			{
				self.entity.unbind("mousemove");
			}
			self.state.down=false;						
		};	
		this.mouseScroll = function(e) {			
			self.state.scroll=e.originalEvent.deltaY;
			if(e.preventDefault) { e.preventDefault(); } 
		};
		
		//iniit///////////////////////////////////////////
		this.entity.
			mousedown(this.mouseDown).
			mouseup(this.mouseUp).			
			mouseleave(this.mouseLeave).
			bind("wheel mousewheel",this.mouseScroll);
			
}

Event.prototype.infoString = function () {
	return this.state.down+ " "+				
		this.state.downX+ " "+
		this.state.downY+ " "+
		this.state.drag+ " "+
		this.state.x + " " +
		this.state.y+ " "+
		this.state.scroll+ " ";
}

Event.prototype.clear =function () {	
	//this.state.drag=false;//reset drag		
	this.state.scroll=0;//reset scroll
}

