# Nexus Analytics

Modern analytics dashboard with interactive charts, real-time metrics, transaction tracking, and responsive design.

![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Features

- **Interactive Charts** — line, bar, doughnut, and heatmap powered by Chart.js
- **KPI Cards** — animated counters with sparkline mini-charts
- **Transaction Table** — sortable columns, pagination, and CSV export
- **Multi-Page Navigation** — Dashboard, Analytics, Reports, Audience, Settings
- **Dark/Light Theme** — toggle with persistence via localStorage
- **Fully Responsive** — optimized for desktop, tablet, and mobile
- **Glassmorphism UI** — modern frosted-glass card effects with smooth animations
- **Dropdown Menus** — notifications and profile with real-time badge updates
- **Search & Filters** — live table filtering and date range selectors (7D/30D/90D/1Y)

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic markup and structure |
| CSS3 | Glassmorphism, CSS Grid, custom properties, responsive design |
| Vanilla JavaScript | All interactivity, no frameworks |
| Chart.js 4.x | Data visualization (CDN) |
| Google Fonts (Inter) | Typography |

## Getting Started

### Prerequisites

Any modern web browser (Chrome, Firefox, Safari, Edge). No build tools or server required.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/deniskosminai/site_dasbord.git
cd site_dasbord
```

2. Open `index.html` in your browser, or serve it locally:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

3. Navigate to `http://localhost:8000`

## Project Structure

```
site_dasbord/
├── index.html    # Main HTML structure with all pages
├── styles.css    # Complete stylesheet with dark/light themes
├── app.js        # All JavaScript logic (charts, table, UI)
└── README.md     # Project documentation
```

## Usage

### Navigation

Use the left sidebar to switch between pages:

- **Dashboard** — main overview with KPI cards, revenue charts, transaction table
- **Analytics** — page views, bounce rate, top pages, engagement score
- **Reports** — generated reports list with download buttons
- **Audience** — demographic data, user segments, age distribution
- **Settings** — profile management, preferences, notification toggles

### Interactive Elements

| Element | Action |
|---|---|
| KPI cards | Hover to see glow effect |
| Date filters (7D/30D/90D/1Y) | Click to update revenue chart data range |
| Table headers | Click to sort by column (ascending/descending) |
| Pagination buttons | Navigate through transaction pages |
| Export button | Download transactions as CSV |
| Theme toggle | Switch between dark and light mode |
| Notification bell | Open dropdown, click to mark as read |
| Profile avatar | Open profile dropdown menu |
| Search bar | Filter transaction table in real time |

### Keyboard Shortcuts

- `Escape` — close mobile sidebar overlay

## Screenshots

### Dark Mode

The dashboard features a deep dark theme with purple accent gradients and frosted-glass card effects.

### Light Mode

Clean light theme with subtle shadows and the same gradient accents.

## Mock Data

All data displayed is procedurally generated on each page load:

- **50 transactions** — randomized customers, dates, amounts, statuses, and sources
- **Revenue data** — realistic fluctuating trend with upward trajectory
- **Heatmap** — activity patterns reflecting work hours and weekends
- **Sparklines** — smooth random walks within KPI-specific ranges

## Browser Support

| Browser | Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Chart.js](https://www.chartjs.org/)
- Font by [Google Fonts](https://fonts.google.com/) — Inter
