# MovieHanz Portal 🎬

MovieHanz adalah aplikasi web React yang modern untuk menjelajahi film dan acara TV. Aplikasi ini menggunakan API The Movie Database (TMDb) untuk memberikan pengalaman komprehensif dalam menemukan dan menonton informasi lengkap tentang konten hiburan favorit Anda dengan UI yang elegant dan responsive.

## ✨ Features

### 🎯 Core Features
- 🏠 **Homepage dengan Hero Section** - Menampilkan film trending dengan backdrop cinematic
- 🔍 **Advanced Multi-Search** - Pencarian real-time untuk movies, TV shows, dan people
- 🎭 **Detail Film/TV Lengkap** - Cast, crew, trailer, seasons, dan informasi produksi
- 📊 **Multiple Categories** - Popular, Trending, Top Rated, Now Playing
- 🎪 **Genre & Company Browsing** - Jelajahi konten berdasarkan genre atau production company
- 👥 **Cast & Crew Pages** - Halaman dedicated untuk aktor, sutradara, dan crew
- 📄 **Smart Pagination** - Navigasi konten dengan infinite scroll feel

### 🎨 UI/UX Features v2.0
- 📱 **Fully Responsive** - Mobile-first design optimal di semua perangkat
- 🌙 **Light/Dark Mode Toggle** - Tema switching dengan smooth transitions
- ✨ **Smooth Page Transitions** - Loading animations dan fade effects antar halaman
- 🎬 **Netflix-style Interface** - Modern card-based design dengan premium typography
- 🔄 **Auto Scroll Reset** - Otomatis scroll ke top saat navigasi halaman
- 🎯 **Enhanced Hover Effects** - Interactive feedback pada semua elemen clickable
- 🚫 **Custom 404 Page** - Branded error page dengan navigation links

### 🚀 Technical Features
- ⚡ **HashRouter Navigation** - Optimized untuk GitHub Pages deployment
- 🖼️ **Lazy Loading Images** - Performance optimization dengan placeholder fallbacks
- 🔄 **Component Code Splitting** - Lazy loaded pages untuk bundle optimization
- 📱 **Touch-Friendly Interface** - Optimized untuk mobile interactions
- 🎪 **Dynamic Content Loading** - Background loading dengan loading states
- 🔍 **Debounced Search** - Performance-optimized search dengan 500ms delay
- 🎨 **CSS Custom Properties** - Systematic theming dengan CSS variables

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0 + React Router DOM v6
- **Styling**: Custom CSS3 dengan Netflix-inspired design system
- **State Management**: React Hooks dengan local state patterns
- **API Integration**: Fetch API dengan custom error handling
- **Performance**: React.lazy() code splitting + Intersection Observer
- **Deployment**: GitHub Pages dengan GitHub Actions CI/CD
- **Development**: Create React App dengan custom build optimizations

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- npm v8+ atau yarn v1.22+
- TMDB API key (free registration)

### Installation

1. **Clone & Install**
```bash
git clone https://github.com/farkhanmaul/movie-hanz.git
cd movie-hanz
npm install
```

2. **Environment Setup**
```bash
# Create .env file
REACT_APP_APIKEY=your_tmdb_api_key_here
REACT_APP_BASEURL=https://api.themoviedb.org/3
REACT_APP_BASEIMGURL=https://image.tmdb.org/t/p/w500
```

**Get TMDB API Key:**
1. Visit [TMDB Developer Portal](https://www.themoviedb.org/settings/api)
2. Create account & verify email
3. Request API key (Developer option)
4. Copy API key to .env file

3. **Start Development Server**
```bash
npm start
# Opens http://localhost:3000
```

## 📁 Project Architecture

```
movie-hanz/
├── 📁 public/
│   ├── index.html                 # Main HTML template
│   ├── favicon.svg               # Site icon
│   └── manifest.json             # PWA configuration
├── 📁 src/
│   ├── App.js                    # Main app + routing logic
│   ├── App.css                   # Global styles + theme system
│   ├── api.js                    # TMDB API integration layer
│   ├── 📁 components/            # Reusable UI components
│   │   ├── FilteredMovies.js     # Generic filtering interface
│   │   ├── MovieDetail.js        # Movie detail modal
│   │   ├── TVDetail.js          # TV show detail modal
│   │   ├── SearchSection.js      # Search modal + functionality
│   │   └── 📁 ui/               # Pure UI components
│   │       ├── Pagination.js     # Reusable pagination
│   │       ├── PageTransition.js # Page transition wrapper
│   │       └── LoadingSpinner.js # Loading components
│   ├── 📁 pages/                # Route-level page components
│   │   ├── HomePage.js          # Landing page + hero
│   │   ├── MoviesPage.js        # Popular movies grid
│   │   ├── TVShowsPage.js       # Popular TV shows grid
│   │   ├── TopRatedPage.js      # Top rated content
│   │   ├── CastPage.js          # Actor/cast member pages
│   │   ├── CrewPage.js          # Crew member pages
│   │   ├── CompanyPage.js       # Production company pages
│   │   ├── GenrePage.js         # Genre-based filtering
│   │   └── NotFoundPage.js      # Custom 404 page
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── useScrollToTop.js    # Auto scroll on navigation
│   │   ├── useApi.js            # API data fetching hook
│   │   └── useLazyLoad.js       # Image lazy loading
│   └── 📁 utils/                # Helper functions
│       ├── constants.js         # App constants
│       └── helpers.js           # Utility functions
├── 📁 claude/                   # Developer documentation
│   ├── FUTURE_FEATURES.md       # Feature roadmap
│   └── TECHNICAL_SPECIFICATION.md # Developer guide
└── 📁 .github/workflows/        # CI/CD automation
    └── deploy.yml               # GitHub Pages deployment
```

## 🎯 Available Scripts

```bash
npm start          # Development server (localhost:3000)
npm run build      # Production build
npm test           # Run test suite
npm run lint       # Code linting (if configured)
```

## 🌟 Features Deep Dive

### 🏠 Enhanced Homepage Experience
- **Cinematic Hero**: Full-screen trending movie backdrop dengan overlay information
- **Multi-Section Layout**: Popular Movies, TV Shows, Trending content
- **Background Loading**: Konten dimuat progressively untuk UX yang smooth
- **Quick Navigation**: Direct access ke semua kategori content

### 🔍 Powerful Search & Discovery
- **Multi-Search**: Unified search untuk movies, TV shows, dan people
- **Real-time Results**: Debounced search dengan instant feedback
- **Category Tabs**: Organized results dengan visual indicators
- **Genre Exploration**: Visual genre cards dengan hover effects
- **Company Pages**: Production company information dengan filmography

### 📱 Mobile-Optimized Design
- **Touch-First Interface**: Large tap targets dan touch-friendly interactions
- **Responsive Grid**: Adaptive layouts dari mobile ke desktop
- **Performance Focus**: Optimized images dan lazy loading
- **Smooth Scrolling**: Native scroll behavior dengan momentum

### 🎨 Advanced Theming System
- **CSS Custom Properties**: Systematic color and spacing tokens
- **Smooth Transitions**: 400ms cubic-bezier transitions throughout
- **Netflix-Inspired**: Professional entertainment industry design language
- **Accessibility**: High contrast ratios dan keyboard navigation support

## 🚀 Performance & Optimization

### Frontend Performance
- **Code Splitting**: Route-level lazy loading mengurangi initial bundle size
- **Image Optimization**: WebP support dengan fallbacks, lazy loading
- **Debounced Inputs**: Search optimization untuk mengurangi API calls
- **Efficient Re-renders**: Optimized React patterns dan memoization

### API Optimization  
- **Request Batching**: `append_to_response` untuk mengurangi API calls
- **Error Handling**: Comprehensive error states dengan retry functionality
- **Cache Strategy**: Browser caching headers dan intelligent data fetching
- **Rate Limit Awareness**: Built-in delays untuk menghindari TMDB limits

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|---------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Mobile Optimized |
| Chrome Mobile | Android 90+ | ✅ Mobile Optimized |

## 📖 API Integration

MovieHanz mengintegrasikan **TMDB API v3** dengan endpoint coverage:

### Core Content
- `GET /movie/popular` - Popular movies dengan pagination
- `GET /tv/popular` - Popular TV shows dengan pagination  
- `GET /movie/top_rated` - Top rated movies
- `GET /tv/top_rated` - Top rated TV shows
- `GET /trending/{media_type}/{time_window}` - Trending content

### Detailed Information
- `GET /movie/{movie_id}` - Detailed movie information
- `GET /tv/{tv_id}` - Detailed TV show information
- `GET /person/{person_id}` - Cast/crew member details
- `GET /company/{company_id}` - Production company information

### Discovery & Search
- `GET /search/multi` - Multi-search functionality
- `GET /discover/movie` - Movie discovery dengan filters
- `GET /discover/tv` - TV show discovery dengan filters
- `GET /genre/movie/list` - Movie genres list
- `GET /genre/tv/list` - TV genres list

## 📈 Version History

### 🚀 v2.0.0 (Latest - January 2025)
**"Enhanced User Experience Update"**

#### 🎉 New Features
- ✨ **Smooth Page Transitions** - Loading animations dengan 400ms timing
- 🔄 **Auto Scroll Reset** - Otomatis scroll ke top saat navigasi
- 📺 **TV Shows Pagination** - Full pagination support untuk TV shows
- 🎯 **Enhanced Hover Effects** - Interactive feedback pada semua elements
- 🚫 **Custom 404 Page** - Branded error handling dengan navigation

#### 🐛 Bug Fixes  
- ✅ Fixed TVDetail scroll issue - Dapat scroll dengan normal
- ✅ Fixed missing TV show pagination - Sekarang ada pagination controls
- ✅ Fixed invisible page transitions - Timing diperbaiki untuk visibility
- ✅ API consistency - TV shows API menggunakan proper pagination

#### 🔧 Technical Improvements
- 🎨 Enhanced CSS animations dengan cubic-bezier easing
- ⚡ Optimized component structure untuk better performance
- 📱 Improved mobile touch interactions
- 🔄 Better state management patterns

### 🎬 v1.5.0 (December 2024) 
- 🎭 Cast & crew detailed pages
- 🏢 Production company pages  
- 🎪 Genre-based filtering
- 📱 Mobile responsiveness improvements

### 🚀 v1.0.0 (November 2024)
- 🎬 Initial release dengan core movie browsing
- 🔍 Basic search functionality
- 📱 Responsive design foundation
- 🎭 Movie details modal interface

## 🤝 Contributing

Kami welcome contributions! Silakan ikuti guidelines:

1. **Fork Repository**
2. **Create Feature Branch** - `git checkout -b feature/amazing-feature`
3. **Commit Changes** - `git commit -m 'Add amazing feature'`
4. **Push to Branch** - `git push origin feature/amazing-feature`  
5. **Open Pull Request** dengan deskripsi lengkap

### Development Guidelines
- Follow existing code style dan patterns
- Test changes pada multiple devices
- Update documentation jika diperlukan
- Ensure responsive design compliance

## 📄 License

Project ini menggunakan **MIT License** - see [LICENSE](LICENSE) file for details.

## 🌐 Links

- 🔗 **Live Demo**: [MovieHanz Portal](https://farkhanmaul.github.io/movie-hanz)
- 📚 **API Documentation**: [TMDB API Docs](https://developers.themoviedb.org/3)
- 📋 **Future Features**: [Roadmap](./claude/FUTURE_FEATURES.md)
- 🛠️ **Technical Docs**: [Developer Guide](./claude/TECHNICAL_SPECIFICATION.md)

## 👨‍💻 Author

**Farkhan Maul**
- GitHub: [@farkhanmaul](https://github.com/farkhanmaul)
- LinkedIn: [farkhanmaul](https://linkedin.com/in/farkhanmaul)
- Email: farkhanmaul@example.com

## 🙏 Credits & Acknowledgments

- **🎨 Design Inspiration**: Netflix UI/UX patterns dan modern entertainment platforms
- **📡 API Provider**: [The Movie Database (TMDB)](https://www.themoviedb.org/) untuk comprehensive movie/TV data
- **🎭 Icons & Assets**: Custom SVG icons + GitHub + Claude AI branding
- **💻 Development**: Built dengan React ecosystem dan modern web standards
- **🚀 Deployment**: GitHub Pages dengan GitHub Actions automation

---

<div align="center">

**Built with ❤️ using React and TMDB API**

*MovieHanz v2.0 - Bringing cinematic experiences to the web*

⭐ **Star this repo jika project ini membantu!** ⭐

</div>