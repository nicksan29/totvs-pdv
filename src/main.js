// src/main.js
import './components/product-grid.js';
import './components/cart-summary.js';

document.addEventListener('DOMContentLoaded', () => {
  const mobileCartBtn = document.getElementById('mobile-cart-btn');
  const cartSection = document.querySelector('.cart-section');

  mobileCartBtn.addEventListener('click', () => {
    cartSection.classList.toggle('is-open');
  });
  cartSection.addEventListener('close-modal', () => {
    cartSection.classList.remove('is-open');
  });
});

function playScannerBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(880, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

function showToast(productName) {
  const toast = document.createElement('div');
  toast.textContent = ` ${productName} adicionado!`;
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#00c853',
    color: 'white',
    padding: '15px 25px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontWeight: 'bold',
    zIndex: '9999',
    transform: 'translateY(-100px)',
    opacity: '0',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.transform = 'translateY(-100px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function animateFlyToCart(startX, startY) {
  const dot = document.createElement('div');
  Object.assign(dot.style, {
    position: 'fixed',
    left: `${startX}px`,
    top: `${startY}px`,
    width: '20px',
    height: '20px',
    backgroundColor: '#00b0ff',
    borderRadius: '50%',
    zIndex: '10000',
    pointerEvents: 'none',
    transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
  });
  document.body.appendChild(dot);
  let targetX, targetY;
  if (window.innerWidth > 900) {
    targetX = window.innerWidth - 100;
    targetY = window.innerHeight / 3;
  } else {
    const cartIcon = document.getElementById('mobile-cart-btn');
    const rect = cartIcon.getBoundingClientRect();
    targetX = rect.left + 20;
    targetY = rect.top + 20;
  }
  requestAnimationFrame(() => {
    dot.style.left = `${targetX}px`;
    dot.style.top = `${targetY}px`;
    dot.style.transform = 'scale(0.1)';
    dot.style.opacity = '0';
  });
  setTimeout(() => dot.remove(), 600);
}
window.addEventListener('pdv:add-to-cart', (e) => {
  const product = e.detail;
  const clickX = e.clickX;
  const clickY = e.clickY;
  playScannerBeep();
  showToast(product.name);

  if (clickX && clickY) {
    animateFlyToCart(clickX, clickY);
  }
});

