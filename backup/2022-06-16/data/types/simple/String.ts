import { MetaType } from "../../MetaType";
import { Type } from "../../Type";
import { Simple } from "../Simple";

/** Defines a String Node. */
export class String extends Simple<string> {

	// ------------------------------------------------------- PROTECTED FIELDS

	/** The regular expression of the String. */
	protected _validRegEx: RegExp = undefined;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The regular expression values of the String.*/
	get validRegEx(): RegExp | undefined { return this._validRegEx; }
	set validRegEx(newValidRegEx: RegExp | undefined) {
		this._validRegEx = newValidRegEx;
		if (!this.checkValue(this._value)) throw Error('Invalid value "' 
			+ this._value + '" for: ' + this._node.name);
		this._onModified.trigger(this);
	}


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the String class.
	 * @param name The name of the data type.
	 * @param parent The parent data type.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Type, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, new MetaType("string"));

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	// --------------------------------------------------------- PUBLIC METHODS

	/** Deserializes the String instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data: any, mode?: string) {
		if (typeof data == "object") {
			this._validValues = data.validValues;
			this._validRegEx = data.validRegEx;
			this._defaultValue = data.default; // Check the default value
			data = this.value = data.value; 
		}
		if (typeof data !== "string") data = JSON.stringify(data);
		this.value = data;
	}


	/** Checks if the value is valid for this String instance.
	 * @param value The value to check.
	 * @returns A boolean value indicating whether the value is valid or not. */
	checkValue(value:string): boolean {

		// Check the regular expression
		if (this._validRegEx && !this._validRegEx.test(value)) return false;

		// If the value has not been rejected, check the 
		return super.checkValue(value);
	}


	/** Obtains the string representation of the Number.
	 * @returns The string representation of the Number. */
	toString(): string { return this.value || ""; }
}