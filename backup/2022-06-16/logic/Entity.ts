import * as THREE from "three";
import { Type } from "../data/Type";
import { MetaType } from "../data/MetaType";
import { Vector } from "../data/types/complex/Vector";
import { Euler } from "../data/types/complex/Euler";
import { NodeSet } from "../data/NodeSet";
import { Behavior } from "./Behavior";

/** Defines a logic Entity. */
export class Entity extends Type {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The representation of the Entity. */
	protected _representation: THREE.Object3D;
	
	/** The position of the Entity. */
	protected _position: Vector;

	/** The rotation of the Entity. */
	protected _rotation: Euler;

	/** The behaviors of the Entity. */
	protected _behaviors: NodeSet<Behavior>;

	/** The children entities of the Entity. */
	protected _entities: NodeSet<Entity>;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The representation of the Entity. */
	get representation(): THREE.Object3D { return this._representation; }
	
	/** The position of the Entity. */
	get position(): Vector { return this._position; }
	
	/** The rotation of the Entity. */
	get rotation(): Euler { return this._rotation; }

	/** The behaviors of the Entity. */
	get behaviors(): NodeSet<Behavior> { return this._behaviors; }

	/** The children entities of the Entity. */
	get entities(): NodeSet<Entity> { return this._entities; }

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Entity instance.
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name?: string, parent?: Type, data?: any, types: string[]=[]) {
	 
		// Call the parent class constructor
		super(name, parent, data, [...types, "entity"]);

		// Create the child nodes
		this._position = new Vector("position", this);
		this._rotation = new Euler("rotation", this);
		this._behaviors = new NodeSet<Behavior>("behaviors", this, Behavior);
		this._entities = new NodeSet<Entity>("entities", this, Entity);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the basic representation
		this._representation = new THREE.Object3D();
		this._representation.name = this.nodeName;
		if(this.nodeParent && this.nodeParent.nodeTypes.includes("entity"))
			(this.nodeParent as Entity)._representation.add(this._representation);

		// Call the start functions in the behaviors
		for (let behavior of this.behaviors) {
			let startFunction = behavior.startFunction.value;
			if (startFunction) startFunction(this);
		}
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime:number = 0, forced:boolean = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.node.updated && !forced) return;

		// Update the position, rotation and scale of the representation
		let rep = this._representation, p = this.position, r = this.rotation;
		if (!p.node.updated) rep.position.set(p.x.value, p.y.value, p.z.value);
		if (!r.node.updated) rep.rotation.set(r.x.value, r.y.value, r.z.value);
		
		// Call the update functions in the behaviors
		for (let behavior of this.behaviors) {
			let updateFunction = behavior.updateFunction.value;
			if (updateFunction) updateFunction(this);
		}

		// Call the base class function
		super.update(deltaTime, forced);

		// Show a message on console
		// console.log("Updated Entity: " + this.nodeName);
	}
}