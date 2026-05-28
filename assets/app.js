// ============================================
// Vue to React Migration Guide - App Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCodeTabs();
  initCodeCopy();
  initScrollSpy();
});

// ============================================
// Mobile Menu Toggle
// ============================================

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
}

// ============================================
// Code Tabs (Vue/React Switcher)
// ============================================

function initCodeTabs() {
  const tabGroups = document.querySelectorAll('.code-tabs');

  tabGroups.forEach(group => {
    const tabs = group.querySelectorAll('.code-tab');
    const contents = group.querySelectorAll('.code-tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active content
        contents.forEach(content => {
          content.classList.toggle('active', content.dataset.tab === targetTab);
        });
      });
    });
  });
}

// ============================================
// Code Copy Button
// ============================================

function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.code-block-copy');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block-wrapper')?.querySelector('.code-block')
        || button.closest('.code-tabs')?.querySelector('.code-tab-content.active .code-block');

      if (!codeBlock) return;

      const code = codeBlock.textContent;

      try {
        await navigator.clipboard.writeText(code);
        button.textContent = '已复制';
        button.classList.add('copied');

        setTimeout(() => {
          button.textContent = '复制';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    });
  });
}

// ============================================
// Scroll Spy for TOC
// ============================================

function initScrollSpy() {
  const tocLinks = document.querySelectorAll('.toc-link');
  if (tocLinks.length === 0) return;

  const sections = [];
  tocLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeLink = sections.find(s => s.section === entry.target)?.link;
          if (activeLink) {
            tocLinks.forEach(l => l.classList.remove('active'));
            activeLink.classList.add('active');
          }
        }
      });
    },
    { rootMargin: '-20% 0px -80% 0px' }
  );

  sections.forEach(({ section }) => observer.observe(section));
}

// ============================================
// Utility: Smooth Scroll for Anchor Links
// ============================================

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href');
  const target = document.querySelector(targetId);

  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', targetId);
  }
});
