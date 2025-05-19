# CryptoWallet Dashboard

![Version](https://img.shields.io/badge/version-1.0.2-blue)
![Status](https://img.shields.io/badge/status-active-success)

## Project Overview

CryptoWallet Dashboard is a sophisticated, dark-themed cryptocurrency wallet interface with elegant animations and a clean user experience. This dashboard allows users to manage their crypto portfolio, track transactions, view market data, and adjust account settings.

**Last Updated:** 2025-05-15

## Tech Stack

* **HTML5** - Semantic markup structure
* **CSS3** - Modern styling with CSS variables and animations
* **JavaScript** - Vanilla JS for DOM manipulation and animations
* **Chart.js** - For interactive data visualization
* **Intersection Observer API** - For scroll-based animations
* **Font Awesome** - For iconography


## Theme System

The dashboard implements a dark theme using CSS variables for consistent styling across components. The color palette focuses on deep blues and purples with accent colors to highlight important information.

### Key Design Elements

* **Dark Background** - Reduces eye strain and creates a sophisticated look
* **Card-based Layout** - Each section is contained in distinct card elements
* **Glowing Accents** - Subtle glows around key elements draw attention
* **Gradient Highlights** - Linear and radial gradients provide depth
* **Animated Interactions** - Smooth transitions between states

### CSS Variables

The theme uses a comprehensive set of CSS variables for colors, shadows, and dimensions, making it easily customizable:

```css
:root {
    --bg-dark: #121212;
    --bg-darker: #0a0a0a;
    --bg-card: #1e1e1e;
    --bg-card-hover: #252525;
    --bg-elevated: #2a2a2a;
    
    --primary: #6d56c1;
    --primary-light: #8a70dd;
    --primary-dark: #5540a3;
    --secondary: #00b8d4;
    --accent: #8657ff;
    --accent-alt: #00e5ff;
    
    /* Additional variables defined in Dashboard.css */
}
```

## 📁 Where Things Are
```
crypto-wallet-dashboard/
├── index.html              # The main page
├── Dashboard.css           # Main styling
├── animations.css          # Animation effects
├── notification.css        # Notification styling
├── Dashboard.js            # Main functionality
├── DashboardService.js     # Data handling
├── LoginService.js         # Login stuff
└── particles.js            # Background effects
```

