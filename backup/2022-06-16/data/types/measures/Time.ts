import { Type } from '../../Type'
import { MetaType } from '../../MetaType'
import { Measure, MeasurementUnit } from "../Measure";

/** Defines a time measurement. */
export class Time extends Measure {

	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new instance of the Time class.
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Node, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, new MetaType("time"), TimeMeasurementUnits);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}


// Define the Time Measurement Units
let TimeMeasurementUnits: MeasurementUnit[] = [
	new MeasurementUnit("seconds",["s", "sec"], 1),
	new MeasurementUnit("minutes",["m", "mins"], 1/60),
	new MeasurementUnit("hours",["h"], 1/3600),
	new MeasurementUnit("milliseconds",["ms", "millisecs"], 1000),
];