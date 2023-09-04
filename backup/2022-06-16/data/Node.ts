import { Event } from "../logic/Event"
import { Type } from "./Type";

/** Defines a node of a hierarchical structure.
 * Useful for update optimization and serialization purposes. */
export class Node {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The associated data type. */
	private _datatype: Type;

	/** The name of the node. */
	private _name: string | undefined;

	/** The parent node. */
	private _parent: Node | undefined;

	/** The child nodes. */
	private _children: Node[];

	/** Indicates whether the node has been updated or not. */
	private _updated: boolean;

	/** An event triggered before the node is updated. */
	private _onPreUpdate: Event;

	/** An event triggered after the node is updated. */
	private _onPostUpdate: Event;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The associated data type. */
	get datatype(): Type { return this._datatype; }

	/** The name of the node. */
	get name(): string | undefined { return this._name; }

	/** The parent Node. */
	get parent(): Node | undefined { return this._parent; }

	/** The child Nodes. */
	get children(): Node[] { return this._children; }

	/** Indicates if the Node has been updated or not. */
	get updated(): boolean { return this._updated; }
	set updated(value: boolean) {

		// Propagate "false" values upwards in the node hierarchy
		if (value == false && this._parent) this._parent.updated = false;
		
		// Apply the new value
		this._updated = value;
	}

	/** An event triggered before the Node is updated. */
	get onPreUpdate(): Event { return this._onPreUpdate; }

	/** An event triggered after the Node is updated. */
	get onPostUpdate(): Event { return this._onPostUpdate; }


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Node class.
	 * @param datatype The associated datatype. 
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data. */
	constructor(datatype: Type, name?: string, parent?: Node, data?: any) {

		// Initialize the data of the node
		this._datatype = datatype;
		this._name = name;
		this._parent = parent;
		this._children = [];

		// Create a link between the node and its parent
		if (parent) parent._children.push(this);

		// Send an update request upwards in the Node hierarchy
		this.updated = false;

		// Create the events
		this._onPreUpdate = new Event("preUpdate", this);
		this._onPostUpdate = new Event("postUpdate", this);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Updates the Node. 
	 * @param deltaTime The update time.
	 * @param forced Indicates whether the update is forced or not. 
	 * @param data Additional update data. */
	 update(deltaTime: number = 0, forced: boolean = false, data?: any) {

		// If the update is not forced, skip it when the node is already updated
		if (this._updated && !forced) return;

		// Trigger the pre-update event
		this._onPreUpdate.trigger(this, data);

		// Mark this node as updated
		this._updated = true;

		// Update the children
		for (let child of this._children)
			child.update(deltaTime, forced, data);

		// Trigger the post-update event
		this._onPostUpdate.trigger(this, data);
	}


	/** Serializes the Node instance.
	 * @param mode The serialization mode: full (default), simple,).
	 * @return The serialized data. */
	serialize(mode?: string): any {

		// Create an object to serialize the Node
		let data: any = {};

		// Save the name of the node
		if (this.name) data.name = this.name;

		// Serialize the child nodes
		for (let child of this._children) {
			let nodeChildData = child.serialize(mode);
			if (mode == "simple" && nodeChildData == undefined) continue;
			data[child.name] = nodeChildData;
		}

		// Return the object with the serialized data
		return data;
	}


	/** Deserializes the Node instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any = {}, mode?: string) {

		// If the data is a string, check if it is JSON or CSV data
		if (typeof data == "string") JSON.parse(data);

		// If the data is an array, try to parse it value by value
		if (Array.isArray(data)) {
			for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
				if (dataIndex >= this.children.length) return;
				this.children[dataIndex].deserialize(data[dataIndex], mode);
			}
		}

		// If the data is an object, analyze it key by key
		else for (let dataKey in data) {
			if (data[dataKey] == undefined) continue;
			for (let child of this._children) {
				if (child._name == dataKey) {
					child.deserialize(data[dataKey], mode); break;
				}
			}
		}
	}

	
	/** Searches for a specific ancestor Node (higher in the Node hierarchy).
	 * @param type The type of node to look for.
	 * @param name The name of node to look for.
	 * @returns The node that satisfies the search conditions (if it exists). */
	ancestor(type?: string, name?: string): Node | undefined{
		let searchNode: Node | undefined = this._parent;
		while(searchNode) {
			if (type && searchNode._datatype.is(type)) break;
			searchNode = searchNode.parent;
		}
		return searchNode;
	}
	

	/** Converts the Node into its String representation.
	 * @returns The string representation of the Node. */
	toString(): string { return JSON.stringify(this.serialize()); }
}
