# Hand2Text Pro - Enterprise AI Handwritten Notes Digitizer

A professional, secure frontend for Hand2Text Pro - an enterprise-grade web application for digitizing handwritten notes with 100% offline processing.

## Features

### 1. Secure Access Portal (Login Page)
- Clean, minimal dark-themed login screen
- Enterprise-grade encryption badge
- Demo credentials for testing
- 100% offline security assurance

### 2. Command Center (Dashboard)
- Intuitive left sidebar navigation
- Prominent "100% Offline | Secure" badge
- Large drag-and-drop upload zone
- Recent documents table with status tracking
- Download functionality for processed documents

### 3. The Orchestration Modal (Processing Options)
- Two processing modes: Full Transcription & AI-Powered Summarization
- Visual processing pipeline display
- Real-time progress tracking through 4 steps:
  - Uploading
  - Preprocessing (OpenCV)
  - Extracting Text (CRNN)
  - Summarizing (NLP)

### 4. Dual-Pane Workspace (Result & Editor View)
- **Left Pane**: Source image viewer with zoom (50-200%), pan, and reset controls
- **Right Pane**: Rich text editor (ReactQuill) with formatting tools
- Prominent "Download .docx" button
- Responsive design for all screen sizes

## Tech Stack

- **React 18.2** - UI Framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 3.4** - Styling
- **Lucide React** - Icon library
- **ReactQuill 2.0** - Rich text editor
- **react-dropzone 14.2** - File upload handling

## Color Scheme

- **Primary Background**: Slate 900 (#0f172a)
- **Secondary Background**: Slate 800 (#1e293b)
- **Text**: White/Slate 100
- **Accent (Primary Actions)**: Emerald 600 (#059669)
- **Accent (Hover)**: Emerald 500 (#10b981)

## Project Structure

```
hand2text-pro/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx           # Main dashboard with upload zone
│   │   ├── OrchestrationModal.jsx  # Processing options modal
│   │   └── DualPaneWorkspace.jsx   # Split-pane editor view
│   ├── pages/
│   │   └── SecureAccessPortal.jsx  # Login page
│   ├── context/
│   │   └── AppContext.jsx          # Global app state management
│   ├── App.jsx                     # Main app component with routing
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global Tailwind styles
├── public/                         # Static assets
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
└── postcss.config.js               # PostCSS configuration
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm

### Steps

1. **Navigate to project directory**
   ```bash
   cd hand2text-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Demo Credentials

- **Username**: admin
- **Password**: password

## Key Components Breakdown

### SecureAccessPortal
- Centered login form with dark theme
- Security badge highlighting offline processing
- Input validation and error messages
- Demo credentials hint

### Dashboard
- Sidebar navigation with logout functionality
- Drag-and-drop file upload with visual feedback
- Recent documents table showing file metadata
- Quick action buttons for document management

### OrchestrationModal
- Radio button selection between transcription/summarization modes
- Processing pipeline visualization
- Start processing button with automatic navigation

### DualPaneWorkspace
- Image viewer with zoom in/out and pan controls
- Rich text editor with basic formatting (bold, italic, bullet lists)
- Download .docx functionality
- Responsive split-pane layout

## Styling Details

### CSS Classes
- `.badge-secure` - Emerald security badge
- `.btn-primary` - Main CTA button (emerald)
- `.btn-secondary` - Secondary button (slate)
- `.card-dark` - Card component styling
- `.input-focus` - Input focus styles
- `.transition-smooth` - Smooth transitions

### Responsive Design
- Mobile-optimized layout (Tailwind responsive classes)
- Full-screen components with proper spacing
- Touch-friendly buttons and controls

## State Management

Using React Context API for global state:
- Authentication status
- Current user information
- Uploaded files
- Processed text content
- Processing mode and progress
- Recent documents

## Future Enhancements

- Integration with actual backend API
- Multi-file batch processing
- Advanced OCR options
- Document templates
- Cloud backup option
- User preferences/settings panel
- Export to multiple formats (PDF, Excel, etc.)

## Security Notes

All processing is simulated for demo purposes. In production:
- Implement actual backend authentication
- Use HTTPS for secure transmission
- Implement actual image processing pipelines
- Add encryption for data at rest
- Implement proper access controls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - Hand2Text Pro

## Support

For support and inquiries, contact the development team.
