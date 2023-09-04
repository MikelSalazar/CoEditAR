import { Type } from "../Type"
import { MetaType } from "../MetaType"
import { String } from "../types/simple/String"
import { Distance } from "../types/measures/distance"

/** Defines a shape of a smart assembly. */
export class Shape extends Type {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The (unique) name of the shape. */
	private _name: String;

	/** The id of the class this instance inherits from. */
	private _extends: String;

	/** The type of the shape ('box', 'ellipsoid', 'cylinder' or 'cone'). */
	private _type: String;

	/** The width of the shape. */
	private _width: Distance;

	/** The height of the shape. */
	private _height: Distance;

	/** The depth of the shape. */
	private _depth: Distance;

	/** The radius of the shape. */
	private _radius: Distance;

	/** The secondary radius of the shape (for cones). */
	private _radius2: Distance;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the shape. */
	get name(): String { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends(): String { return this._extends; }

	/** The type of the shape ('box', 'ellipsoid', 'cylinder' or 'cone'). */
	get type(): String { return this._type; }

	/** The width of the shape. */
	get width(): Distance { return this._width; }

	/** The height of the shape. */
	get height(): Distance { return this._height; }

	/** The depth of the shape. */
	get depth(): Distance { return this._depth; }

	/** The radius of the shape. */
	get radius(): Distance { return this._radius; }

	/** The secondary radius of the shape (for cones). */
	get radius2(): Distance { return this._radius2; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Shape instance.
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data. */
	constructor(name: string, parent?: Type, data: any = {}) {

		// Call the base class constructor
		super(name, parent, data, new MetaType("shape"));

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._type = new String("type", this);
		this._width = new Distance("width", this);
		this._height = new Distance("height", this);
		this._depth = new Distance("depth", this);
		this._radius = new Distance("radius", this);
		this._radius2 = new Distance("radius2", this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}
