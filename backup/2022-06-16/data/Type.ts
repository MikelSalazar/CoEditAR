import { Node } from "./Node";
import { MetaType } from "./MetaType";

/** Defines a basic data type. */
export class Type {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The node associated to the type. */
	protected _node: Node;

	/** The metadata of the data type. */
	protected _metadata: MetaType;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The node associated to the type. */
	get node(): Node { return this._node; }

	/** The metadata of the data type. */
	get metadata(): MetaType { return this._metadata; }


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param name The name of the type.
	 * @param parent The parent of the data type in the node hierarchy.
	 * @param data The initialization data. 
	 * @param metadata The metadata of the node. */
	constructor(name?: string, parent?: Type, data?: any, metadata?: MetaType) {

		// Create a node
		this._node = new Node(this, name, parent.node, data)
		
		// Store the metadata
		this._metadata = metadata;
	}

	// --------------------------------------------------------- PUBLIC METHODS

	/** Checks if the datatype is of a particular type.
	 * @param typeName The name is of the type.
 	 * @return Whether the datatype is of a particular Type. */
	is(typeName: string) : boolean { return this._metadata.is(typeName); }

	/** Serializes the instance to JSON data.
	 * @param mode The serialization mode.
	 * @return The serialized JSON data. */
	serialize(mode?: string): any { return this._node.serialize(); }

	/** Deserializes the instance from JSON data.
	 * @param data The JSON data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) { 
		return this._node.deserialize(data);
	}
}