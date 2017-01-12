//geometry
/*
	horse geometry 	V-E+F=2 
	v=10095*9*32=2mb
	f=9518*3*32=1mb
	e=19611*4*32=2.5mb
	=5mb =0.7mB *23= 16 mB
	32 bit floats
	vertices 3, normals 3, texture 2,
	16 bit uint
	faces 3v+3n+3t, edge v2+f2, 
*/
function Mesh() {
	//vertex table
	this.v=	[[1,1,1,1], [1,1,-1,1], [1,-1,1,1], [1,-1,-1,1], [-1,1,1,1],
			[-1,1,-1,1], [-1,-1,1,1], [-1,-1,-1,1], [-2,-1,2,1], [2,-1,2,1],
			[2,-1,-2,1], [-2,-1,-2,1]];	
	//face table [vi*3], [ei*3] //[vni*3],[vti*3]
	this.f= [
	[[0,2,1],[ ]],
	[[0,1,4],[ ]],
	[[0,6,2],[ ]],	
	[[0,4,6],[ ]],
	[[1,2,3],[ ]],	
	[[1,3,7],[ ]],
	[[1,5,4],[ ]],
	[[1,7,5],[ ]],
	[[2,6,3],[ ]],		
	[[3,6,7],[ ]],
	[[4,5,6],[ ]],
	[[5,7,6],[ ]],	
	[[8,9,11],[ ]],
	[[9,10,11],[ ]]
	];
	//edge table [vi*2,fi*2]
	this.e=[];
	//normal table [n*3]
	this.fn = [];
	this.vn = [];	
}


Mesh.prototype.calculateNormals = function () {
	var v0,v1,v2,i,
		u = [],
		v = [],
		norm = [];
	var ft = this.f,
		fn = this.fn;
	//Face normals and add to normal index
	for (i =0; i<this.f.length; i++){				
			v0=this.v[ft[i][0][0]];
			v1=this.v[ft[i][0][1]];
			v2=this.v[ft[i][0][2]];
			
			vec3.subtract(u,v1,v0);
			vec3.subtract(v,v2,v1);
			vec3.cross(norm, u,v);
			vec3.normalize(norm,norm);
			fn.push(norm.slice());			
	}	
};

Mesh.prototype.createEdgeTable = function () {
	var et= this.e,
		ft= this.f,
		vt= this.v,
		i,j,k,l,vi1,vi2;
	//first pass: find edges
	for (i =0; i<ft.length; i++){
		for (j=0; j<3;j++){		
			k = (j===2)? 0 : j+1;
			vi1=ft[i][0][j];
			vi2=ft[i][0][k];
			if (vi1<vi2){
				et.push([vi1,vi2,i,-1]); //create edge with adj face
				ft[i][1][j]= et.length-1; // edge of face
	}}}
	//second pass: match triangles to edges
	for (i =0; i<ft.length; i++){		
		for (j=0; j<3;j++){		
			k = (j===2)? 0 : j+1;		
			vi1=ft[i][0][j];
			vi2=ft[i][0][k];			
			if (vi1>vi2){
				for (l=0; l< et.length;l++) {
					if (et[l][0] == vi2 && et[l][1] == vi1 && et[l][3] === (-1)){
						et[l][3] = i; //adj face of edge
						ft[i][1][j]= l; //edge of face
						break;
	}}}}}	
};

Mesh.prototype.bakeTranslate = function (x,y,z=0) {
	for (var i in this.v) {
		this.v[i][0]+=x;
		this.v[i][1]+=y;
		this.v[i][2]+=z;		
	}
};
	
Mesh.prototype.bakeScale= function (s) {
	for (var i in this.v) {		
		this.v[i][0]*=s;
		this.v[i][1]*=s;
		this.v[i][2]*=s;		
	}
};

Mesh.prototype.bakeRotz= function (a) {
	for (var i in this.v) {
		var x1=this.v[i][0];
		var y1=this.v[i][1];
		this.v[i][0]=x1*Math.cos(a)-Math.sin(a)*y1;
		this.v[i][1]=x1*Math.sin(a)+Math.cos(a)*y1;				
	}
};

Mesh.prototype.bakeRoty= function (a) {
	for (var i in this.v) {	
		var x1=this.v[i][0];
		var z1=this.v[i][2];
		this.v[i][0]=x1*Math.cos(a)-Math.sin(a)*z1;
		this.v[i][2]=x1*Math.sin(a)+Math.cos(a)*z1;				
	}
};

Mesh.prototype.bakeRotx= function (a) {
	for (var i in this.v) {
		var y1=this.v[i][1];
		var z1=this.v[i][2];	
		this.v[i][1]=y1*Math.cos(a)-Math.sin(a)*z1;
		this.v[i][2]=y1*Math.sin(a)+Math.cos(a)*z1;				
	}
};