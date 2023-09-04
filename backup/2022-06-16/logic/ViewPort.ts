import * as THREE from "three";
import { Presence } from "../user/interaction/Presence";

/** Defines a Viewport. */
export class ViewPort {

	// --------------------------------------------------------- PRIVATE FIELDS

	/** The main element of the View. */
	private _element: HTMLElement;

	/** The canvas element of the View. */
	private _canvas: HTMLCanvasElement;

	/** The renderer of the View. */
	private _renderer: THREE.WebGLRenderer;


	// ------------------------------------------------------- PUBLIC ACCESSORS

	/** The main element of the view. */
	get element(): HTMLElement { return this._element; }

	/** The canvas element of the view. */
	get canvas(): HTMLCanvasElement { return this._canvas; }

	/** The renderer of the view. */
	get renderer(): THREE.WebGLRenderer { return this._renderer; }

		// ----------------------------------------------------- PUBLIC CONSTRUCTOR

	/** Initializes a new View instance.
	 * @param canvas The canvas of the viewport. */
	constructor(canvas, updateFunction) {

		this._canvas = canvas; 

		// Create the renderer
		this._renderer = new THREE.WebGLRenderer( { canvas:this._canvas} );
		this._renderer.xr.enabled = true;
		this._renderer.setAnimationLoop(updateFunction);
	}

	resize(width, height) {
		this._renderer.setSize(width, height);
	}

	render(presence: Presence) {

		// Clear the renderer
		this._renderer.setClearColor(0xff0000);
		this._renderer.clear();

		
		this._renderer.render(presence.space.entity.representation,
			presence.entity.representation as THREE.PerspectiveCamera);

	}
} 