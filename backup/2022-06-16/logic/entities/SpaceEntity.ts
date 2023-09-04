import * as THREE from "three";
import { Type } from "../../data/Type";
import { MetaType } from "../../data/MetaType";
import { NodeSet } from "../../data/NodeSet";
import { Entity } from "../Entity";
import { ObjectEntity } from "./ObjectEntity";

/** Defines an entity associated to an interaction Space. */
export class SpaceEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The subspaces of the space. */
	private _spaces: NodeSet<SpaceEntity>;

	/** The objects of the space. */
	private _objects: NodeSet<ObjectEntity>;
	
	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The subspaces of the space. */
	get spaces(): NodeSet<SpaceEntity> { return this._spaces; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new Space instance.
	 * @param name The name of the space.
	 * @param parent The parent node of the space.
	 * @param data The initialization data. */
	constructor(name: string, parent: Type, data?: any) {
	 
		// Call the parent class constructor
		super(name, parent, data, ["space"]);

		// Create the child nodes
		this._spaces = new NodeSet<SpaceEntity>("spaces", this, SpaceEntity);
		this._objects = new NodeSet<ObjectEntity>("objects", this, ObjectEntity);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the representation of the space
		this._representation = new THREE.Scene();

		// TEMPORAL: Create a grid to represent the space
		let grid = new THREE.GridHelper(10, 20);
		this._representation.add(grid);

		// TEMPORAL: Create lights to illuminate the space
		let ambientLight = new THREE.AmbientLight(0x444444);
		this._representation.add(ambientLight);
		let directionalLight = new THREE.DirectionalLight(0xffffff);
		this._representation.add(directionalLight);

	}
}