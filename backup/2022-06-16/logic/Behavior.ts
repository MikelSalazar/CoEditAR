import { Type } from "../data/Type";
import { MetaType } from "../data/MetaType";
import { Function } from "../data/types/Function";

/** Defines a Logic Behavior. */
export class Behavior extends Type {

	
	// --------------------------------------------------------- PRIVATE FIELDS

	/** The start function name. */
	private _startFunction: Function;

	/** The update function name. */
	private _updateFunction: Function;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The start function name. */
	get startFunction(): Function { return this._startFunction; }

	/** The update function name. */
	get updateFunction(): Function { return this._updateFunction; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Behavior instance.
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data.
	 * @param types The metadata of the node. */
	constructor(name: string, parent: Type, data?: any, types: string[] = []) {
	 
		// Call the parent class constructor
		super(name, parent, data, new MetaType("behavior", null, metadata));

		// Create the entity for the space
		this._startFunction = new Function("start", this);
		this._updateFunction = new Function("update", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}