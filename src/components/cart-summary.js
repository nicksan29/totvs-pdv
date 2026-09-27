
class CartSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.items = [];
    this.discount = 0;
  }

  connectedCallback() {
    this.render();
    this.setupListeners();

    window.addEventListener('pdv:add-to-cart', (e) => this.addToCart(e.detail));
  }

  addToCart(product) {
    const existingItem = this.items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }

    this.updateCart();
  }

  removeFromCart(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.updateCart();
  }

  updateCart() {
    this.renderItems();
    this.updateTotals();
    const totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
    const badge = document.getElementById('cart-count-badge');

    if (badge) {
      badge.textContent = totalItems;
    }
    const btnCheckout = this.shadowRoot.querySelector('#btn-checkout');
    if (this.items.length === 0) {
      btnCheckout.setAttribute('disabled', 'true');
    } else {
      btnCheckout.removeAttribute('disabled');
    }
  }


  applyDiscount(code) {
    const errorMsg = this.shadowRoot.querySelector('#coupon-error');
    if (!code) {
      errorMsg.textContent = 'Digite um cupom.';
      return;
    }
    if (code.toUpperCase() === 'TOTVS10') {
      this.discount = 0.10;
      errorMsg.textContent = 'Cupom aplicado!';
      errorMsg.style.color = 'var(--color-success)';
      this.updateTotals();
    } else {
      this.discount = 0;
      errorMsg.textContent = 'Cupom inválido.';
      errorMsg.style.color = 'var(--color-danger)';
      this.updateTotals();
    }
  }

  updateTotals() {
    const subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountValue = subtotal * this.discount;
    const total = subtotal - discountValue;

    this.shadowRoot.querySelector('#subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    this.shadowRoot.querySelector('#discount').textContent = `- R$ ${discountValue.toFixed(2).replace('.', ',')}`;
    this.shadowRoot.querySelector('#total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  renderItems() {
    const list = this.shadowRoot.querySelector('.item-list');
    if (this.items.length === 0) {
      list.innerHTML = `<div class="empty-cart">Carrinho vazio</div>`;
      return;
    }

    list.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="item-info">
          <h4>${item.name}</h4>
          <span>${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</span>
        </div>
        <button class="btn-remove" data-id="${item.id}">X</button>
      </div>
    `).join('');

    const removeButtons = list.querySelectorAll('.btn-remove');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.removeFromCart(e.target.dataset.id));
    });
  }

  setupListeners() {
    const couponBtn = this.shadowRoot.querySelector('#btn-coupon');
    const couponInput = this.shadowRoot.querySelector('#coupon-input');


    const closeBtn = this.shadowRoot.querySelector('#btn-close-modal');
    closeBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('close-modal'));
    });

    couponBtn.addEventListener('click', () => {
      this.applyDiscount(couponInput.value);
    });

    const btnCheckout = this.shadowRoot.querySelector('#btn-checkout');
    const successModal = this.shadowRoot.querySelector('#success-modal');
    const btnCloseSuccess = this.shadowRoot.querySelector('#btn-close-success');
    btnCheckout.addEventListener('click', () => {
      if (this.items.length > 0) {
        successModal.classList.add('show');
      }
    });
    btnCloseSuccess.addEventListener('click', () => {
      successModal.classList.remove('show');
      this.items = [];
      this.discount = 0;
      this.shadowRoot.querySelector('#coupon-input').value = '';
      this.shadowRoot.querySelector('#coupon-error').textContent = '';
      this.updateCart();
    });

  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .cart-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          padding: 1.2rem;
          display: flex;
          flex-direction: column;

          position: sticky;
          top: 2rem;
          height: calc(100vh - 4rem);
          max-height: 600px; 
        }
        h2 { 
          color: #004d99; 
          margin-bottom: 1rem; 
          font-size: 1.2rem;
          border-bottom: 2px solid #f4f6f8; 
          padding-bottom: 0.5rem; 
          flex-shrink: 0;
        }

        .item-list { 
          flex-grow: 1; 
          overflow-y: auto; 
          margin-bottom: 1rem;
          padding-right: 5px;
        }
        .item-list::-webkit-scrollbar { width: 6px; }
        .item-list::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 4px; }
        .empty-cart { text-align: center; color: #999; margin-top: 2rem; font-size: 0.9rem;}
        
        .cart-item { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 0.6rem 0;
          border-bottom: 1px solid #eee; 
          animation: slideIn 0.3s ease; 
        }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        
        .cart-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f4f6f8; margin-bottom: 1rem; padding-bottom: 0.5rem; }
        .cart-header h2 { border: none; margin: 0; padding: 0; }
        #btn-close-modal { display: none; background: #ffebee; color: #d32f2f; border: none; font-weight: bold; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;}
        
        @media (max-width: 900px) {
          .cart-container { height: 100%; max-height: 90vh; width: 100%; max-width: 400px; margin: 0 auto; }
          #btn-close-modal { display: block; }
        }

        .item-info h4 { font-size: 0.85rem; color: #333; margin-bottom: 0.2rem; }
        .item-info span { font-size: 0.8rem; color: #666; }
        .btn-remove { background: #ffebee; color: #d32f2f; border: none; border-radius: 4px; width: 22px; height: 22px; cursor: pointer; font-weight: bold; font-size: 0.75rem;}
        .btn-remove:hover { background: #ffcdd2; }
        
        .bottom-section { flex-shrink: 0; }
        
        .coupon-section { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
        .coupon-box { display: flex; gap: 0.4rem; }
        .coupon-box input { flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; outline: none; font-size: 0.85rem;}
        .coupon-box button { background: #00b0ff; color: white; border: none; padding: 0 0.8rem; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.85rem;}
        #coupon-error { font-size: 0.75rem; color: #d32f2f; min-height: 12px; }
        .totals { background: #f9f9f9; padding: 0.8rem; border-radius: 6px; }
        .tot-row { display: flex; justify-content: space-between; margin-bottom: 0.4rem; color: #666; font-size: 0.85rem; }
        .tot-row.grand-total { color: #004d99; font-size: 1.1rem; font-weight: bold; border-top: 1px solid #ddd; padding-top: 0.6rem; margin-top: 0.4rem; margin-bottom: 0;}
        .btn-checkout { width: 100%; background-color: #00c853; color: white; border: none; padding: 1rem; border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 1rem; transition: background 0.2s, transform 0.1s; }
        .btn-checkout:hover:not(:disabled) { background-color: #00e676; }
        .btn-checkout:active:not(:disabled) { transform: scale(0.98); }
        .btn-checkout:disabled { background-color: #ccc; cursor: not-allowed; }

        .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.3s ease; border-radius: 8px; }
        .modal-overlay.show { display: flex; }
        .modal-content { text-align: center; }
        .check-icon { font-size: 4rem; color: #00c853; margin-bottom: 0.5rem; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .modal-content h3 { color: #004d99; margin-bottom: 0.5rem; font-size: 1.5rem;}
        .modal-content p { color: #666; font-size: 0.95rem; margin-bottom: 1.5rem; }
        #btn-close-success { background: #004d99; color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
        </style>

      <div class="cart-container">
        <div class="cart-header">
          <h2>Cupom Fiscal</h2>
          <button id="btn-close-modal">X</button>
        </div>
        
        <div class="item-list">
          <div class="empty-cart">Carrinho vazio</div>
        </div>
        <div class="bottom-section">
          <div class="coupon-section">
            <div class="coupon-box">
              <input type="text" id="coupon-input" placeholder="Cupom (ex: TOTVS10)" />
              <button id="btn-coupon">Aplicar</button>
            </div>
            <span id="coupon-error"></span>
          </div>
          <div class="totals">
            <div class="tot-row">
              <span>Subtotal</span>
              <span id="subtotal">R$ 0,00</span>
            </div>
            <div class="tot-row">
              <span>Descontos</span>
              <span id="discount">- R$ 0,00</span>
            </div>
            <div class="tot-row grand-total">
              <span>Total</span>
              <span id="total">R$ 0,00</span>
            </div>
          </div>
          <button id="btn-checkout" class="btn-checkout" disabled>Finalizar Venda</button>
        
        <div id="success-modal" class="modal-overlay">
          <div class="modal-content">
            <div class="check-icon">✓</div>
            <h3>Venda Finalizada!</h3>
            <p>Obrigado por usar o SmartPOS.</p>
            <button id="btn-close-success">Nova Venda</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('cart-summary', CartSummary);
