import { Type } from "../../data/Type";
import { MetaType } from "../../data/MetaType";
import { SpaceEntity } from "../../logic/entities/SpaceEntity";
import { Entity } from "../../logic/Entity";

/** Defines a User Interaction Space. */
export class Space extends Type {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The main entity of the Space. */
	private _entity: SpaceEntity;

	/** The type of the Space (). */
	private _isShared: string;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main entity of the Space. */
	get entity(): SpaceEntity { return this._entity; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param name The name of the data type.
	 * @param parent The parent data type.
	 * @param data The initialization data. */
	 constructor(name?: string, parent?: Type, data?: any) {

		// Call the parent class constructor
		super(name, parent, data, new MetaType("space"));

		// Create the entity for the space
		this._entity = new SpaceEntity(name, this);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}


	/** Deserializes the Presence instance.
	 * @param data The data to deserialize.
	 * @param mode The deserialization mode. */
	deserialize(data?: any, mode?: string): void {
		this._entity.deserialize(data);
	}
}