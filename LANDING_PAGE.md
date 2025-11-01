# Landing Page Documentation

## Overview
A minimal, modern, and creative landing page for the Warehouse Management System that showcases the project's features, tech stack, and capabilities.

## Design Principles
- **Minimal**: Clean layout with ample white space
- **Modern**: Gradient backgrounds, smooth transitions, glassmorphism effects
- **Responsive**: Fully responsive design for all screen sizes
- **Accessible**: Proper semantic HTML and ARIA labels

## Page Sections

### 1. Navigation Bar
- Fixed top navigation with glassmorphism effect (backdrop blur)
- WMS logo with Package icon
- "Get Started" CTA button linking to login

### 2. Hero Section
- Bold headline with gradient text effect
- Descriptive subtitle
- Dual CTAs: "Access Dashboard" and "Learn More"
- Demo credentials card for easy testing

### 3. Features Section
- 4 feature cards with icons:
  - Inventory Management
  - Analytics & Reports
  - Role-Based Access
  - Approval Workflow

### 4. Tech Stack Section
- 8 technology cards showing:
  - Next.js 14 (Framework)
  - TypeScript (Language)
  - Prisma (ORM)
  - PostgreSQL (Database)
  - TailwindCSS (Styling)
  - shadcn/ui (UI Components)
  - JWT (Authentication)
  - Zod (Validation)

### 5. System Capabilities
- Two-column layout:
  - Left: 8 key features with checkmarks
  - Right: 4 capability cards (Database, Cloud, Security, Performance)

### 6. About/Credits Section
- Project description
- Developer credits
- Social links (GitHub, LinkedIn, Contact)
- Gradient background card

### 7. Call-to-Action Section
- Blue gradient background
- Final CTA to access dashboard

### 8. Footer
- Copyright information
- Tech stack summary

## Color Palette
- **Primary**: Blue (#2563eb - blue-600)
- **Secondary**: Purple accents
- **Neutral**: Gray scale for text and backgrounds
- **Success**: Green for checkmarks and positive indicators
- **Gradients**: Subtle blue-to-purple gradients throughout

## Customization

### Update Social Links
Edit lines 222-239 in `/src/app/page.tsx`:
```typescript
<a href="YOUR_GITHUB_URL" target="_blank" rel="noopener noreferrer">
  <Button variant="outline" size="sm" className="gap-2">
    <Github className="w-4 h-4" />
    GitHub
  </Button>
</a>
```

### Update Demo Credentials
Edit lines 87-99 in `/src/app/page.tsx` to match your actual test credentials.

### Modify Features
Edit the `features` array (lines 7-28) to add/remove/modify feature cards.

### Modify Tech Stack
Edit the `techStack` array (lines 30-39) to update technologies.

## Access
- **URL**: `http://localhost:3000` (development)
- **Public**: No authentication required
- **Mobile-Friendly**: Yes

## Performance
- Server-side rendered with Next.js 14
- Optimized images and icons from Lucide React
- Minimal JavaScript, primarily static content
- Fast initial page load

## Future Enhancements
- [ ] Add animations on scroll (AOS library)
- [ ] Include screenshots/demo video
- [ ] Add testimonials section
- [ ] Include system statistics (if available)
- [ ] Dark mode toggle
- [ ] Multiple language support
