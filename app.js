'use strict';

(function() {
  // ===== MODULE 1: DATA & UTILS =====
  const CUSTOMERS = ['Emma Wilson', 'James Brown', 'Sofia Martinez', 'Liam Johnson', 'Olivia Davis', 'Noah Garcia', 'Ava Rodriguez', 'William Jones', 'Isabella Lee', 'Benjamin Clark', 'Mia Lewis', 'Lucas Walker', 'Charlotte Hall', 'Henry Allen', 'Amelia Young', 'Alexander King', 'Harper Wright', 'Daniel Scott', 'Evelyn Green', 'Michael Adams'];
  const STATUSES = ['completed', 'pending', 'failed', 'processing'];
  const SOURCES = ['Google', 'Direct', 'Social', 'Email', 'Referral'];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const pick = arr => arr[randInt(0, arr.length - 1)];

  const generateMockTransactions = count =>
    Array.from({ length: count }, (_, i) => ({
      id: `TRX-${String(randInt(1000, 9999))}`,
      customer: pick(CUSTOMERS),
      date: new Date(Date.now() - randInt(0, 90) * 86400000),
      amount: parseFloat(rand(50, 5000).toFixed(2)),
      status: pick(STATUSES),
      source: pick(SOURCES),
    }));

  const generateRevenueData = days => {
    const data = [];
    let revenue = 3000;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const trend = (days - i) * 15;
      revenue = 2000 + trend + rand(-500, 500) + Math.sin(i * 0.3) * 300;
      revenue = Math.max(2000, Math.min(8000, revenue));
      data.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: parseFloat(revenue.toFixed(2)),
        target: 0,
      });
    }
    const avg = data.reduce((s, d) => s + d.revenue, 0) / data.length;
    const target = parseFloat((avg * 1.1).toFixed(2));
    data.forEach(d => d.target = target);
    return data;
  };

  const generateHeatmapData = () =>
    Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => {
        const isWeekend = day === 5 || day === 6;
        const isWorkHours = hour >= 9 && hour <= 17;
        if (isWeekend) return randInt(1, 3);
        if (isWorkHours) return randInt(3, 5);
        if (hour >= 0 && hour <= 5) return randInt(0, 1);
        return randInt(1, 3);
      })
    );

  const generateSparklineData = (points, min, max) => {
    const data = [rand(min, max)];
    const delta = (max - min) / points * 2;
    for (let i = 1; i < points; i++) {
      const prev = data[i - 1];
      let next = prev + rand(-delta, delta);
      next = Math.max(min, Math.min(max, next));
      data.push(parseFloat(next.toFixed(2)));
    }
    return data;
  };

  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const formatCurrency = n =>
    '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const formatDate = d =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const TRANSACTIONS = generateMockTransactions(50);
  let currentSort = { key: null, dir: 'asc' };
  let currentPage = 1;
  const perPage = 10;
  let currentDays = 30;

  // ===== MODULE 2: CHARTS =====
  Chart.defaults.font.family = 'Inter';
  Chart.defaults.color = '#94a3b8';

  let revenueChart;
  let trafficChart;
  let deviceChart;

  function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  function tooltipConfig() {
    return {
      backgroundColor: '#1a1a2e',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: true,
      boxPadding: 4
    };
  }

  function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const data = generateRevenueData(currentDays);
    const gradient = createGradient(ctx, 'rgba(99,102,241,0.3)', 'rgba(99,102,241,0)');

    revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: 'Revenue',
            data: data.map(d => d.revenue),
            borderColor: '#6366f1',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#6366f1'
          },
          {
            label: 'Target',
            data: data.map(d => d.target),
            borderColor: '#10b981',
            borderDash: [5, 5],
            pointRadius: 0,
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: tooltipConfig()
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  function initTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    const labels = ['Organic', 'Direct', 'Social', 'Email', 'Referral'];
    const data = [4200, 3100, 2800, 1900, 1500];
    const bgColors = labels.map(() => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#a855f7');
      return gradient;
    });

    trafficChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: bgColors,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: tooltipConfig()
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { display: false }
          }
        }
      }
    });
  }

  function initDeviceChart() {
    const ctx = document.getElementById('deviceChart').getContext('2d');

    deviceChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
        datasets: [{
          data: [45, 38, 12, 5],
          backgroundColor: ['#6366f1', '#06b6d4', '#f59e0b', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: tooltipConfig()
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: function(chart) {
          const { width, height, ctx } = chart;
          ctx.restore();
          const fontSize = (height / 8).toFixed(0);
          ctx.font = 'bold ' + fontSize + 'px Inter';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText('83%', width / 2, height / 2 - 10);
          ctx.font = (fontSize * 0.5) + 'px Inter';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Devices', width / 2, height / 2 + 18);
          ctx.save();
        }
      }]
    });
  }

  function initCharts() {
    initRevenueChart();
    initTrafficChart();
    initDeviceChart();
  }

  function updateRevenueChart(days) {
    const data = generateRevenueData(days);
    revenueChart.data.labels = data.map(d => d.label);
    revenueChart.data.datasets[0].data = data.map(d => d.revenue);
    revenueChart.data.datasets[1].data = data.map(d => d.target);
    revenueChart.update();
  }

  // ===== MODULE 3: HEATMAP + SPARKLINES =====
  function initHeatmap() {
    const container = document.getElementById('heatmap');
    if (!container) return;

    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'auto repeat(24, 1fr)';
    grid.style.gap = '3px';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const heatmapData = generateHeatmapData();

    const corner = document.createElement('div');
    grid.appendChild(corner);

    for (let h = 0; h < 24; h++) {
      const label = document.createElement('div');
      label.className = 'heatmap-hour';
      label.textContent = h;
      grid.appendChild(label);
    }

    for (let d = 0; d < 7; d++) {
      const dayLabel = document.createElement('div');
      dayLabel.className = 'heatmap-label';
      dayLabel.textContent = days[d];
      grid.appendChild(dayLabel);

      for (let h = 0; h < 24; h++) {
        const cell = document.createElement('div');
        const level = heatmapData[d][h];
        cell.className = 'heatmap-cell';
        cell.dataset.level = level;
        grid.appendChild(cell);
      }
    }

    container.appendChild(grid);
  }

  function initSparklines() {
    const configs = {
      revenue: { min: 3000, max: 8000, color: '#6366f1' },
      users: { min: 15000, max: 25000, color: '#06b6d4' },
      conversion: { min: 2, max: 4.5, color: '#f59e0b' },
      session: { min: 3, max: 6, color: '#10b981' },
    };

    const canvases = document.querySelectorAll('.kpi-card .sparkline');
    canvases.forEach((canvas) => {
      const card = canvas.closest('.kpi-card');
      const kpiType = card?.dataset.kpi;
      if (!kpiType || !configs[kpiType]) return;

      const { min, max, color } = configs[kpiType];
      const rect = card.getBoundingClientRect();
      const width = rect.width;
      const height = 50;

      canvas.width = width;
      canvas.height = height;

      const data = generateSparklineData(20, min, max);
      const dataMin = Math.min(...data);
      const dataMax = Math.max(...data);
      const range = dataMax - dataMin || 1;
      const padding = 4;

      const ctx = canvas.getContext('2d');
      const points = data.map((val, i) => ({
        x: padding + (i / (data.length - 1)) * (width - padding * 2),
        y: height - padding - ((val - dataMin) / range) * (height - padding * 2),
      }));

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color + '4D');
      gradient.addColorStop(1, color + '00');

      ctx.beginPath();
      ctx.moveTo(points[0].x, height);
      ctx.lineTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, (points[i].y + points[i + 1].y) / 2);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(points[points.length - 1].x, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, (points[i].y + points[i + 1].y) / 2);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  let analyticsChartsInitialized = false;
  function initAnalyticsCharts() {
    if (analyticsChartsInitialized) return;
    analyticsChartsInitialized = true;

    const pageViewsCtx = document.getElementById('pageViewsChart');
    if (pageViewsCtx) {
      new Chart(pageViewsCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Page Views',
            data: [12400, 15800, 14200, 18900],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#6366f1'
          }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => (v/1000).toFixed(0) + 'K' } } } }
      });
    }

    const bounceCtx = document.getElementById('bounceChart');
    if (bounceCtx) {
      new Chart(bounceCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['/home', '/products', '/pricing', '/blog', '/contact'],
          datasets: [{ data: [35, 42, 28, 55, 18], backgroundColor: ['#6366f1', '#a855f7', '#06b6d4', '#f59e0b', '#10b981'], borderRadius: 6, borderSkipped: false }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => v + '%' } } } }
      });
    }

    const topPages = document.getElementById('topPages');
    if (topPages) {
      const pages = [
        { path: '/home', views: 45200, pct: 100 },
        { path: '/products', views: 32100, pct: 71 },
        { path: '/pricing', views: 28400, pct: 63 },
        { path: '/blog/getting-started', views: 19800, pct: 44 },
        { path: '/docs/api', views: 15600, pct: 35 },
      ];
      topPages.innerHTML = pages.map(p => `
        <div class="top-page-item">
          <div style="flex:1">
            <div class="top-page-path">${p.path}</div>
            <div class="top-page-bar" style="--w:${p.pct}%"></div>
          </div>
          <span class="top-page-views">${(p.views/1000).toFixed(1)}K views</span>
        </div>
      `).join('');
    }

    const engagementCtx = document.getElementById('engagementChart');
    if (engagementCtx) {
      new Chart(engagementCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['High', 'Medium', 'Low'],
          datasets: [{ data: [42, 35, 23], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: true, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16 } } } }
      });
    }
  }

  let audienceChartsInitialized = false;
  function initAudiencePage() {
    if (audienceChartsInitialized) return;
    audienceChartsInitialized = true;

    const demogCtx = document.getElementById('demographicsChart');
    if (demogCtx) {
      new Chart(demogCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['US', 'UK', 'Germany', 'France', 'Japan', 'Other'],
          datasets: [{ label: 'Users', data: [42000, 18000, 15000, 12000, 9000, 22000], backgroundColor: '#6366f1', borderRadius: 6, borderSkipped: false }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => (v/1000).toFixed(0) + 'K' } } } }
      });
    }

    const ageCtx = document.getElementById('ageChart');
    if (ageCtx) {
      new Chart(ageCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
          datasets: [{ data: [15, 38, 25, 14, 8], backgroundColor: ['#6366f1', '#a855f7', '#06b6d4', '#f59e0b', '#10b981'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12 } } } }
      });
    }

    const sparklineCanvases = document.querySelectorAll('#page-audience .sparkline');
    sparklineCanvases.forEach((canvas) => {
      const card = canvas.closest('.kpi-card');
      const kpiType = card?.dataset.kpi;
      const configs = {
        'audience-total': { min: 100000, max: 150000, color: '#06b6d4' },
        'audience-new': { min: 15000, max: 28000, color: '#6366f1' },
        'audience-returning': { min: 60, max: 70, color: '#10b981' },
        'audience-retention': { min: 75, max: 85, color: '#f59e0b' },
      };
      if (!kpiType || !configs[kpiType]) return;
      const { min, max, color } = configs[kpiType];
      const rect = card.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 50;
      const data = generateSparklineData(20, min, max);
      const dataMin = Math.min(...data);
      const dataMax = Math.max(...data);
      const range = dataMax - dataMin || 1;
      const padding = 4;
      const ctx = canvas.getContext('2d');
      const points = data.map((val, i) => ({ x: padding + (i / (data.length - 1)) * (rect.width - padding * 2), y: 50 - padding - ((val - dataMin) / range) * (50 - padding * 2) }));
      const gradient = ctx.createLinearGradient(0, 0, 0, 50);
      gradient.addColorStop(0, color + '4D');
      gradient.addColorStop(1, color + '00');
      ctx.beginPath();
      ctx.moveTo(points[0].x, 50);
      ctx.lineTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, (points[i].y + points[i + 1].y) / 2);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(points[points.length - 1].x, 50);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, (points[i].y + points[i + 1].y) / 2);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  let reportsInitialized = false;
  function initReportsPage() {
    if (reportsInitialized) return;
    reportsInitialized = true;
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) return;
    const reports = [
      { type: 'revenue', label: 'Revenue', title: 'Monthly Revenue Report', desc: 'Comprehensive breakdown of all revenue streams and trends.', date: 'May 1, 2026' },
      { type: 'users', label: 'Users', title: 'User Growth Analysis', desc: 'New vs returning users, acquisition channels, and retention metrics.', date: 'Apr 28, 2026' },
      { type: 'conversion', label: 'Conversion', title: 'Conversion Funnel Report', desc: 'Step-by-step analysis of user conversion paths and drop-off points.', date: 'Apr 25, 2026' },
      { type: 'performance', label: 'Performance', title: 'Site Performance Report', desc: 'Page load times, server response, and Core Web Vitals analysis.', date: 'Apr 22, 2026' },
      { type: 'revenue', label: 'Revenue', title: 'Quarterly Forecast', desc: 'Revenue projections based on current trends and market analysis.', date: 'Apr 15, 2026' },
      { type: 'users', label: 'Users', title: 'Audience Segmentation', desc: 'Demographic breakdown and behavioral patterns by user segment.', date: 'Apr 10, 2026' },
    ];
    reportsList.innerHTML = reports.map(r => `
      <div class="report-card">
        <span class="report-type ${r.type}">${r.label}</span>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
        <div class="report-meta">
          <span class="report-date">${r.date}</span>
          <button class="report-download">Download</button>
        </div>
      </div>
    `).join('');
  }

  // ===== MODULE 4: TABLE =====
  function sortTransactions(key) {
    if (currentSort.key === key) {
      currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.key = key;
      currentSort.dir = 'asc';
    }

    TRANSACTIONS.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      let comparison = 0;

      switch (key) {
        case 'id':
          comparison = String(valA).localeCompare(String(valB));
          break;
        case 'customer':
          comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
          break;
        case 'date':
          comparison = new Date(valA) - new Date(valB);
          break;
        case 'amount':
          comparison = Number(valA) - Number(valB);
          break;
        case 'status':
          comparison = String(valA).localeCompare(String(valB));
          break;
      }

      return currentSort.dir === 'asc' ? comparison : -comparison;
    });

    currentPage = 1;
    renderTable();
  }

  function renderTable() {
    const total = TRANSACTIONS.length;
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageData = TRANSACTIONS.slice(start, end);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    pageData.forEach(txn => {
      const tr = document.createElement('tr');

      const tdId = document.createElement('td');
      tdId.textContent = txn.id;
      tr.appendChild(tdId);

      const tdCustomer = document.createElement('td');
      tdCustomer.textContent = txn.customer;
      tr.appendChild(tdCustomer);

      const tdDate = document.createElement('td');
      const dateObj = new Date(txn.date);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      tdDate.textContent = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;
      tr.appendChild(tdDate);

      const tdAmount = document.createElement('td');
      tdAmount.textContent = `$${Number(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      tr.appendChild(tdAmount);

      const tdStatus = document.createElement('td');
      const statusSpan = document.createElement('span');
      statusSpan.className = `status-badge ${txn.status}`;
      statusSpan.textContent = txn.status.charAt(0).toUpperCase() + txn.status.slice(1);
      tdStatus.appendChild(statusSpan);
      tr.appendChild(tdStatus);

      const tdSource = document.createElement('td');
      const sourceSpan = document.createElement('span');
      sourceSpan.className = 'source-tag';
      sourceSpan.textContent = txn.source;
      tdSource.appendChild(sourceSpan);
      tr.appendChild(tdSource);

      tableBody.appendChild(tr);
    });

    const tableInfo = document.getElementById('tableInfo');
    tableInfo.textContent = `Showing ${start + 1}-${Math.min(end, total)} of ${total}`;

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(TRANSACTIONS.length / perPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      currentPage--;
      renderTable();
    });
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'page-btn';
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.classList.add('active');
      }
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    nextBtn.addEventListener('click', () => {
      currentPage++;
      renderTable();
    });
    pagination.appendChild(nextBtn);
  }

  function initTable() {
    const headers = document.querySelectorAll('th.sortable');

    headers.forEach(th => {
      th.addEventListener('click', () => {
        const key = th.getAttribute('data-sort');
        sortTransactions(key);

        headers.forEach(header => {
          header.classList.remove('asc', 'desc');
        });
        th.classList.add(currentSort.dir);
      });
    });

    renderTable();
  }

  // ===== MODULE 5: UI LOGIC =====
  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');

    const openSidebar = () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    };

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    };

    menuToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.remove('active'));
        item.classList.add('active');
        const pageName = item.getAttribute('data-page');
        document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
        const targetPage = document.getElementById('page-' + pageName);
        if (targetPage) targetPage.classList.add('active');
        closeSidebar();
        if (pageName === 'dashboard') {
          document.querySelector('.page-header .date-filters')?.closest('.page-header')?.querySelector('.date-filters')?.style && document.querySelector('.page-header')?.querySelector('.date-filters')?.remove();
        }
        if (pageName === 'analytics') initAnalyticsCharts();
        if (pageName === 'audience') initAudiencePage();
        if (pageName === 'reports') initReportsPage();
      });
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const updateChartColors = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
      if (Chart.instances) {
        Object.values(Chart.instances).forEach((chart) => {
          const scales = chart.options.scales;
          if (scales) {
            Object.values(scales).forEach((scale) => {
              if (scale.grid) {
                scale.grid.color = gridColor;
              }
            });
          }
          chart.update();
        });
      }
    };

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nexus-theme', next);
      updateChartColors();
    });
  }

  function initDateFilters() {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const days = parseInt(btn.getAttribute('data-days'), 10);
        currentDays = days;
        updateRevenueChart(days);
      });
    });
  }

  function initCounters() {
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateCounter = (el) => {
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';

      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = el.getAttribute('data-decimal') === 'true';
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = easedProgress * target;

        if (isDecimal) {
          el.textContent = current.toFixed(2);
        } else {
          el.textContent = Math.floor(current).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          if (isDecimal) {
            el.textContent = target.toFixed(2);
          } else {
            el.textContent = target.toLocaleString();
          }
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach((el) => observer.observe(el));
  }

  function initExport() {
    const exportBtn = document.getElementById('exportBtn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
      const headers = 'ID,Customer,Date,Amount,Status,Source';
      const rows = TRANSACTIONS.map((t) => {
        const date = new Date(t.date);
        const formattedDate = date.toISOString().split('T')[0];
        return `${t.id},${t.customer},${formattedDate},${t.amount},${t.status},${t.source}`;
      });

      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transactions.csv';
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#tableBody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  function initDropdowns() {
    const notifBtn = document.getElementById('notifBtn');
    const notifMenu = document.getElementById('notifMenu');
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');

    if (notifBtn && notifMenu) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu?.classList.remove('open');
        notifMenu.classList.toggle('open');
      });
    }

    if (profileBtn && profileMenu) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifMenu?.classList.remove('open');
        profileMenu.classList.toggle('open');
      });
    }

    document.addEventListener('click', () => {
      notifMenu?.classList.remove('open');
      profileMenu?.classList.remove('open');
    });

    document.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.remove('unread');
        const badge = document.querySelector('.notification-badge');
        const unreadCount = document.querySelectorAll('.notif-item.unread').length;
        if (badge) {
          badge.textContent = unreadCount;
          if (unreadCount === 0) badge.style.display = 'none';
        }
      });
    });
  }

  function initSettings() {
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) saveProfileBtn.addEventListener('click', () => {
      saveProfileBtn.textContent = 'Saved!';
      saveProfileBtn.style.background = '#10b981';
      setTimeout(() => { saveProfileBtn.textContent = 'Save Changes'; saveProfileBtn.style.background = ''; }, 2000);
    });
    const savePrefsBtn = document.getElementById('savePrefsBtn');
    if (savePrefsBtn) savePrefsBtn.addEventListener('click', () => {
      savePrefsBtn.textContent = 'Saved!';
      savePrefsBtn.style.background = '#10b981';
      setTimeout(() => { savePrefsBtn.textContent = 'Save Preferences'; savePrefsBtn.style.background = ''; }, 2000);
    });
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) generateReportBtn.addEventListener('click', () => {
      reportsInitialized = false;
      initReportsPage();
    });
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) deleteAccountBtn.addEventListener('click', () => {
      if (confirm('Are you sure? This action cannot be undone.')) {
        alert('Account deletion simulated.');
      }
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    initHeatmap();
    initSparklines();
    initTable();
    initSidebar();
    initTheme();
    initDateFilters();
    initCounters();
    initExport();
    initSearch();
    initDropdowns();
    initSettings();
  });
})();
