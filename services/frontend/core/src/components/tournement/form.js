import Abstract from "./Abstract.js";

export default class extends Abstract {
    constructor() {
        super();
        this.setTitle("Tournament Form");
    }

    async getHtml() {
        return `
            <div id="tournament-form" class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px; height: auto;">
                <h2 class="text-center text-success fw-bold">Tournament Registration</h2>
                <form id="player-form" class="mt-4">
                    <div class="form-group mb-3">
                        <label for="player1" class="form-label text-light">Player 1 Name</label>
                        <input type="text" class="form-control" id="player1" placeholder="Enter Player 1 Name">
                    </div>
                    <div class="form-group mb-3">
                        <label for="player2" class="form-label text-light">Player 2 Name</label>
                        <input type="text" class="form-control" id="player2" placeholder="Enter Player 2 Name">
                    </div>
                    <div class="form-group mb-3">
                        <label for="player3" class="form-label text-light">Player 3 Name</label>
                        <input type="text" class="form-control" id="player3" placeholder="Enter Player 3 Name">
                    </div>
                    <div class="form-group mb-3">
                        <label for="player4" class="form-label text-light">Player 4 Name</label>
                        <input type="text" class="form-control" id="player4" placeholder="Enter Player 4 Name">
                    </div>
                    <button type="submit" class="btn btn-success w-100 mt-3">Submit</button>
                </form>
            </div>
        `;
    }
}
