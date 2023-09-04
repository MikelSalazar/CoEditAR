import { Type } from "../Type"
import { MetaType } from "../MetaType"
import { String } from "../types/simple/String"
import { NodeSet } from "../NodeSet"
import { Assembly } from "./Assembly"
import { Behavior } from "../../logic/Behavior"
import { Entity } from "../../logic/Entity"

/** Describes a asset (a collection of resources). */
export class Asset extends Type {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The (unique) name of the asset. */
	private _name: String;

	/** The id of the class this instance inherits from. */
	private _extends: String;

	/** The behaviors contained in the asset. */
	private _assemblies: NodeSet<Assembly>;

	/** The behaviors contained in the asset. */
	private _behaviors: NodeSet<Behavior>;

	/** The entities contained in the asset. */
	private _entities: NodeSet<Entity>;


	// ------------------------------------------------------ PUBLIC PROPERTIES

	/** The (unique) name of the asset. */
	get name(): String { return this._name; }

	/** The id of the class this instance inherits from. */
	get extends(): String { return this._extends; }

	/** The behaviors contained in the asset. */
	get assemblies(): NodeSet<Assembly> { return this._assemblies; }

	/** The behaviors contained in the asset. */
	get behaviors(): NodeSet<Behavior> { return this._behaviors; }

	/** The entities contained in the asset. */
	get entities(): NodeSet<Entity> { return this._entities; }


	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new Asset instance.
	 * @param name The name of the data type.
	 * @param name The parent data type.
	 * @param data The initialization data. */
	constructor(name: string, parent?: Type, data: any = {}) {

		// Call the base class constructor
		super(name, parent, data, new MetaType("asset"));

		// Create the child nodes
		this._name = new String("name", this);
		this._extends = new String("extends", this);
		this._assemblies = new NodeSet<Assembly>("assemblies", this, Assembly);
		this._behaviors = new NodeSet<Behavior>("behaviors", this, Behavior);
		this._entities = new NodeSet<Entity>("entities", this, Entity);

		// Deserialize the initialization data
		if (data) this.deserialize(data);
	}
}
