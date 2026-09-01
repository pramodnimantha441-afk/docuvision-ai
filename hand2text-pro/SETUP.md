# Hand2Text Pro - Installation & Setup Guide

## Project Status
✅ All React component files created
✅ All configuration files set up
✅ Tailwind CSS and styling configured
⏳ NPM dependencies need to be installed

## Quick Start

### Step 1: Navigate to Project Directory
```bash
cd hand2text-pro
```

### Step 2: Install Dependencies

**Option A: Fresh Install (Recommended)**
```bash
# Clean cache first
npm cache clean --force

# Install dependencies
npm install
```

**Option B: If You Get File Lock Errors**
```powershell
# Close all Node processes
taskkill /F /IM node.exe

# Remove node_modules
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue

# Clean cache
npm cache clean --force

# Fresh install
npm install
```

**Option C: Using Yarn (Alternative)**
```bash
# If npm install fails, try yarn
yarn install
```

### Step 3: Start Development Server
```bash
npm run dev
```
The app will automatically open at `http://localhost:3000`

### Step 4: Demo Credentials
Login with:
- **Username**: admin
- **Password**: password

## Project Structure

```
hand2text-pro/
├── src/
│   ├── App.jsx                          # Main app component
│   ├── main.jsx                         # Entry point
│   ├── index.css                        # Global Tailwind styles
│   ├── components/
│   │   ├── Dashboard.jsx                # Dashboard with upload zone
│   │   ├── OrchestrationModal.jsx       # Processing options modal
│   │   └── DualPaneWorkspace.jsx        # Split-pane editor
│   ├── pages/
│   │   └── SecureAccessPortal.jsx       # Login page
│   └── context/
│       └── AppContext.jsx               # Global state management
├── public/                              # Static assets
├── index.html                           # HTML entry point
├── package.json                         # Dependencies
├── vite.config.js                       # Vite config
├── tailwind.config.js                   # Tailwind config
├── postcss.config.js                    # PostCSS config
└── README.md                            # Documentation
```

## Key Features

### 1. Secure Access Portal (Login)
- Dark enterprise theme
- Security badge "100% Offline | Secure"
- Demo credentials support
- Error handling

### 2. Command Center (Dashboard)
- Left sidebar navigation
- File upload (drag & drop)
- Recent documents table
- Download functionality

### 3. Orchestration Modal (Processing)
- Two processing modes:
  - Full Transcription
  - AI-Powered Summarization
- Visual processing pipeline
- Real-time progress tracking

### 4. Dual-Pane Workspace (Editor)
- Left: Image viewer with zoom (50-200%), pan, reset
- Right: Rich text editor (ReactQuill)
- Download .docx button
- Responsive design

## Tech Stack Breakdown

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM rendering |
| react-router-dom | ^6.20.0 | Routing (optional) |
| tailwindcss | ^3.4.1 | Styling |
| lucide-react | ^0.294.0 | Icons |
| react-quill | ^2.0.0 | Rich text editor |
| react-dropzone | ^14.2.3 | File upload |
| vite | ^5.0.8 | Build tool |

## Build & Production

### Build for Production
```bash
npm run build
```
Output: `dist/` folder ready for deployment

### Preview Production Build
```bash
npm run preview
```

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Slate 900 | #0f172a | Primary background |
| Slate 800 | #1e293b | Secondary background |
| Slate 700 | #334155 | Tertiary elements |
| Emerald 600 | #059669 | Primary action button |
| Emerald 500 | #10b981 | Hover/Active states |
| White/Slate 100 | #f1f5f9 | Text |

## Styling Classes

### Custom Tailwind Classes (in `src/index.css`)
- `.badge-secure` - Security badge
- `.btn-primary` - Primary button (emerald)
- `.btn-secondary` - Secondary button (slate)
- `.card-dark` - Dark card component
- `.input-focus` - Input focus styles
- `.transition-smooth` - Smooth transitions

## State Management

Using React Context API for:
- Authentication status
- User information
- Current file data
- Processed text content
- Processing mode & progress
- Recent documents list

## Component Communication Flow

```
App.jsx (main context provider)
├── SecureAccessPortal (login)
├── Dashboard (file upload, navigation)
│   └── OrchestrationModal (processing options)
└── DualPaneWorkspace (editor)
```

## Troubleshooting

### Issue: npm install fails with network errors
**Solution:**
```bash
npm config set registry https://registry.npmjs.org/
npm install --legacy-peer-deps
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Specify different port
npm run dev -- --port 3001
```

### Issue: Tailwind styles not applying
**Solution:**
1. Check if PostCSS is properly configured
2. Restart dev server
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: React components not rendering
**Solution:**
1. Check browser console for errors (F12)
2. Verify all imports are correct
3. Check for JSX syntax errors

## Development Tips

### Hot Module Replacement (HMR)
- Changes are automatically reflected in browser
- No need to refresh manually
- State may reset on file changes

### Browser DevTools
- Open with F12 (Chrome/Firefox) or Cmd+Option+I (Safari)
- React DevTools extension recommended
- Check Console tab for errors

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier (code formatter)
- Thunder Client / REST Client (for API testing)

## Performance Optimization

The project is already optimized for:
- Code splitting via Vite
- CSS purging with Tailwind
- Image optimization ready
- Lazy loading components (can be added)

## Next Steps for Production

1. **Backend Integration**
   - Connect to actual API endpoints
   - Implement real authentication

2. **Database**
   - Set up user database
   - Document management system
   - OCR/ML model endpoints

3. **Security**
   - Implement HTTPS/TLS
   - Add CSRF protection
   - Secure authentication tokens
   - Data encryption

4. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress/Playwright)

5. **Deployment**
   - Choose hosting: Vercel, Netlify, AWS, etc.
   - Set up CI/CD pipeline
   - Configure environment variables

## File Sizes (After Build)

Expected after `npm run build`:
- Main JS bundle: ~150-200KB (gzipped)
- CSS: ~20-30KB (gzipped)
- Total: ~200-250KB (gzipped)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide React Icons](https://lucide.dev)
- [ReactQuill Documentation](https://quilljs.com)

## Support & Debugging

Check the following if something isn't working:
1. Browser console (F12)
2. Terminal output for errors
3. Network tab for API calls (once backend is connected)
4. React DevTools component tree
5. README.md for feature documentation

## License & Security

- Proprietary code - Hand2Text Pro
- 100% offline processing (no external data transmission)
- Enterprise-grade encryption ready
- All data processing local to user device

---

**Ready to develop?** Run `npm install && npm run dev` and start building!
