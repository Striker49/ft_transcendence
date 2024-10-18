import Abstract from "./Abstract.js";
import { updateProfile } from "../components/profile.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Profile");
		this.setCustomBehaviour(true);
	}

	executeCustomBehaviour() {
		updateProfile();
	}
}