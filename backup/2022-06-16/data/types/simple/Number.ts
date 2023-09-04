import { MetaType } from "../../MetaType";
import { Type } from "../../Type";
import { Simple } from "../Simple";

/** Defines a Number Node. */
export class Number extends Simple<number> {
	
	// --------------------------------------------------------- PRIVATE FIELDS

	/** The minimum possible value of Number. */
	private _min: number = undefined;

	/** The maximum possible value of the Number. */
	private _max: number = undefined;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The minimum possible value of Number. */
	get min(): number { return this._min; }
	set min(newMin: number) {
		if (this._max != undefined && newMin > this._max) this._max = newMin;
		if (this._value!=undefined && this._value < newMin) this.value = newMin;
		this._min = newMin; this._node.updated = false;
		this._onModified.trigger(this);
	}

	/** The maximum possible value of the Number. */
	get max(): number { return this._max; }
	set max(newMax: number) {
		if (this._min != undefined && newMax < this._min) this._min = newMax;
		if (this._value!=undefined && this._value > newMax) this.value = newMax;
		this._max = newMax; this._node.updated = false;
		this._onModified.trigger(this);
	}


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Number class.
	 * @param name The name of the data type.
	 * @param parent The parent data type.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Type, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, new MetaType("number"));

		// Set the values of the properties
		this._value = undefined; this._defaultValue = 0; 

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the Number instance.
	 * @return The serialized data. */
	serialize(): any { return this._value; }

	/** Deserializes the Number instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if (typeof data == "object") {
			this.min = data.min; this.max = data.max;
			this.defaultValue = data.defaultValue; this.value = data.value;
		}
		else if (typeof data !== "number") this.value = parseFloat(data);
		else this.value = data;
	}
	
	/** Checks if the value is valid for this Number instance.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value:number): boolean {

		// Check the range 
		if (this._min != undefined && value < this._min) return false;
		if (this._max != undefined && value > this._max) return false;

		// If the value has not been rejected, check the 
		return super.checkValue(value);
	}

	/** Obtains the string representation of the Number.
	 * @returns The string representation of the Number. */
	toString(): string { return this.value.toFixed() || ""; }

}