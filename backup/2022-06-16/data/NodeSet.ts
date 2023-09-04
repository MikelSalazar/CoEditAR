import { Node } from "./Node";

/** Define a set of data Nodes. */
export class NodeSet<type> extends Node implements Iterable<type> {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The node subtype of the NodeSet. */
	private _nodeSubtypes: any;

	// ---------------------------------------------------------- PUBLIC FIELDS

	/** Identifies the object as an instance of the NodeSet class. */
	public isNodeSet = true;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The children Nodes (converted to the type). */
	get typedChildren(): type[] {
		return (this._children as unknown) as type[];
	}

	/** The number of child in the NodeSet. */
	get count(): number { return this._children.length; }


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the NodeSet class.
	 * @param name The name of the NodeSet.
	 * @param name The parent data type.
	 * @param subtypes The node subtypes of the NodeSet.
	 * @param data The initialization data. */
	constructor(name: string, parent: Node, subtypes: any, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, ["nodeset"]);

		// Set the node subtype
		this._nodeSubtypes = subtypes;
	}

	
	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Node instance.
	 * @param mode The serialization mode.
	 * @return The serialized data. */
	serialize(mode?: string): any {

		// Create an object to serialize the Node
		let serializedData: any = [];

		// Serialize the child nodes
		for (let child of this._children) {
			serializedData.push(child.serialize(mode));
			if (this._name != this._type) 
				serializedData.name = this.name;
		}

		// Return the object with the serialized data
		if (mode == "simple" && serializedData.length == 0) 
			serializedData = undefined;
		return serializedData;
	}


	/** Deserializes the NodeSet instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		
		// Get the subtype data
		let subtype = this._nodeSubtypes;
		
		if (Array.isArray(data)) {
			for (const datum of data){
				let subtype = this._nodeSubtypes;
				if (typeof subtype == "object")
					subtype = (datum.type)? subtype[datum.type] : subtype[""];
				if (!subtype) throw new Error("Unknown type: " + datum.type);
				new subtype(datum.name, this, datum);
			}
		}
		else for (const key in data) {
			const datum = data[key];
			if (typeof subtype == "object")
				subtype = (datum.type)? subtype[datum.type] : subtype[""];
			if (!subtype) throw new Error("Unknown type: " + datum.type);
			let node: Node = new subtype(key, this, data[key]);
			(this as any)[key] = node;
		}
	}


	/** Gets a specific Node in the collection. 
	 * @param name The name of the node to get. */
	getByName(name: string): type {
		for(let child of this._children)
			if(child.name == name) return child as unknown as type;
		return undefined;
	}


	/** Gets a node by index. 
	 * @param index The index of the node to get.
	 * @returns The node with the given index. */
	getByIndex(index: number): type {
		return this._children[index] as unknown as type;
	}


	/** Provides an iterator to navigate though the NodeSet. */
	[Symbol.iterator]() {
		let pointer = 0; let items = this._children;
		return {
			next(): IteratorResult<type> {
				if (pointer < items.length) return { done: false,
					value: items[pointer++] as unknown as type };
				else return { done: true, value: null };
			}
		}
	}
}