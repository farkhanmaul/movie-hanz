# Navbar Component

Clean, responsive navigation component using single-container approach.

## Features

- **Single Responsive Container**: No duplicate navbar structures
- **BEM CSS Methodology**: Clean, maintainable CSS classes
- **Custom Hooks**: Theme management with localStorage persistence
- **Mobile-First Design**: Smooth transform animations for mobile dropdown
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Architecture

```
Navbar/
├── Navbar.js          # Main component
├── Navbar.css         # BEM-style responsive CSS  
└── README.md          # This documentation
```

## Usage

```jsx
import Navbar from './components/Navbar/Navbar';

<Navbar onSearchClick={handleSearchClick} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `onSearchClick` | `function` | Callback for search input focus |

## CSS Classes (BEM)

```css
.navbar                          # Main container
.navbar__container              # Inner flex container
.navbar__logo                   # Logo link
.navbar__search                 # Search container
.navbar__search-input           # Search input
.navbar__search-icon            # Search icon
.navbar__menu-toggle            # Mobile hamburger button
.navbar__menu-toggle--active    # Active hamburger state
.navbar__nav                    # Navigation links container
.navbar__nav--mobile-open       # Mobile dropdown open state
.navbar__nav-link               # Navigation link
.navbar__nav-link--active       # Active navigation link
.navbar__theme-toggle           # Theme toggle button
.navbar__theme-icon             # Theme icon (desktop)
.navbar__theme-text             # Theme text (mobile)
```

## Responsive Behavior

### Desktop (>768px)
- Horizontal layout with flex row
- Icon-only theme toggle
- No hamburger button visible

### Mobile (≤768px)
- Vertical dropdown with smooth transform
- Text-based theme toggle
- Hamburger menu button visible
- Touch-friendly larger hit targets

## Dependencies

- `react-router-dom` - Navigation routing
- `../../constants/navigation` - Navigation configuration
- `../../hooks/useTheme` - Theme management hook