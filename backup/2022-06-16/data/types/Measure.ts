import { MetaType } from "../MetaType";
import { Number } from "./simple/Number";


/** Defines a numeric Measure Node. */
export class Measure extends Number {
	
	// ------------------------------------------------------- PROTECTED FIELDS

	/** The units of the Measure. */
	protected _units: MeasurementUnit[];

	/** The units of the Measure. */
	protected _unitIndex: number;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The current unit of the Measure. */
	get unit(): MeasurementUnit { return this._units[this._unitIndex]; }

	/** The units of the Measure. */
	get units(): MeasurementUnit[] { return this._units; }

	/** The value of the Measure in the selected unit.*/
	get unitIndex(): number { return this._unitIndex; }
	set unitIndex(u: number) {
		this._unitIndex = u; this._onModified.trigger(this);
	}


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Type class.
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data. 
	 * @param metadata The metadata of the node. 
	 * @param units The measurement units of the Node. */
	constructor(name?: string, parent?: Type, data?: any, metadata?: MetaType,
		units?: MeasurementUnit[]) {

		// Call the parent class constructor
		super(name, parent, data, new MetaType("measure", null, metadata));

		// Store the units of the Measure
		this._units = units || [ new MeasurementUnit("", [""], 1)];
		this._unitIndex = 0;
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Serializes the String instance.
	 * @return The serialized data. */
	serialize(): any { return this.value; }

	/** Deserializes the Simple data type.
	 * @param data The value to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) { 
		// TODO check unit
		this.value = data;
	}

	/** Obtains the value of the Simple data type
	 * @return The value of the Type. */
	valueOf(): any { return this.value; }

	/** Obtains the String representation of the measure.
	 * @return The String representation of the measure. */
	toString(): string  { return this.value + " " + this.unit.abbrevs[0]; }
}


/** Defines a Measurement Unit. */
export class MeasurementUnit { 

	// --------------------------------------------------------- PRIVATE FIELDS
	
	/** The name of the Measurement Unit. */
	private _id: string;

	/** The list of abbreviations of the Measurement Unit. */
	private _abbrevs: string[];

	/** The relative conversion factor of the Measurement Unit. */
	private _factor: number;

	/** The default value of the Measurement Unit. */
	private _default: number;

	/** The minimum possible value of the Measurement Unit. */
	private _min: number;

	/** The maximum possible value of the Measurement Unit. */
	private _max: number;


	// ------------------------------------------------------- PUBLIC ACCESSORS
	
	/** The name of the Measurement Unit. */
	get id(): string { return this._id; }

	/** The list of abbreviations of the Measurement Unit. */
	get abbrevs(): string[] { return this._abbrevs; }

	/** The relative conversion factor of the Measurement Unit. */
	get factor(): number { return this._factor; }

	/** The default value of the Measurement Unit. */
	get default(): number { return this._default; }

	/** The minimum possible value of the Measurement Unit. */
	get min(): number { return this._min; }

	/** The maximum possible value of the Measurement Unit. */
	get max(): number { return this._max; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR
	
	/** Initializes a new instance of the MeasurementUnit class.
	 * @param id The id of the Measurement Unit.
	 * @param abbrevs The abbreviations of the Measurement Unit.
	 * @param factor The relative conversion factor of the Measurement Unit. 
	 * @param default The default value of the Measurement Unit. 
	 * @param min The minimum possible value of the Measurement Unit. 
	 * @param max The maximum possible value of the Measurement Unit. */
	constructor (id: string, abbrevs: string[], factor: number = 1, 
		defaultValue?: number, min?: number , max?: number) {
		this._id = id; this._abbrevs = abbrevs; this._factor = factor;
		this._default = defaultValue; this._min = min; this._max = max;
	}
}
