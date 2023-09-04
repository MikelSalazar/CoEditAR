import { Type } from "../../Type";
import { MetaType } from "../../MetaType";
import { Complex } from "../Complex";
import { Distance } from "../measures/Distance";

/** Defines a three-dimensional vector. */
export class Vector extends Complex {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The vector component in the X axis. */
	private _x: Distance;

	/** The vector component in the Y axis. */
	private _y: Distance;

	/** The vector component in the Z axis. */
	private _z: Distance;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The vector component in the X axis. */
	get x(): Distance { return this._x; }

	/** The vector component in the Y axis. */
	get y(): Distance { return this._y; }

	/** The vector component in the Z axis. */
	get z(): Distance { return this._z; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Vector3 class.
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data. */
	constructor(name?: string, parent?: Type, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, new MetaType("vector"));

		// Create the children nodes
		this._x = new Distance("x", this);
		this._y = new Distance("y", this);
		this._z = new Distance("z", this);

		// Define the components of the Complex type
		this._components = [this._x, this._y, this._z];

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Gets the values of the Vector.
 	* @returns An object with the values of the Vector. */
	getValues() : object
	{ return { x: this._x.value, y: this._y.value, z: this._z.value }; }

	/** Sets the values of the Vector.
	 * @param x The vector component in the X axis.
	 * @param y The vector component in the Y axis.
	 * @param z The vector component in the Z axis. */
	setValues(x?: number, y?: number, z?: number) {
		this._x.value = x; this._y.value = y; this._z.value = z; 
	}

	/** Obtains the string representation of the Vector. 
	 * @returns The string representation of the Vector. */
	toString(): string { return this._components.join(", "); }
}