import * as THREE from 'three'

export default class extends THREE.Mesh {
	constructor() {
		super()
		this.geometry = new THREE.BoxGeometry()
		this.material = new THREE.MeshStandardMaterial({ color: new THREE.Color('orange').convertSRGBToLinear() })
		this.cubeSize = 0
		this.cubeActive = false
	}
}