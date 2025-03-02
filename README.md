# Gesture Vision

A React-based 3D object manipulation application that uses webcam hand tracking for interactive gesture-controlled 3D scene rendering.

## Features
- Real-time hand tracking with TensorFlow.js and MediaPipe
- Interactive 3D rendering with p5.js
- Gesture-based control for both cube and particle systems
- Camera permission handling with user feedback

## Development

### Local Setup
1. Clone the repository:
```bash
git clone https://github.com/souvick88/gesture-vision.git
cd gesture-vision
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`. This starts both the Express backend and Vite frontend server.

### Making Changes
You can make changes either:
1. Locally:
   - Make changes in your local environment
   - Commit and push to GitHub
   - Changes will be reflected in the Replit deployment

2. Through Replit:
   - Make changes directly in Replit
   - Changes will be committed to GitHub
   - Pull the changes to your local repository

### System Requirements
- Node.js 18+ (Node.js 20 recommended)
- Modern web browser with WebGL support
- Webcam access

### Deployment
This project is deployed on Replit. The deployment is automatically synchronized with the GitHub repository.

To deploy changes:
1. Push your changes to the GitHub repository
2. Access the Replit project
3. The changes will be automatically pulled and deployed

### Commit Analysis
For questions about specific commits:
1. Reference the commit hash or message
2. Ask about:
   - Implementation details
   - Reasoning behind changes
   - Impact on functionality
   - Debugging assistance

## Tech Stack
- React
- TensorFlow.js with MediaPipe Hands
- p5.js for 3D rendering
- Tailwind CSS & shadcn/ui for styling