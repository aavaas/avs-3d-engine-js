/* 
//previously: calculate all vertex normals and edge table with face adjancy
for each object
	calculate composite matrix
	transform whole mesh,normals with matrix //vertex redundancy removal
	for each triangle: 
		back face removal  //face redundancy removal
		transform vertices normals
		create edge flow table  //edge redundancy removal
order objects from front to back acc to centre 
for each scan line: for each object	from front to back 
	manage active edge table //todo merge all objects edge table
	interpolate vertically x,z edges crossing that scanline
	for each edge pairs:
		interpolate horizontally z
		z buffer compare://lighting redundancy removal
			interpolate normals, colours
			shadow compare
			lighting calculation
			put pixel
*/
///========================================================================

Engine.prototype.rasterise = function (scene,camera) {		
	var obj = scene;
	var w,i,j,k;
	var af=[];
	///-------------------------------------------------------------------------
	
	obj.pipeLineTrans(camera.matrix);
	
	//createEdgeFlowTable(obj);
	
	/*for scanline form 1 to canvas height
		Engine.increasescanline();
		Engine.drawscanline();	
	*/
	
	///-------------------------------------------------------------------------
	var vf = obj.visiblefaces;
	for (i=0;i<vf.length;i++){
		// a=obj.vert[obj.mesh.f[vf[i]][0][0]]; //a vertex
		for (j=0;j<3;j++){		
			k = (j===2)? 0 : j+1;
			
			var vi1=obj.mesh.f[vf[i]][0][j];
			var vi2=obj.mesh.f[vf[i]][0][k];	
			
			w=-obj.vert[vi1][2];
			var x0= obj.vert[vi1][0]/w;
			var y0= obj.vert[vi1][1]/w;
			
			w=-obj.vert[vi2][2];	
			var x1= obj.vert[vi2][0]/w;
			var y1= obj.vert[vi2][1]/w;			
			
			this.lineDDA(this.VTrans(x0,y0),this.VTrans(x1,y1))								
		}		
	}
	//camera centre display
	vec3.transformMat4(af,camera.pivot,camera.matrix);
	this.circle(this.VTrans(af[0]/-af[2],af[1]/-af[2]),5);
};

Engine.prototype.makeEdgeAndFlowTable = function (obj) {
	
	var ET = this.edgeTable;
	var vf = obj.visiblefaces;
	var E=[];
	var F=[];
	
	var i,j;
	var v1,v2,v1x,v2x,v1y,v2y;
	//Edge table
	for (i=0;i<vf.length;i++){
		E = obj.mesh.f[vf[i]][1]; //edges of triangle	
		for (j=0;j<3;j++){
			if (!ET[ E[j] ]){
				v1 = obj.vert[obj.mesh.e[E[j]][0]];
				v2 = obj.vert[obj.mesh.e[E[j]][1]];
				//todo implement camera zoom //use proj table
				v1x = v1[0]/v1[2];
				v1y = v1[1]/v1[2];
				v2x = v2[1]/v2[2];
				v2y = v2[0]/v2[2];
				if (v1y == v2y){ //parallel edge removal
					E.splice(j,1);		
				} else if (v1y>v2y){
					ET[E[j]] = [v2x,v2y,v1x,v1y,(v1x-v2x)/(v1y-v2y)];
				} else {
					ET[E[j]] = [v1x,v1y,v2x,v2y,(v2x-v1x)/(v2y-v1y)];			
				}				
			}
		}
		//flow table
		
	
	}
		
};

Engine.prototype.VTrans = function (cx,cy) {
	//todo: make it relative to canvas
	return [cx*200 +200, cy*-200 +200];
};


Engine.prototype.render= function (scene,camera) {	
	this.clear();	
	
	this.rasterise(scene,camera);
	
	this.swapBuffers();
};