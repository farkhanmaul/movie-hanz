# Movie Hanz 🎬

Movie Hanz adalah aplikasi web React yang modern untuk menjelajahi film dan acara TV. Aplikasi ini menggunakan API The Movie Database (TMDb) untuk memberikan pengalaman komprehensif dalam menemukan dan menonton informasi lengkap tentang konten hiburan favorit Anda.

## Features

### 🎯 Core Features
- ✨ **Homepage dengan Hero Section** - Menampilkan film trending dengan informasi lengkap
- 🔍 **Advanced Search** - Pencarian real-time dengan filter komprehensif
- 🎭 **Detail Film/TV Lengkap** - Cast, crew, trailer, dan informasi produksi
- 📊 **Multiple Categories** - Trending, Now Playing, Top Rated, dan Genres
- 🎪 **Genre Browsing** - Jelajahi konten berdasarkan genre dengan interface intuitif

### 🎨 UI/UX Features
- 📱 **Fully Responsive** - Optimal di semua perangkat (desktop, tablet, mobile)
- 🌙 **Light/Dark Mode** - Toggle tema dengan transisi halus
- ✨ **Smooth Animations** - Page transitions dan hover effects yang halus
- 🎬 **Netflix-style Design** - Interface modern dengan typography premium
- 📊 **Year Filtering** - Filter konten berdasarkan tahun rilis

### 🚀 Technical Features
- ⚡ **Clean URLs** - Routing tanpa hash untuk SEO-friendly URLs
- 🔄 **Lazy Loading** - Optimasi performa dengan lazy loading images
- 📄 **Pagination** - Navigasi konten yang efisien
- 🎯 **Click-to-Navigate** - Navigation intuitif ke detail pages
- 🎪 **Crew Display** - Text-based crew information dengan positions

## Tech Stack

- **Frontend**: React 18.2.0 dengan React Router DOM
- **Styling**: CSS3 dengan Custom Properties & Flexbox/Grid
- **HTTP Client**: Axios untuk API requests
- **Animations**: React Transition Group untuk smooth transitions
- **API**: The Movie Database (TMDb) API v3
- **Icons**: Custom SVG icons & GitHub/Claude branding

## Getting Started

### Prerequisites

- Node.js (versi 14 atau lebih tinggi)
- npm atau yarn

### Installation

1. Clone repository ini
```bash
git clone https://github.com/farkhanmaul/movie-hanz.git
cd movie-hanz
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
Buat file `.env` di root directory dan tambahkan:
```env
REACT_APP_BASEIMGURL=https://image.tmdb.org/t/p/w500
REACT_APP_APIKEY=your_tmdb_api_key_here
```

Untuk mendapatkan API key:
1. Kunjungi [TMDb](https://www.themoviedb.org/)
2. Buat akun dan verifikasi email
3. Pergi ke Settings > API > Request API Key
4. Pilih "Developer" dan isi form yang diperlukan

4. Jalankan aplikasi
```bash
npm start
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## Project Structure

```
movie-hanz/
├── public/
│   ├── index.html
│   └── favicon.svg
├── src/
│   ├── components/          # Komponen reusable
│   │   ├── SearchSection.js # Search modal & functionality
│   │   ├── MovieDetail.js   # Detail view component
│   │   ├── TopRatedSection.js # Top rated dengan year filter
│   │   ├── GenreBrowse.js   # Genre selection interface
│   │   └── ...
│   ├── pages/               # Page components untuk routing
│   │   ├── HomePage.js      # Landing page dengan hero
│   │   ├── MovieDetailPage.js # Dedicated movie detail page
│   │   ├── GenresPage.js    # Genre browsing page
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── api.js              # TMDb API integration
│   ├── App.js              # Main app dengan routing
│   └── App.css             # Global styles & theming
└── README.md
```

## Available Scripts

### `npm start`
Jalankan aplikasi dalam development mode di [http://localhost:3000](http://localhost:3000)

### `npm run build`
Build aplikasi untuk production ke folder `build/`

### `npm test`
Jalankan test runner

## Features Detail

### 🎬 Homepage
- **Hero Section**: Film trending terpopuler dengan backdrop, poster, dan informasi lengkap
- **Multiple Sections**: Trending, Now Playing, Top Rated dengan pagination
- **Quick Navigation**: Akses cepat ke berbagai kategori

### 🔍 Search & Discovery
- **Advanced Search**: Pencarian real-time dengan debouncing
- **Genre Browsing**: Interface card-based untuk memilih genre
- **Year Filtering**: Filter konten berdasarkan tahun rilis di Top Rated
- **Smart Pagination**: Navigasi halaman yang responsif

### 📱 Responsive Design
- **Mobile-First**: Optimized untuk mobile dengan breakpoints responsif
- **Touch-Friendly**: Interface yang mudah digunakan di perangkat sentuh
- **Adaptive Layout**: Grid dan flexbox yang menyesuaikan ukuran layar

### 🎨 Theming
- **Dual Theme**: Light dan Dark mode dengan transisi halus
- **CSS Variables**: Sistem theming yang konsisten
- **Netflix-inspired**: Design language yang familiar dan modern

## Performance & Optimization

- **Lazy Loading**: Images dimuat secara bertahap untuk performa optimal
- **API Optimization**: Efficient caching dan error handling
- **Bundle Optimization**: Tree-shaking dan code splitting untuk ukuran bundle minimal
- **SEO-Friendly**: Clean URLs dan meta tags yang proper

## Browser Support

- ✅ Chrome (80+)
- ✅ Firefox (75+)
- ✅ Safari (13+)
- ✅ Edge (80+)

## API Reference

Aplikasi ini menggunakan [The Movie Database (TMDb) API](https://developers.themoviedb.org/3):

- `GET /movie/popular` - Film populer
- `GET /movie/top_rated` - Film top rated dengan year filter
- `GET /movie/now_playing` - Film sedang tayang
- `GET /trending/all/day` - Trending harian
- `GET /genre/movie/list` - Daftar genre
- `GET /search/multi` - Search multimedia

## Contributing

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## Changelog

### v2.0 (Latest)
- ✨ Added smooth page transitions dengan React Transition Group
- 🎨 Redesigned genre browsing dengan card interface
- 📊 Added year filtering untuk top rated content  
- 🔗 Converted dari hash routing ke clean URLs
- 👥 Changed crew display ke text-based format
- 🌙 Enhanced light/dark mode dengan better contrast
- 📱 Improved mobile responsiveness

### v1.0
- 🎬 Initial release dengan basic movie browsing
- 🔍 Search functionality
- 📱 Responsive design
- 🎭 Movie details modal

## License

Project ini menggunakan MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## Demo

🔗 [Live Demo](https://farkhanmaul.github.io/movie-hanz)

## Credits

- **Design Inspiration**: Netflix UI/UX patterns
- **API**: [The Movie Database (TMDb)](https://www.themoviedb.org/)
- **Icons**: Custom SVG + [GitHub](https://github.com) + [Claude](https://claude.ai)

## Author

**Farkhan Maul** - [GitHub](https://github.com/farkhanmaul) | [LinkedIn](https://linkedin.com/in/farkhanmaul)

---

*Built with ❤️ using React and TMDb API*
