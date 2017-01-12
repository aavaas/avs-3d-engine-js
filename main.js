//sce= new Scene();
//sce.newCamera();
//sce.newObject();
$("document").ready(function (){
	
	engine= new Engine("maincanvas",400,400);//global renderer	
	event = new Event($('#maincanvas'));//canvas event	
	mainview = new View(event,100);
	//info view asyncronous to main view
	infoview =new View(event,200);
	infoview.mainLoop= function (e) {$("#info").text(Math.floor(1000/mainview.delay));}
	
	//camera defination
	camera= new Entity();
	camera.position = [60,60,60];
	camera.scale = [2,2,2];
	camera.pivot = [0,0,0];
	camera.up=[0,1,0];
	mat4.lookAt(camera.matrix, camera.position, camera.pivot, camera.up);
	//display object
	obj= new Entity();		
	obj.addMesh(new Mesh);
	obj.position=[0,10,0];
	obj.scale=[10,10,10];
	obj.updateMatrix();
	
	var deltaR =-10/180;
	tempview = mat4.create();
	mainview.mainLoop = function (e) {		
		//obj.rot[1]= (obj.rot[1] + 0.01) % 6.2831853;obj.updateMatrix();
		
		if (e.scroll){
			var ds= (e.scroll>0)? 0.9 :1.1;
			vec3.scale(camera.position,camera.position,ds);			
			mat4.lookAt(camera.matrix, camera.position, camera.pivot, camera.up);
		}
		if (e.drag) {
			var tx=(e.x-e.downX)>40?deltaR:((e.x-e.downX)<-40?(-deltaR):0);
			var ty=(e.y-e.downY)>40?deltaR:((e.y-e.downY)<-40?(-deltaR):0);				
			camera.rotateView(tx,ty);			
		}
		
		//engine.colorstate =[Math.random()*255,Math.random()*255,Math.random()*255];
		engine.render(obj,camera)//scene,camera	
		
	};	
	
	mainview.mainLoop(event); //onetime
	//mainview.startMainLoop(); 	
	//infoview.startMainLoop();
	
	 $('<button/>', {
        text: "Playing",
        id: 'btn_1',
        click: (function () { 
			var tog = true;
			return  (function () {
				if (tog) {
					mainview.stopMainLoop();
					 $('#btn_1').html("Stopped");
					tog =false;
				} else {
					mainview.startMainLoop();	
					$('#btn_1').html("Playing");
					tog =true;
				}
			})})(),
    }). appendTo("#control");
	
})


