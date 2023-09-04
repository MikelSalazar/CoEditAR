import * as THREE from "three"
import { Type } from "../../data/Type";
import { MetaType } from "../../data/MetaType";
import { Entity } from "../Entity";
import { Number } from "../../data/types/simple/Number";

/** Defines a user Presence entity. */
export class PresenceEntity extends Entity {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The field of view of the Camera. */
	private _fieldOfView : Number;

	/** The aspect ratio of the Camera. */
	private _aspectRatio : Number;

	/** The near plane of the Camera frustum. */
	private _nearPlane: Number;

	/** The far plane of the Camera frustum. */
	private _farPlane : Number;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The field of view of the Camera. */
	get fieldOfView(): Number { return this._fieldOfView; }

	/** The aspect ratio of the Camera. */
	get aspectRatio(): Number { return this._aspectRatio; }

	/** The near plane of the Camera frustum. */
	get nearPlane(): Number { return this._nearPlane; }

	/** The far plane of the Camera frustum. */
	get farPlane(): Number { return this._farPlane; }

	
	// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new CameraEntity instance.
	 * @param name The name of the entity. 
	 * @param name The parent of the entity. 
	 * @param data The initialization data. */
	 constructor (name: string, parent: Type = null, data: any = {}){

		// Call the base class constructor
		super(name, parent, data, ["camera"]),

		// Create the 
		this._fieldOfView = new Number("fov", this, {defaultValue: 45});
		this._aspectRatio = new Number("aspect", this, {defaultValue: 1});
		this._nearPlane = new Number("near", this, {defaultValue: 0.001});
		this._farPlane = new Number("far", this, {defaultValue: 1000});

		// Deserialize the initialization data
		if (data) this.deserialize(data);

		// 
		this._representation = new THREE.PerspectiveCamera(
			this._fieldOfView.value, this._aspectRatio.value,
			this._nearPlane.value, this._farPlane.value);

	}


	/** Updates the Entity.
	 * @param deltaTime The update time. 
 	 * @param forced Indicates whether the update is forced or not. */
	update(deltaTime: number = 0, forced: boolean = false) {

		// If the update is not forced, skip it when the node is already updated
		if (this.node.updated && !forced) return;

		// Use a typed variable
		let camera = this._representation as THREE.PerspectiveCamera;

		// Update the properties of the node
		if(!this._position.node.updated) {
			camera.position.set(this._position.x.value, 
				this._position.y.value, this._position.z.value);
		}
		if(!this._rotation.node.updated) {
			camera.rotation.set(this._rotation.x.value, 
				this._rotation.y.value, this._rotation.z.value);
		}
		if(!this._fieldOfView.node.updated) {
			camera.fov = this._fieldOfView.value;
			camera.updateProjectionMatrix();
		}
		if(!this._aspectRatio.node.updated) {
			camera.aspect = this._aspectRatio.value;
			camera.updateProjectionMatrix();
		}
		if(!this._nearPlane.node.updated) {
			camera.near = this._nearPlane.value;
			camera.updateProjectionMatrix();
		}
		if(!this._farPlane.node.updated) {
			camera.far = this._farPlane.value;
			camera.updateProjectionMatrix();
		}

		// Call the base class function
		super.update(deltaTime, forced);
	}
}