/*
 * Shape.ts
 * ===========
 * Placeholder shape to demonstrate setup works. 
 * Has capacity to import custom .glsl shader files
 */

import * as THREE from "three";

import vertShader from "./glsl/torus.vs";
import fragShader from "./glsl/torus.fs";

export class VertexModifier {
	private xIndex: number;
	private yIndex: number;
	private zIndex: number;

	constructor(private index: number, private positions:Array<number>) {
		this.xIndex = index * 3;
		this.yIndex = this.xIndex + 1;
		this.zIndex = this.yIndex + 1;
	}

	get x() {
		return this.positions[this.xIndex];
	}

	set x(val: number) {
		this.positions[this.xIndex] = val;
	}
	
	get y() {
		return this.positions[this.yIndex];
	}

	set y(val: number) {
		this.positions[this.yIndex] = val;
	}
	
	get z() {
		return this.positions[this.zIndex];
	}
	set z(val: number) {
		this.positions[this.zIndex] = val;
	}
}

export class PlaneModifier {
	private geom: THREE.PlaneGeometry;
	private vertices: VertexModifier[] = [];

	constructor(private resolution: number) {
		this.geom = new THREE.PlaneGeometry(8, 8, resolution, resolution);
		let positions = this.geom.attributes.position.array as Array<number>;
		let vi = 0;		
		for ( let i = 0; i < positions.length; i += 3 ) {
			this.vertices.push(new VertexModifier(vi++, positions));
		}
	}

	vertexAt(x: number, y:number):VertexModifier {
		return this.vertices[y*this.resolution+x];
	}

	get geometry() {
		return this.geom;
	}
}

export default class Shape {
	mesh: THREE.Mesh;
	timeU: THREE.IUniform;
	plane: PlaneModifier;

	constructor(parentScene: THREE.Scene) {
		this.plane = new PlaneModifier(200);
		for(let x = 0; x < 20; x++) {
			for(let y = 0; y < 20; y++) {
				this.plane.vertexAt(x+90, y+130).z = 0.5;
			}
		}
		const mat = new THREE.RawShaderMaterial({
			uniforms: {
				time: {value: 0}
			},
			vertexShader: vertShader,
			fragmentShader: fragShader
		});
		this.timeU = mat.uniforms.time;
		this.mesh = new THREE.Mesh(this.plane.geometry, mat);
		this.mesh.rotation.set(0, 1, 0);
		parentScene.add(this.mesh);
	}

	public update(secs: number): void {
		this.timeU.value = 1;
	}
}