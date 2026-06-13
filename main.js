// ================= STATE & CONSTANTS ================= //
let subscriptions = [];
let usdToJpyRate = 150;
let currentFilter = 'all';
let currentSort = 'billing';
let activeView = 'home';
let chartInstance = null;

// Preset major 30 services data (updated with local assets for Suno, Udio, Amazon Prime, U-NEXT, Kindle, Audible, Gemini, Canva)
const PRESET_SERVICES = [
  { name: 'Netflix', logoUrl: 'https://api.iconify.design/logos:netflix-icon.svg', price: 790, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'YouTube Premium', logoUrl: 'https://api.iconify.design/logos:youtube-icon.svg', price: 1280, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Amazon Prime', logoUrl: './assets/amazon_prime_icon.png', price: 600, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'Spotify', logoUrl: 'https://api.iconify.design/logos:spotify-icon.svg', price: 980, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Apple Music', logoUrl: 'https://api.iconify.design/logos:apple.svg', price: 1080, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Disney+', logoUrl: './assets/disneyplus_icon.png', price: 990, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'U-NEXT', logoUrl: './assets/unext_icon.png', price: 2189, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Hulu', logoUrl: './assets/hulu_icon.png', price: 1026, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Apple TV+', logoUrl: 'https://api.iconify.design/logos:apple.svg', price: 900, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'ChatGPT Plus', logoUrl: 'https://api.iconify.design/logos:openai-icon.svg', price: 20.00, currency: 'USD', category: 'ai', cycle: 'monthly' },
  { name: 'Google Gemini', logoUrl: './assets/gemini_icon.png', price: 2900, currency: 'JPY', category: 'ai', cycle: 'monthly' },
  { name: 'Claude Pro', logoUrl: './assets/claude_icon.png', price: 20.00, currency: 'USD', category: 'ai', cycle: 'monthly' },
  { name: 'NotebookLM', logoUrl: './assets/notebooklm_yellow_icon.png', price: 0, currency: 'JPY', category: 'ai', cycle: 'monthly' },
  { name: 'Notion Plus', logoUrl: 'https://api.iconify.design/logos:notion-icon.svg', price: 10.00, currency: 'USD', category: 'ai', cycle: 'monthly' },
  { name: 'Microsoft 365', logoUrl: 'https://api.iconify.design/logos:microsoft-icon.svg', price: 1410, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'Adobe CC', logoUrl: 'https://api.iconify.design/logos:adobe.svg', price: 7780, currency: 'JPY', category: 'design', cycle: 'monthly' },
  { name: 'Canva Pro', logoUrl: './assets/canva_icon.png', price: 1180, currency: 'JPY', category: 'design', cycle: 'monthly' },
  { name: 'Midjourney', logoUrl: 'https://api.iconify.design/openmoji:sailboat.svg', price: 10.00, currency: 'USD', category: 'design', cycle: 'monthly' },
  { name: 'GitHub Copilot', logoUrl: 'https://api.iconify.design/logos:github-icon.svg', price: 10.00, currency: 'USD', category: 'ai', cycle: 'monthly' },
  { name: 'Kindle Unlimited', logoUrl: './assets/kindle_icon.png', price: 980, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Audible', logoUrl: './assets/audible_icon.png', price: 1500, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Nintendo Switch', logoUrl: './assets/nintendo_switch_icon.png', price: 306, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'PlayStation Plus', logoUrl: './assets/playstation_icon.png', price: 850, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Xbox Game Pass', logoUrl: './assets/xbox_icon.png', price: 1210, currency: 'JPY', category: 'entertainment', cycle: 'monthly' },
  { name: 'Google One', logoUrl: 'https://api.iconify.design/logos:google-icon.svg', price: 250, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'iCloud+', logoUrl: 'https://api.iconify.design/logos:apple.svg', price: 130, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'Dropbox Plus', logoUrl: 'https://api.iconify.design/logos:dropbox.svg', price: 1500, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'Evernote', logoUrl: './assets/evernote_icon.png', price: 1100, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'Slack Pro', logoUrl: 'https://api.iconify.design/logos:slack-icon.svg', price: 1050, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'Zoom Pro', logoUrl: 'https://api.iconify.design/logos:zoom-icon.svg', price: 2120, currency: 'JPY', category: 'utility', cycle: 'monthly' },
  { name: 'SunoAI', logoUrl: './assets/suno_ai_icon.png', price: 10.00, currency: 'USD', category: 'entertainment', cycle: 'monthly' },
  { name: 'Udio', logoUrl: './assets/udio_icon.png', price: 10.00, currency: 'USD', category: 'entertainment', cycle: 'monthly' }
];

// Category mapping for readable text
const CATEGORY_NAMES = {
  ai: 'AI / 生産性',
  design: 'デザイン / クリエイティブ',
  entertainment: 'エンタメ / 動画配信',
  utility: 'ユーティリティ / クラウド',
  other: 'その他'
};

// Category colors for chart and display
const CATEGORY_COLORS = {
  ai: '#3B82F6',          // Blue
  design: '#A855F7',      // Purple
  entertainment: '#EF4444', // Red
  utility: '#10B981',     // Emerald
  other: '#F59E0B'        // Amber
};

// Date utilities
const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDateString = (date) => {
  return date.toISOString().split('T')[0];
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDateString(result);
};

// Initialize Mock Data relative to today so that it matches screenshot perfectly
const initializeDefaultData = () => {
  const today = getTodayDate();
  
  subscriptions = [
    {
      id: 'sub-chatgpt',
      name: 'ChatGPT Plus',
      logoType: 'chatgpt',
      logoUrl: PRESET_SERVICES.find(p => p.name === 'ChatGPT Plus').logoUrl,
      price: 20.00,
      currency: 'USD',
      cycle: 'monthly',
      category: 'ai',
      nextBillingDate: addDays(today, 14),
      isPinned: false
    },
    {
      id: 'sub-gemini',
      name: 'Google Gemini',
      logoType: 'gemini',
      logoUrl: PRESET_SERVICES.find(p => p.name === 'Google Gemini').logoUrl,
      price: 2900,
      currency: 'JPY',
      cycle: 'monthly',
      category: 'ai',
      nextBillingDate: addDays(today, 14),
      isPinned: false
    },
    {
      id: 'sub-claude',
      name: 'Claude Pro',
      logoType: 'claude',
      logoUrl: PRESET_SERVICES.find(p => p.name === 'Claude Pro').logoUrl,
      price: 20.00,
      currency: 'USD',
      cycle: 'monthly',
      category: 'ai',
      nextBillingDate: addDays(today, 14),
      isPinned: false
    },
    {
      id: 'sub-midjourney',
      name: 'Midjourney',
      logoType: 'midjourney',
      logoUrl: PRESET_SERVICES.find(p => p.name === 'Midjourney').logoUrl,
      price: 10.00,
      currency: 'USD',
      cycle: 'monthly',
      category: 'design',
      nextBillingDate: addDays(today, 14),
      isPinned: false
    },
    {
      id: 'sub-canva',
      name: 'Canva Pro',
      logoType: 'canva',
      logoUrl: PRESET_SERVICES.find(p => p.name === 'Canva Pro').logoUrl,
      price: 1180,
      currency: 'JPY',
      cycle: 'monthly',
      category: 'design',
      nextBillingDate: addDays(today, 15),
      isPinned: false
    },
    {
      id: 'sub-suno',
      name: 'SunoAI',
      logoType: 'suno',
      logoUrl: PRESET_SERVICES.find(p => p.name === 'SunoAI').logoUrl,
      price: 10.00,
      currency: 'USD',
      cycle: 'monthly',
      category: 'entertainment',
      nextBillingDate: addDays(today, 15),
      isPinned: false
    }
  ];
  
  saveState();
};

// Load State from LocalStorage
const loadState = () => {
  const savedSubs = localStorage.getItem('subscriptionBox_subs');
  const savedRate = localStorage.getItem('subscriptionBox_rate');
  
  if (savedSubs) {
    subscriptions = JSON.parse(savedSubs);
    
    // Auto-migration: Update old logo URLs to local assets
    let stateChanged = false;
    subscriptions = subscriptions.map(sub => {
      const migrationMap = {
        'https://api.iconify.design/logos:disneyplus.svg': './assets/disneyplus_icon.png',
        'https://api.iconify.design/logos:hulu.svg': './assets/hulu_icon.png',
        'https://api.iconify.design/logos:nintendo-switch.svg': './assets/nintendo_switch_icon.png',
        'https://api.iconify.design/logos:playstation.svg': './assets/playstation_icon.png',
        'https://api.iconify.design/logos:xbox.svg': './assets/xbox_icon.png',
        'https://api.iconify.design/logos:evernote-icon.svg': './assets/evernote_icon.png',
        './assets/notebooklm_icon.png': './assets/notebooklm_yellow_icon.png'
      };
      
      if (migrationMap[sub.logoUrl]) {
        sub.logoUrl = migrationMap[sub.logoUrl];
        stateChanged = true;
      }
      return sub;
    });
    if (stateChanged) saveState();

    // Auto-migration: Ensure Claude Pro is added if it's missing from saved subscriptions
    const migrated = localStorage.getItem('subscriptionBox_migrated_claude');
    if (!migrated && !subscriptions.some(s => s.name === 'Claude Pro')) {
      const today = getTodayDate();
      subscriptions.push({
        id: 'sub-claude',
        name: 'Claude Pro',
        logoType: 'claude',
        logoUrl: PRESET_SERVICES.find(p => p.name === 'Claude Pro').logoUrl,
        price: 20.00,
        currency: 'USD',
        cycle: 'monthly',
        category: 'ai',
        nextBillingDate: addDays(today, 14),
        isPinned: false
      });
      localStorage.setItem('subscriptionBox_migrated_claude', 'true');
      saveState();
    } else if (!migrated) {
      localStorage.setItem('subscriptionBox_migrated_claude', 'true');
    }
  } else {
    initializeDefaultData();
    localStorage.setItem('subscriptionBox_migrated_claude', 'true');
  }

  if (savedRate) {
    usdToJpyRate = parseFloat(savedRate);
    document.getElementById('usd-rate-input').value = usdToJpyRate;
  }
};

// Save State to LocalStorage
const saveState = () => {
  localStorage.setItem('subscriptionBox_subs', JSON.stringify(subscriptions));
  localStorage.setItem('subscriptionBox_rate', usdToJpyRate.toString());
};

// ================= CALCULATION LOGIC ================= //

const convertToJpy = (price, currency) => {
  if (currency === 'JPY') return price;
  if (currency === 'USD') return price * usdToJpyRate;
  return price;
};

const getMonthlyCostJpy = (sub) => {
  const priceJpy = convertToJpy(sub.price, sub.currency);
  if (sub.cycle === 'monthly') {
    return priceJpy;
  } else if (sub.cycle === 'annual') {
    return priceJpy / 12;
  }
  return priceJpy;
};

const calculateStats = () => {
  let monthlyTotal = 0;
  let annualTotal = 0;
  let monthlyCount = 0;
  let annualCount = 0;

  subscriptions.forEach(sub => {
    const monthlyCost = getMonthlyCostJpy(sub);
    monthlyTotal += monthlyCost;
    annualTotal += monthlyCost * 12;

    if (sub.cycle === 'monthly') monthlyCount++;
    if (sub.cycle === 'annual') annualCount++;
  });

  return {
    monthlyTotal: Math.round(monthlyTotal),
    annualTotal: Math.round(annualTotal),
    count: subscriptions.length,
    monthlyCount,
    annualCount
  };
};

const getRemainingDays = (nextBillingDateStr) => {
  const today = getTodayDate();
  const nextBilling = new Date(nextBillingDateStr);
  nextBilling.setHours(0, 0, 0, 0);
  
  const diffTime = nextBilling.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatCurrency = (price, currency) => {
  if (currency === 'JPY') {
    return `¥${Math.round(price).toLocaleString()}`;
  } else if (currency === 'USD') {
    return `$${parseFloat(price).toFixed(2)}`;
  }
  return `${price}`;
};

// ================= DOM RENDERING: HOME VIEW ================= //

const renderDashboard = () => {
  const stats = calculateStats();
  document.getElementById('stat-monthly-total').innerText = `¥${stats.monthlyTotal.toLocaleString()}`;
  document.getElementById('stat-annual-total').innerText = `¥${stats.annualTotal.toLocaleString()}`;
  document.getElementById('stat-count').innerText = `${stats.count}件`;
  
  document.getElementById('badge-all').innerText = stats.count;
  document.getElementById('badge-monthly').innerText = stats.monthlyCount;
  document.getElementById('badge-annual').innerText = stats.annualCount;
};

const renderSubscriptionList = () => {
  const container = document.getElementById('subscription-list-container');
  container.innerHTML = '';

  if (subscriptions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox"></i>
        <p>サブスクリプションが登録されていません。<br>右下の「＋」ボタンから登録してください。</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let filtered = subscriptions.filter(sub => {
    if (currentFilter === 'all') return true;
    return sub.cycle === currentFilter;
  });

  filtered.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (currentSort === 'billing') {
      return new Date(a.nextBillingDate) - new Date(b.nextBillingDate);
    } else if (currentSort === 'high-price') {
      return getMonthlyCostJpy(b) - getMonthlyCostJpy(a);
    } else if (currentSort === 'low-price') {
      return getMonthlyCostJpy(a) - getMonthlyCostJpy(b);
    } else if (currentSort === 'name') {
      return a.name.localeCompare(b.name, 'ja');
    } else if (currentSort === 'pinned') {
      return new Date(a.nextBillingDate) - new Date(b.nextBillingDate);
    }
    return 0;
  });

  filtered.forEach(sub => {
    const remainingDays = getRemainingDays(sub.nextBillingDate);
    const cycleMaxDays = sub.cycle === 'monthly' ? 30 : 365;
    const progressPercent = Math.max(0, Math.min(100, (remainingDays / cycleMaxDays) * 100));

    const card = document.createElement('div');
    card.className = `sub-card ${sub.isPinned ? 'sub-card-pinned' : ''}`;
    card.dataset.id = sub.id;

    card.innerHTML = `
      ${sub.isPinned ? '<div class="pin-indicator"><i data-lucide="pin"></i></div>' : ''}
      <div class="sub-card-row">
        <div class="sub-card-left">
          <div class="sub-logo">
            <img src="${sub.logoUrl || 'https://api.iconify.design/lucide:box.svg'}" alt="${sub.name}" onerror="this.src='https://api.iconify.design/lucide:box.svg'">
          </div>
          <div class="sub-info">
            <span class="sub-name">${sub.name}</span>
            <span class="sub-tag">${CATEGORY_NAMES[sub.category] || 'その他'}</span>
          </div>
        </div>
        <div class="sub-card-right">
          <span class="sub-price">${formatCurrency(sub.price, sub.currency)}</span>
          <span class="sub-cycle-text">/ ${sub.cycle === 'monthly' ? '月' : '年'}</span>
          <i data-lucide="chevron-right" class="chevron-icon"></i>
        </div>
      </div>
      <div class="sub-progress-container">
        <div class="progress-track">
          <div class="progress-bar" style="width: ${progressPercent}%; background-color: ${remainingDays <= 3 ? 'var(--danger)' : 'var(--primary)'}"></div>
        </div>
        <span class="days-remaining">
          ${remainingDays <= 0 ? '今日更新日' : `あと ${remainingDays} 日`}
        </span>
      </div>
    `;

    card.addEventListener('click', () => showDetailModal(sub.id));
    container.appendChild(card);
  });

  lucide.createIcons();
};

// ================= DOM RENDERING: CALENDAR VIEW ================= //
let calSelectedDate = getTodayDate();
let calCurrentYear = calSelectedDate.getFullYear();
let calCurrentMonth = calSelectedDate.getMonth();

const renderCalendar = () => {
  const monthYearLabel = document.getElementById('calendar-month-year');
  const daysGrid = document.getElementById('calendar-days-grid');
  
  monthYearLabel.innerText = `${calCurrentYear}年 ${calCurrentMonth + 1}月`;
  daysGrid.innerHTML = '';

  const firstDayIndex = new Date(calCurrentYear, calCurrentMonth, 1).getDay();
  const totalDays = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();
  const prevTotalDays = new Date(calCurrentYear, calCurrentMonth, 0).getDate();

  for (let i = firstDayIndex; i > 0; i--) {
    const dayNum = prevTotalDays - i + 1;
    const dayDiv = document.createElement('div');
    dayDiv.className = 'cal-day other-month';
    dayDiv.innerText = dayNum;
    daysGrid.appendChild(dayDiv);
  }

  const today = getTodayDate();
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'cal-day';
    dayDiv.innerText = day;

    const currentFullDateStr = formatDateString(new Date(calCurrentYear, calCurrentMonth, day));
    
    const isSelected = formatDateString(calSelectedDate) === currentFullDateStr;
    if (isSelected) dayDiv.classList.add('selected');

    const isToday = formatDateString(today) === currentFullDateStr;
    if (isToday) dayDiv.classList.add('today');

    const hasBilling = subscriptions.some(sub => {
      const billDate = new Date(sub.nextBillingDate);
      return billDate.getDate() === day && billDate.getMonth() === calCurrentMonth && billDate.getFullYear() === calCurrentYear;
    });

    if (hasBilling) {
      const dot = document.createElement('div');
      dot.className = 'dot-indicator';
      dayDiv.appendChild(dot);
    }

    dayDiv.addEventListener('click', () => {
      calSelectedDate = new Date(calCurrentYear, calCurrentMonth, day);
      renderCalendar();
      renderCalendarSelectedDayList();
    });

    daysGrid.appendChild(dayDiv);
  }

  const totalGridSlots = 42;
  const currentSlotsFilled = firstDayIndex + totalDays;
  const remainingSlots = totalGridSlots - currentSlotsFilled;
  
  for (let i = 1; i <= (remainingSlots % 7 === remainingSlots ? remainingSlots : remainingSlots % 7); i++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'cal-day other-month';
    dayDiv.innerText = i;
    daysGrid.appendChild(dayDiv);
  }

  renderCalendarSelectedDayList();
};

const renderCalendarSelectedDayList = () => {
  const container = document.getElementById('calendar-day-list');
  const label = document.getElementById('selected-date-label');
  container.innerHTML = '';

  const dateStr = calSelectedDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });
  label.innerText = `${dateStr} の支払い予定`;

  const targetDateStr = formatDateString(calSelectedDate);
  const daySubs = subscriptions.filter(sub => sub.nextBillingDate === targetDateStr);

  if (daySubs.length === 0) {
    container.innerHTML = `
      <div class="empty-state-mini">
        <p>この日の支払い予定はありません。</p>
      </div>
    `;
    return;
  }

  daySubs.forEach(sub => {
    const item = document.createElement('div');
    item.className = 'sub-card';
    item.innerHTML = `
      <div class="sub-card-row">
        <div class="sub-card-left">
          <div class="sub-logo">
            <img src="${sub.logoUrl || 'https://api.iconify.design/lucide:box.svg'}" alt="${sub.name}" onerror="this.src='https://api.iconify.design/lucide:box.svg'">
          </div>
          <div class="sub-info">
            <span class="sub-name">${sub.name}</span>
            <span class="sub-tag">${CATEGORY_NAMES[sub.category]}</span>
          </div>
        </div>
        <div class="sub-card-right">
          <span class="sub-price">${formatCurrency(sub.price, sub.currency)}</span>
          <span class="sub-cycle-text">/ ${sub.cycle === 'monthly' ? '月' : '年'}</span>
        </div>
      </div>
    `;
    item.addEventListener('click', () => showDetailModal(sub.id));
    container.appendChild(item);
  });
};

// ================= DOM RENDERING: ANALYSIS VIEW ================= //

const renderAnalysis = () => {
  const container = document.getElementById('category-breakdown-container');
  container.innerHTML = '';

  const categoryTotals = { ai: 0, design: 0, entertainment: 0, utility: 0, other: 0 };
  let grandTotal = 0;

  subscriptions.forEach(sub => {
    const monthlyCost = getMonthlyCostJpy(sub);
    categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyCost;
    grandTotal += monthlyCost;
  });

  const chartData = [];
  const chartLabels = [];
  const chartColors = [];

  Object.keys(categoryTotals).forEach(cat => {
    const total = categoryTotals[cat];
    const percentage = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
    
    if (total > 0) {
      chartData.push(Math.round(total));
      chartLabels.push(CATEGORY_NAMES[cat]);
      chartColors.push(CATEGORY_COLORS[cat]);
    }

    const catItem = document.createElement('div');
    catItem.className = 'category-item';
    catItem.innerHTML = `
      <div class="category-left">
        <div class="category-color-dot" style="background-color: ${CATEGORY_COLORS[cat]}"></div>
        <span class="category-name">${CATEGORY_NAMES[cat]}</span>
      </div>
      <div class="category-right">
        <span class="category-total-price">¥${Math.round(total).toLocaleString()} / 月</span>
        <span class="category-percentage">${percentage}%</span>
      </div>
    `;
    container.appendChild(catItem);
  });

  const ctx = document.getElementById('categoryChart').getContext('2d');
  
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (chartData.length === 0) {
    chartData.push(1);
    chartLabels.push('データなし');
    chartColors.push('#E5E7EB');
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: chartColors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.label === 'データなし') return '登録なし';
              return ` ${context.label}: ¥${context.raw.toLocaleString()} / 月`;
            }
          }
        }
      },
      cutout: '75%'
    }
  });
};

// ================= DOM RENDERING: DIAGNOSTICS VIEW ================= //

const renderDiagnostics = () => {
  const container = document.getElementById('diagnostics-advice-container');
  const scoreVal = document.getElementById('diagnostics-score-val');
  const summaryDesc = document.getElementById('diagnostics-summary-desc');
  container.innerHTML = '';

  let score = 100;
  const advices = [];

  const categoryCounts = {};
  subscriptions.forEach(sub => {
    categoryCounts[sub.category] = (categoryCounts[sub.category] || 0) + 1;
  });

  Object.keys(categoryCounts).forEach(cat => {
    if (categoryCounts[cat] > 2) {
      score -= 15;
      advices.push({
        type: 'warning',
        title: `${CATEGORY_NAMES[cat]} サービスの整理`,
        desc: `${CATEGORY_NAMES[cat]}カテゴリーに ${categoryCounts[cat]}件登録されています。利用目的が重複していないか確認してみましょう。`
      });
    }
  });

  subscriptions.forEach(sub => {
    const mCost = getMonthlyCostJpy(sub);
    if (mCost >= 5000) {
      score -= 10;
      advices.push({
        type: 'warning',
        title: `高額サブスク: ${sub.name}`,
        desc: `毎月 ¥${Math.round(mCost).toLocaleString()} を支払っています。本当に利用価値見合っているか、定期的な見直しをお勧めします。`
      });
    }
  });

  subscriptions.forEach(sub => {
    if (sub.cycle === 'monthly') {
      const annualSavingsEst = getMonthlyCostJpy(sub) * 12 * 0.2;
      advices.push({
        type: 'tip',
        title: `${sub.name}の年額移行`,
        desc: `年額プランへ移行すると、年間で約 ¥${Math.round(annualSavingsEst).toLocaleString()} の節約になる可能性があります。`
      });
    }
  });

  score = Math.max(10, score);
  scoreVal.innerText = score;
  
  if (score === 100) {
    summaryDesc.innerText = '素晴らしい！無駄な重複や高額すぎるサブスクは見つかりませんでした。家計は非常に健全です。';
    document.querySelector('.diagnostics-score').style.borderColor = 'var(--accent)';
  } else if (score >= 70) {
    summaryDesc.innerText = '良好です。いくつかの節約の余地やアドバイスがあります。少し見直すだけでスマートになります。';
    document.querySelector('.diagnostics-score').style.borderColor = 'var(--warning)';
  } else {
    summaryDesc.innerText = '警告があります。複数の重複サービスや高額請求があり、コスト削減の大きなチャンスです！';
    document.querySelector('.diagnostics-score').style.borderColor = 'var(--danger)';
  }

  if (advices.length === 0) {
    container.innerHTML = `
      <div class="empty-state-mini">
        <p>現在アドバイスはありません。</p>
      </div>
    `;
    return;
  }

  advices.forEach(adv => {
    const card = document.createElement('div');
    card.className = `advice-card ${adv.type === 'warning' ? 'warning-advice' : 'tip-advice'}`;
    card.innerHTML = `
      <div class="advice-icon-wrapper">
        <i data-lucide="${adv.type === 'warning' ? 'alert-triangle' : 'sparkles'}"></i>
      </div>
      <div class="advice-content">
        <h4 class="advice-title">${adv.title}</h4>
        <p class="advice-desc">${adv.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
};

// ================= TAB NAVIGATION LOGIC ================= //

const setupNavigation = () => {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewName = item.dataset.view;
      
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const views = document.querySelectorAll('.app-view');
      views.forEach(v => v.classList.remove('active'));
      document.getElementById(`view-${viewName}`).classList.add('active');
      
      activeView = viewName;

      if (viewName === 'home') {
        renderDashboard();
        renderSubscriptionList();
      } else if (viewName === 'calendar') {
        renderCalendar();
      } else if (viewName === 'analysis') {
        renderAnalysis();
      } else if (viewName === 'diagnostics') {
        renderDiagnostics();
      }
    });
  });

  document.getElementById('dashboard-card-btn').addEventListener('click', () => {
    const diagTab = document.querySelector('.bottom-nav .nav-item[data-view="diagnostics"]');
    if (diagTab) diagTab.click();
  });
};

// ================= MODALS & DIALOGS ================= //

// --- Render 30 Major Subscriptions Grid ---
const renderQuickPresets = () => {
  const container = document.getElementById('quick-presets-grid');
  if (!container) return;
  container.innerHTML = '';

  PRESET_SERVICES.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.innerHTML = `
      <img src="${preset.logoUrl}" alt="${preset.name}" onerror="this.src='https://api.iconify.design/lucide:box.svg'">
      <span>${preset.name}</span>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.preset-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Autofill fields
      document.getElementById('sub-name').value = preset.name;
      document.getElementById('sub-price').value = preset.price;
      document.getElementById('sub-currency').value = preset.currency;
      document.getElementById('sub-cycle').value = preset.cycle;
      document.getElementById('sub-category').value = preset.category;
      document.getElementById('sub-logo-url').value = preset.logoUrl;
    });

    container.appendChild(item);
  });
};

// --- Subscription Add/Edit Modal ---
const subModal = document.getElementById('subscription-modal');
const subForm = document.getElementById('subscription-form');

const openSubModal = (subId = null) => {
  subForm.reset();
  
  renderQuickPresets();

  if (subId) {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;

    document.getElementById('modal-title').innerText = 'サブスクを編集';
    document.getElementById('sub-id').value = sub.id;
    document.getElementById('sub-name').value = sub.name;
    document.getElementById('sub-price').value = sub.price;
    document.getElementById('sub-currency').value = sub.currency;
    document.getElementById('sub-cycle').value = sub.cycle;
    document.getElementById('sub-category').value = sub.category;
    document.getElementById('sub-billing-date').value = sub.nextBillingDate;
    document.getElementById('sub-logo-url').value = sub.logoUrl;

    const presetItems = document.querySelectorAll('.preset-item');
    presetItems.forEach(item => {
      const span = item.querySelector('span');
      if (span && span.innerText.toLowerCase() === sub.name.toLowerCase()) {
        item.classList.add('active');
      }
    });
  } else {
    document.getElementById('modal-title').innerText = '新規サブスク登録';
    document.getElementById('sub-id').value = '';
    document.getElementById('sub-billing-date').value = addDays(getTodayDate(), 1);
  }

  subModal.classList.add('active');
};

const closeSubModal = () => {
  subModal.classList.remove('active');
};

// --- Modal Submit ---
subForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const subId = document.getElementById('sub-id').value;
  const name = document.getElementById('sub-name').value.trim();
  const price = parseFloat(document.getElementById('sub-price').value);
  const currency = document.getElementById('sub-currency').value;
  const cycle = document.getElementById('sub-cycle').value;
  const category = document.getElementById('sub-category').value;
  const billingDate = document.getElementById('sub-billing-date').value;
  
  let logoUrl = document.getElementById('sub-logo-url').value.trim();
  let logoType = 'custom';
  
  if (!logoUrl) {
    const matchedPreset = PRESET_SERVICES.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (matchedPreset) {
      logoUrl = matchedPreset.logoUrl;
      logoType = name.toLowerCase();
    } else {
      logoUrl = 'https://api.iconify.design/lucide:box.svg';
      logoType = 'custom';
    }
  } else {
    const matchedPreset = PRESET_SERVICES.find(p => p.logoUrl === logoUrl);
    logoType = matchedPreset ? matchedPreset.name.toLowerCase() : 'custom';
  }

  if (subId) {
    const idx = subscriptions.findIndex(s => s.id === subId);
    if (idx !== -1) {
      subscriptions[idx] = {
        ...subscriptions[idx],
        name, price, currency, cycle, category,
        nextBillingDate: billingDate,
        logoType, logoUrl
      };
    }
  } else {
    const newSub = {
      id: 'sub-' + Date.now(),
      name, price, currency, cycle, category,
      nextBillingDate: billingDate,
      logoType, logoUrl,
      isPinned: false
    };
    subscriptions.push(newSub);
  }

  saveState();
  closeSubModal();
  
  renderDashboard();
  renderSubscriptionList();
  if (activeView === 'calendar') renderCalendar();
  if (activeView === 'analysis') renderAnalysis();
  if (activeView === 'diagnostics') renderDiagnostics();
});

// --- Detail Modal ---
const detailModal = document.getElementById('detail-modal');
let selectedDetailId = null;

const showDetailModal = (subId) => {
  const sub = subscriptions.find(s => s.id === subId);
  if (!sub) return;

  selectedDetailId = subId;

  document.getElementById('detail-logo').src = sub.logoUrl || 'https://api.iconify.design/lucide:box.svg';
  document.getElementById('detail-name-large').innerText = sub.name;
  document.getElementById('detail-price-large').innerText = `${formatCurrency(sub.price, sub.currency)} / ${sub.cycle === 'monthly' ? '月' : '年'}`;
  
  const nextBillDateStr = new Date(sub.nextBillingDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('detail-billing-date').innerText = nextBillDateStr;

  const remaining = getRemainingDays(sub.nextBillingDate);
  document.getElementById('detail-remaining-days').innerText = remaining <= 0 ? '今日が更新日です' : `あと ${remaining} 日`;

  const convertedPrice = convertToJpy(sub.price, sub.currency);
  const cycleText = sub.cycle === 'monthly' ? '月' : '年';
  if (sub.currency === 'USD') {
    document.getElementById('detail-converted-price').innerText = `¥${Math.round(convertedPrice).toLocaleString()} / ${cycleText} (換算レート 1$ = ${usdToJpyRate}円)`;
  } else {
    document.getElementById('detail-converted-price').innerText = `換算不要 (日本円表記)`;
  }

  document.getElementById('detail-category').innerText = CATEGORY_NAMES[sub.category] || 'その他';

  const pinBtn = document.getElementById('detail-pin-btn');
  if (sub.isPinned) {
    pinBtn.innerHTML = '<i data-lucide="pin-off"></i> ピン留めを解除';
  } else {
    pinBtn.innerHTML = '<i data-lucide="pin"></i> ピン留めする';
  }
  lucide.createIcons();

  detailModal.classList.add('active');
};

const closeDetailModal = () => {
  detailModal.classList.remove('active');
};

// --- Modal Action Hooks ---
document.getElementById('add-subscription-btn').addEventListener('click', () => openSubModal());
document.getElementById('modal-close-btn').addEventListener('click', closeSubModal);
document.getElementById('modal-cancel-btn').addEventListener('click', closeSubModal);
document.getElementById('detail-close-btn').addEventListener('click', closeDetailModal);

// Automatically populate logo URL as user types service name
document.getElementById('sub-name').addEventListener('input', (e) => {
  const name = e.target.value.trim();
  const logoInput = document.getElementById('sub-logo-url');
  
  const currentLogo = logoInput.value.trim();
  const isPresetLogo = PRESET_SERVICES.some(p => p.logoUrl === currentLogo);
  const isDefaultLogo = currentLogo === 'https://api.iconify.design/lucide:box.svg' || currentLogo === '';
  const isAutoGenerated = currentLogo.startsWith('https://logo.clearbit.com/');
  
  // Only auto-fill if the input is empty, a preset logo, or previously auto-generated
  if (isPresetLogo || isDefaultLogo || isAutoGenerated) {
    if (!name) {
      logoInput.value = '';
      return;
    }
    
    // Try to match with presets
    const matchedPreset = PRESET_SERVICES.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (matchedPreset) {
      logoInput.value = matchedPreset.logoUrl;
      // Autofill other fields if they are currently empty
      const priceInput = document.getElementById('sub-price');
      if (!priceInput.value) {
        priceInput.value = matchedPreset.price;
        document.getElementById('sub-currency').value = matchedPreset.currency;
        document.getElementById('sub-cycle').value = matchedPreset.cycle;
        document.getElementById('sub-category').value = matchedPreset.category;
      }
    } else {
      // Guess logo domain from service name
      const domainSafe = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      logoInput.value = `https://logo.clearbit.com/${domainSafe}`;
    }
  }
});

document.getElementById('detail-pin-btn').addEventListener('click', () => {
  if (!selectedDetailId) return;
  const sub = subscriptions.find(s => s.id === selectedDetailId);
  if (sub) {
    sub.isPinned = !sub.isPinned;
    saveState();
    closeDetailModal();
    renderSubscriptionList();
  }
});

document.getElementById('detail-edit-btn').addEventListener('click', () => {
  if (!selectedDetailId) return;
  closeDetailModal();
  openSubModal(selectedDetailId);
});

document.getElementById('detail-delete-btn').addEventListener('click', () => {
  if (!selectedDetailId) return;
  const sub = subscriptions.find(s => s.id === selectedDetailId);
  if (sub && confirm(`${sub.name} を削除してもよろしいですか？`)) {
    subscriptions = subscriptions.filter(s => s.id !== selectedDetailId);
    saveState();
    closeDetailModal();
    renderDashboard();
    renderSubscriptionList();
  }
});

// ================= SETTINGS EVENT HANDLERS ================= //

document.getElementById('usd-rate-input').addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  if (val && val > 0) {
    usdToJpyRate = val;
    saveState();
    renderDashboard();
    if (activeView === 'home') renderSubscriptionList();
  }
});

document.getElementById('export-data-btn').addEventListener('click', () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
    subscriptions,
    usdToJpyRate
  }));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "subscription_box_data.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

document.getElementById('import-data-btn').addEventListener('click', () => {
  document.getElementById('import-file-input').click();
});

document.getElementById('import-file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (imported.subscriptions && Array.isArray(imported.subscriptions)) {
        subscriptions = imported.subscriptions;
        usdToJpyRate = imported.usdToJpyRate || 150;
        document.getElementById('usd-rate-input').value = usdToJpyRate;
        saveState();
        alert('データを正常にインポートしました。');
        
        renderDashboard();
        renderSubscriptionList();
      } else {
        alert('無効なデータ形式です。');
      }
    } catch (err) {
      alert('ファイルの読み込みに失敗しました。');
    }
  };
  reader.readAsText(file);
});

document.getElementById('reset-data-btn').addEventListener('click', () => {
  if (confirm('すべてのサブスクデータを初期化し、デフォルトデータに戻します。よろしいですか？')) {
    localStorage.removeItem('subscriptionBox_subs');
    localStorage.removeItem('subscriptionBox_rate');
    loadState();
    renderDashboard();
    renderSubscriptionList();
    alert('初期化が完了しました。');
  }
});

// ================= FILTER & SORT BUTTON TRIGGERS ================= //

const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderSubscriptionList();
  });
});

const sortTags = document.querySelectorAll('.sort-tag');
sortTags.forEach(tag => {
  tag.addEventListener('click', () => {
    sortTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    currentSort = tag.dataset.sort;
    renderSubscriptionList();
  });
});

// ================= CALENDAR MONTH NAVIGATORS ================= //
document.getElementById('prev-month').addEventListener('click', () => {
  calCurrentMonth--;
  if (calCurrentMonth < 0) {
    calCurrentMonth = 11;
    calCurrentYear--;
  }
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  calCurrentMonth++;
  if (calCurrentMonth > 11) {
    calCurrentMonth = 0;
    calCurrentYear++;
  }
  renderCalendar();
});

// Setup horizontal drag-to-scroll for sort tags
const setupDragScroll = () => {
  const slider = document.querySelector('.sort-tags-container');
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let dragThreshold = 5; // Pixels
  let moved = false;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    moved = false;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('dragging');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('dragging');
    
    // If we moved the mouse more than the threshold, prevent click event from triggering on child buttons
    if (moved) {
      const captureClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        slider.removeEventListener('click', captureClick, true);
      };
      slider.addEventListener('click', captureClick, true);
    }
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    if (Math.abs(walk) > dragThreshold) {
      moved = true;
    }
    slider.scrollLeft = scrollLeft - walk;
  });
};

// ================= APP INITIALIZATION ================= //
const fetchExchangeRate = async () => {
  const statusEl = document.getElementById('usd-rate-status');
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data && data.rates && data.rates.JPY) {
      usdToJpyRate = Math.round(data.rates.JPY * 100) / 100;
      saveState();
      
      const rateInput = document.getElementById('usd-rate-input');
      if (rateInput) rateInput.value = usdToJpyRate;
      
      if (statusEl) {
        statusEl.innerHTML = `<i data-lucide="check" style="width: 10px; height: 10px; color: var(--accent);"></i> リアルタイム為替レートを自動取得しました (${new Date().toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})})`;
        statusEl.style.color = 'var(--accent)';
      }
      
      renderDashboard();
      if (activeView === 'home') renderSubscriptionList();
      if (activeView === 'analysis') renderAnalysis();
      lucide.createIcons();
    }
  } catch (err) {
    console.warn('リアルタイム為替レートの取得に失敗しました。ローカル保存のレートを使用します。', err);
    if (statusEl) {
      statusEl.innerHTML = `<i data-lucide="alert-circle" style="width: 10px; height: 10px; color: var(--warning);"></i> レート取得に失敗しました。ローカル保存のレートを使用しています。`;
      statusEl.style.color = 'var(--warning)';
    }
    lucide.createIcons();
  }
};

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupNavigation();
  renderDashboard();
  renderSubscriptionList();
  setupDragScroll();
  fetchExchangeRate();
  lucide.createIcons();
});
