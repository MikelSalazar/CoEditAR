import { Type } from "./Type";

/** Contains the metadata of a data type. 
 * Necessary for reflective programming and (de)serialization. */
export class MetaType {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The name of the type. */
	private _name: string;

	/** The aliases of the type. */
	private _aliases: {[key: string]: string} | undefined;

	/** The parent type in the object hierarchy. */
	private _parent: MetaType | undefined;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The name of the type. */
	get name(): string { return this._name; }

	/** The aliases of the type. */
	get aliases(): {[key: string]: string} | undefined { return this._aliases; }

	/** The parent type in the object hierarchy. */
	get parent(): MetaType | undefined { return this._parent; }


	// ------------------------------------------------------------ CONSTRUCTOR

	/** Initializes a new instance of the NodeType class.
	 * @param name The name of the type. 
	 * @param aliases The aliases of the type. 
	 * @param parent The parent type in the object hierarchy.  */
	constructor(name: string, aliases?: {[key: string]: string}, 
		parent?: MetaType) {
		this._name = name; this._aliases = aliases; this._parent = parent;
	}


	// ------------------------------------------------------- PUBLIC FUNCTIONS

	/** Recursively validates if the name corresponds with the meta-type.
	 * @param name The type name to check.
	 * @returns A boolean value indicating whether the type name is valid or not. */
	is(name) : boolean {
		if (this.name == name) return true;
		if (this._parent) this._parent.is(name);
		return false;
	}


	static is(type: Type, name:string): boolean { 
		type.metadata
		return false;
	}
}
