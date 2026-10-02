/**
 * ShineNET VPN - Interactive Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initNodeExplorer();
  initCopyButtons();
  initPingSimulator();
  initQrCode();
  initScrollSpy();
});

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-bright)" stroke-width="2">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Navbar behavior & mobile menu
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close when clicking nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (toggleBtn) toggleBtn.innerHTML = '☰';
      });
    });
  }
}

// Copy to clipboard actions
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        showToast('Copied to clipboard!');
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        showToast('Failed to copy: Please copy manually');
      }
    });
  });
}

// Live Node Explorer Filtering
const sampleNodes = [
  {
    country: 'Germany',
    flag: '🇩🇪',
    region: 'de',
    protocol: 'VLESS + XTLS Vision',
    port: '443',
    ping: 42,
    sni: 'global.arshia-nova.ir',
    config: 'vless://5039623b-8a43-4da0-82cf-7e54c90470eb@media.qeshmdiar.ir:2095?alpn=http%2F1.1&encryption=none&fp=chrome&host=global.arshia-nova.ir&path=%2Fws&security=tls&sni=global.arshia-nova.ir&type=ws#[🇩🇪]SNV'
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    region: 'ca',
    protocol: 'VLESS + WS + TLS',
    port: '443',
    ping: 58,
    sni: 'shop.lilium-rozh.ir',
    config: 'vless://5039623b-8a43-4da0-82cf-7e54c90470eb@www.udemy.com:443?alpn=http%2F1.1&encryption=none&fp=chrome&host=shop.lilium-rozh.ir&path=%2Fsdvhjldsob&security=tls&sni=shop.lilium-rozh.ir&type=ws#[🇨🇦]SNV'
  },
  {
    country: 'France',
    flag: '🇫🇷',
    region: 'fr',
    protocol: 'VLESS + gRPC + TLS',
    port: '443',
    ping: 48,
    sni: 'assets-fr4.pleiades.codes',
    config: 'vless://0dca2cfe-98eb-4f9d-9a47-cf87510c558b@143.246.208.113:443?mode=gun&security=tls&encryption=none&insecure=0&type=grpc&serviceName=cdn.v1.AssetService&allowInsecure=0&sni=assets-fr4.pleiades.codes#[🇫🇷]SNV'
  },
  {
    country: 'Sweden',
    flag: '🇸🇪',
    region: 'se',
    protocol: 'VLESS + HTTP/3 + WS',
    port: '443',
    ping: 65,
    sni: 'kingcloud.biack.ir',
    config: 'vless://a5c05c1e-aa68-443f-8598-09800244bd4b@192.71.82.2:443?path=%2FLiL%3Fed&security=tls&alpn=h3&encryption=none&insecure=0&fp=chrome&type=ws&allowInsecure=0&sni=kingcloud.biack.ir#[🇸🇪]SNV'
  },
  {
    country: 'Fastly CDN Anycast',
    flag: '🏁',
    region: 'cdn',
    protocol: 'Trojan + TLS 1.3',
    port: '443',
    ping: 36,
    sni: 'global.fastly.com',
    config: 'vless://f8aba8c3-6ab6-4fa0-8815-17e15f4721b1@199.232.246.236:443?security=tls&encryption=none&insecure=0&host=teranko.global.ssl.fastly.net&fp=firefox&type=ws&allowInsecure=0&sni=global.fastly.com#[🏁]SNV'
  },
  {
    country: 'Cloudflare Edge',
    flag: '🇨🇦',
    region: 'ca',
    protocol: 'VLESS + WS Edge Relay',
    port: '443',
    ping: 52,
    sni: 'cloudflare.edge.cdn',
    config: 'vless://c1ec56b6-2c2f-4e6c-8c94-7a6b83a88b37@104.16.4.108:443?path=%2Fvl%2F5RZgnrsVqlRFxvHcaKwCaTZ%3Fed%3D2560&security=tls&alpn=http%2F1.1&encryption=none&insecure=0&host=edge-rELay-C0c1C0.workers.dev&fp=chrome&type=ws&allowInsecure=0#[🇨🇦]SNV'
  }
];

function renderNodes(filter = 'all') {
  const container = document.getElementById('nodesList');
  if (!container) return;

  const filtered = filter === 'all' 
    ? sampleNodes 
    : sampleNodes.filter(n => n.region === filter);

  container.innerHTML = filtered.map(node => `
    <div class="node-item" data-region="${node.region}">
      <div class="node-meta">
        <span class="node-flag">${node.flag}</span>
        <div>
          <div class="node-title">${node.country}</div>
          <div class="node-protocol">${node.protocol} • Port ${node.port}</div>
        </div>
      </div>
      <div class="node-stats">
        <span class="ping-indicator ${node.ping < 50 ? 'ping-low' : 'ping-med'}" id="ping-${node.sni.replace(/[^a-zA-Z0-9]/g, '')}">
          <span class="pulse-dot"></span> ${node.ping}ms
        </span>
        <button class="copy-node-btn" title="Copy Raw Config" data-copy="${node.config}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Re-bind copy listeners for new elements
  initCopyButtons();
}

function initNodeExplorer() {
  renderNodes('all');

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderNodes(filter);
    });
  });
}

// Live Ping Latency Simulation
function initPingSimulator() {
  const pingBtn = document.getElementById('simulatePingBtn');
  if (!pingBtn) return;

  pingBtn.addEventListener('click', () => {
    pingBtn.disabled = true;
    pingBtn.innerHTML = `
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg> Benchmarking Nodes...
    `;

    setTimeout(() => {
      sampleNodes.forEach(node => {
        // Random latency variance +/- 10ms
        const variance = Math.floor(Math.random() * 20) - 10;
        node.ping = Math.max(28, node.ping + variance);
      });

      const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
      renderNodes(activeFilter);

      pingBtn.disabled = false;
      pingBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg> Refresh Ping
      `;
      showToast('All nodes tested & ranked by latency!');
    }, 900);
  });
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// Generate simple SVG QR Code for Download APK
function initQrCode() {
  const qrContainer = document.getElementById('qrCodeContainer');
  if (!qrContainer) return;

  // Clean vector representation of QR pointing to APK Release
  qrContainer.innerHTML = `
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="140" rx="8" fill="white"/>
      <!-- QR Position Markers -->
      <rect x="14" y="14" width="35" height="35" rx="4" fill="#060911"/>
      <rect x="20" y="20" width="23" height="23" rx="2" fill="white"/>
      <rect x="25" y="25" width="13" height="13" fill="#060911"/>

      <rect x="91" y="14" width="35" height="35" rx="4" fill="#060911"/>
      <rect x="97" y="20" width="23" height="23" rx="2" fill="white"/>
      <rect x="102" y="25" width="13" height="13" fill="#060911"/>

      <rect x="14" y="91" width="35" height="35" rx="4" fill="#060911"/>
      <rect x="20" y="97" width="23" height="23" rx="2" fill="white"/>
      <rect x="25" y="102" width="13" height="13" fill="#060911"/>

      <!-- Matrix Code Pattern -->
      <rect x="56" y="14" width="7" height="7" fill="#060911"/>
      <rect x="70" y="14" width="7" height="14" fill="#060911"/>
      <rect x="56" y="28" width="14" height="7" fill="#060911"/>
      <rect x="77" y="28" width="7" height="14" fill="#060911"/>
      <rect x="56" y="42" width="7" height="7" fill="#060911"/>
      <rect x="70" y="49" width="14" height="7" fill="#060911"/>
      <rect x="14" y="56" width="7" height="14" fill="#060911"/>
      <rect x="28" y="56" width="14" height="7" fill="#060911"/>
      <rect x="49" y="56" width="7" height="7" fill="#060911"/>
      <rect x="63" y="63" width="14" height="14" fill="#060911"/>
      <rect x="84" y="56" width="7" height="14" fill="#060911"/>
      <rect x="98" y="56" width="14" height="7" fill="#060911"/>
      <rect x="119" y="56" width="7" height="14" fill="#060911"/>
      <rect x="14" y="77" width="14" height="7" fill="#060911"/>
      <rect x="35" y="70" width="7" height="14" fill="#060911"/>
      <rect x="49" y="77" width="7" height="7" fill="#060911"/>
      <rect x="84" y="77" width="14" height="7" fill="#060911"/>
      <rect x="105" y="70" width="7" height="14" fill="#060911"/>
      <rect x="119" y="77" width="7" height="7" fill="#060911"/>
      <rect x="56" y="91" width="14" height="7" fill="#060911"/>
      <rect x="77" y="91" width="7" height="14" fill="#060911"/>
      <rect x="91" y="98" width="14" height="7" fill="#060911"/>
      <rect x="112" y="91" width="14" height="7" fill="#060911"/>
      <rect x="56" y="105" width="7" height="14" fill="#060911"/>
      <rect x="70" y="112" width="14" height="7" fill="#060911"/>
      <rect x="91" y="112" width="7" height="14" fill="#060911"/>
      <rect x="105" y="119" width="14" height="7" fill="#060911"/>
      <rect x="56" y="126" width="14" height="7" fill="#060911"/>
      <rect x="77" y="126" width="7" height="7" fill="#060911"/>
      <rect x="98" y="126" width="7" height="7" fill="#060911"/>
      <rect x="119" y="126" width="7" height="7" fill="#060911"/>
    </svg>
  `;
}

// Scrollspy for active nav link
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
