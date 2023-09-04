import * as THREE from "three";
import { Type } from "../data/Type";
import { MetaType } from "../data/MetaType";
import { NodeSet } from "../data/NodeSet";
import { Vector } from "../data/types/complex/Vector";
import { Euler } from "../data/types/complex/Euler";
import { Presence } from "./interaction/Presence";
import { View } from "./interaction/View";

/** Defines a user. */
export class User extends Type {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The presences of the user in the interaction spaces. */
	protected _presences: NodeSet<Presence>;

	/** The view of the user. */
	protected _views: NodeSet<View>;

	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The presences of the user in the interaction spaces. */
	get presences(): NodeSet<Presence> { return this._presences; }

	/** The point of views of the user. */
	get views(): NodeSet<View> { return this._views; }

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new User instance.
	 * @param name The name of the data type.
	 * @param parent The parent data type.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Type, data?: any) {
	 
		// Call the parent class constructor
		super(name, parent, data, new MetaType("user"));

		// Create the child nodes
		this._presences = new NodeSet<Presence>("presences", this, Presence);
		this._views = new NodeSet<View>("views", this, View);

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// Create the defaults
		if (this._presences.count == 0) {
			let spaces = (this.node.parent as any).spaces;
			for (let space of spaces) {
				let presence = new Presence("Presence", this._presences);
				presence.space = space;
			}
		}
		if (this._views.count == 0) new View("DefaultView", this._views);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime: number = 0, forced:boolean = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.nodeUpdated && !forced) return;
	
		// Call the base class function
		super.update(deltaTime, forced);
	}

}