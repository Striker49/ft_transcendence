# FT_Transcendence  

## Table of Contents  
1. [About](#about)  
2. [Modules Overview](#modules-overview)  
3. [Setup](#setup)  
4. [Usage](#usage)  
5. [Contributors](#contributors)  
6. [License](#license)  

## About  
A feature-rich school(42) project implementing advanced backend, frontend, and gaming functionalities with support for multiple languages, 3D graphics, AI opponents, and more.

### Key Features  
- Real-time local multiplayer **Pong** game.  
- A responsive and user-friendly single-page application (SPA).  
- Compatabile with the latest stable version of **Google Chrome**.

### Minimal Technical Requirements  
ft_trancendence adheres to the following technical guidelines:  

- **Gameplay**:  
  - Players must be able to play **Pong** locally with another player using the same keyboard.  
  - A tournament system allows multiple players to take turns, with clear matchmaking and player order.  
  - All players, including AI, must have identical rules (e.g., equal paddle speed).  

- **Frontend**:  
  - The game must retain the essence of the original **Pong** (1972).  
  - The application must be a single-page application (SPA), supporting the browser's Back and Forward buttons.  

- **Security**:  
  - Passwords must be hashed if stored in the database.  
  - Protect against **SQL injections** and **XSS attacks**.  
  - Use HTTPS for all website features, including **wss** for WebSockets.  
  - Validate all forms and user inputs.  

- **Error Handling**:  
  - The application must handle all errors gracefully with no unhandled exceptions.  

- **Dockerized Deployment**:  
  - Everything must run autonomously with a single command using Docker:  
    ```bash
    docker-compose up --build
    ```

## Modules Overview  
Below are the key modules we've chosen to complete the project:

- **Backend Framework**: Django/Django Rest Framewok(DRF)  
- **Database Integration**: Postgres
- **Frontend Framework/Toolkit**: Bootstrap
- **User Management & Authentication**: RESTFULL API / oAUTH
- **Advanced 3D Techniques**: ThreeJS  
- **Multilingual Support**: JavaScript  
- **Game Customization Options**: JavaScript  
- **AI Opponent**: JavaScript  
- **Cross-Browser Compatibility** 
- **User Dashboards & Statistics** 

## Setup  
To get started with ft_trancendence locally:  

### Prerequisites  
- [Docker](https://www.docker.com/)
- [Make](https://www.gnu.org/software/make/manual/make.html)
### Installation  
```bash
# Clone the repository
git clone git@github.com:Striker49/ft_transcendence.git
cd ft_trancendence

# Build and start the application
make deploy

# Or using docker without the makefile
docker-compose up --build
```

## Usage  
- Access the application at [https://localhost](https://localhost).  
- Navigate through various features such as profile, PONG game and tournament, and customizable game settings.  

## Contributors  
- **Oli**: Frontend toolkit, user management, dashboards.  
- **Seb**: Advanced 3D techniques, multilingual support, game customization.  
- **Juan**: Project Structure
- **Ziggy**: Backend, database, authentication.  