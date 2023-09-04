import * as THREE from "three";
import { Type } from "../../data/Type";
import { MetaType } from "../../data/MetaType";
import { NodeSet } from "../../data/NodeSet";
import { Entity } from "../Entity";
import { Assembly } from "../../data/model/Assembly";

/** Defines an entity associated to an object. */
export class ObjectEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The assembly of the object. */
	private _assembly: Assembly;

	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The assembly of the object. */
	get assembly(): Assembly { return this._assembly; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name: string, parent: Type, data?: any) {
	 
		// Call the parent class constructor
		super(name, parent, data, ["object"]);

		// Create the child nodes
		this._assembly = new Assembly("assembly", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		//TEMPORAL
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5),
			new THREE.MeshPhongMaterial({ color: 0x0000ff}));
		this._representation.add(sphere);

	}


	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	 update(deltaTime:number = 0, forced:boolean = false) {

		// TODO Change shape of object here
		// Call the base class function
		super.update(deltaTime, forced);

	}

}