//generic 3d object
function Entity(mesh) {
	this.mesh;
	this.vert =[];
	this.projected =[]; //todo implement projected table
	this.facenorm =[];
	this.vertnorm =[];
	this.visiblefaces = [];
	this.visiblevertices =[];
	
	this.matrix= mat4.create();
	this.tempmat= mat4.create();	
	
	this.up=[0,1,0];
	this.pivot=[0,0,0];
	this.position=[0,0,0];
	this.scale=[1,1,1];
	this.rot=[0,0,0];
}

Entity.prototype.addMesh = function (mesh) {
	this.mesh = mesh;
	this.mesh.createEdgeTable();
	this.mesh.calculateNormals();
	//For transformed mesh
	for (var i = 0; i< mesh.v.length; i++){ //allocate memory by 2nd level copy
		this.vert.push(this.mesh.v[i].slice());}	
	for (var i = 0; i< mesh.fn.length; i++){ //allocate memory by 2nd level copy
		this.facenorm.push(this.mesh.fn[i].slice());}
}

Entity.prototype.pipeLineTrans = function (parentMatrix,prespmat) {
	var v=this.mesh.v,
		fn=this.mesh.fn,
		tempvert =this.vert,
		tempface = this.facenorm,
		i;
	
	//vertives transform
	mat4.identity(this.tempmat);					
	mat4.multiply(this.tempmat,this.tempmat,parentMatrix);
	mat4.multiply(this.tempmat,this.tempmat,this.matrix);	
	for (i=0;i<v.length;i++){
		vec4.transformMat4(tempvert[i],v[i], obj.tempmat);			
	}
	//face normals transform 
	this.visiblefaces =[];	
	mat4.transpose(this.tempmat,mat4.invert(this.tempmat,this.tempmat));	
	for (i=0; i<fn.length; i++){
		vec3.transformMat4(tempface[i],fn[i],this.tempmat);
		vec3.normalize(tempface[i],tempface[i]);
		//visible face detection	
		if ( vec3.dot( tempvert[ this.mesh.f[i][0][0] ], tempface[i] ) < 0 ) {
			this.visiblefaces.push(i);			
		}
	}
	//vertices normal transform
	/*this.visiblevertices= [];
	for all visible faces
		get all three vertices
		if vv array at vertex index in not filled
		transform the vertex add to vv array
	*/
	
	

};



Entity.prototype.updateMatrix = function () {
	//todo make general transformation matrix and based on pivot
	mat4.identity(this.matrix);
	mat4.translate(this.matrix,this.matrix,this.position);
	mat4.rotateX(this.matrix,this.matrix,this.rot[0]);
	mat4.rotateY(this.matrix,this.matrix,this.rot[1]);
	mat4.rotateZ(this.matrix,this.matrix,this.rot[2]);	
	//non uniform scaling will destory normals //todo
	mat4.scale(this.matrix,this.matrix,this.scale);
};

Entity.prototype.rotateView= function (x,y,z){
	mat4.identity(this.tempmat); 	
	//around horizontal axis
	mat4.rotate(this.tempmat,this.tempmat,y,vec3.cross(this.up,this.up,this.position));		
	vec3.cross(this.up,this.position,this.up);	
	vec3.normalize(this.up,this.up);	
	//around up axis
	mat4.rotate(this.tempmat,this.tempmat,x,this.up);	
	vec3.transformMat4(this.position,this.position,this.tempmat);	
	mat4.multiply(this.matrix, this.matrix, this.tempmat);	
	mat4.lookAt(this.matrix, this.position, this.pivot, this.up);
};

Entity.prototype.rotateLeveled = function (x,y){
	mat4.identity(this.tempmat); 
	mat4.rotate(this.tempmat,this.tempmat,y,vec3.cross([],this.up,this.position));			
	mat4.rotateY(this.tempmat,this.tempmat,x);	
	vec3.transformMat4(this.position,this.position,this.tempmat);	
	mat4.multiply(this.matrix, this.matrix, this.tempmat);	
	mat4.lookAt(this.matrix, this.position, this.pivot, this.up);
	
};

