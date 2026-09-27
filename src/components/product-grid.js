import { products } from '../data/products.js';

class ProductGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.allProducts = products;
        this.filteredProducts = products;
    }

    connectedCallback() {
        this.renderBase();
        this.renderGrid();
        this.setupSearch();
    }

    renderBase() {
        this.shadowRoot.innerHTML = `
      <style>
        .search-container { margin-bottom: 1.5rem; }
        .search-input { 
            width: 100%; 
            padding: 1rem; 
            border: 2px solid #e5e4e7; 
            border-radius: 8px; 
            font-size: 1rem; 
            outline: none; 
            transition: border-color 0.2s;
        }
        .search-input:focus { border-color: #004d99; }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 1.5rem;
            padding: 5px;
            padding-bottom: 2rem;
        }
        @keyframes cascadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        .card { 
            background: #fff; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); 
            display: flex; flex-direction: column; 
            opacity: 0;
            animation: cascadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            transition: transform 0.2s, box-shadow 0.2s; 
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .card img { 
            width: 100%; 
            height: 120px; 
            object-fit: contain;
            border-radius: 6px; 
            margin-bottom: 1rem; 
        }
        .card h3 { font-size: 1.1rem; color: #004d99; margin-bottom: 0.5rem; }
        .card p { font-size: 0.85rem; color: #666; flex-grow: 1; }
        .price { font-weight: bold; font-size: 1.2rem; margin: 1rem 0; color: #333; }
        button { background-color: #004d99; color: white; border: none; padding: 0.6rem; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
        button:hover { background-color: #00b0ff; }
        .no-results { text-align: center; color: #666; padding: 2rem; grid-column: 1 / -1; }
      </style>

      <div class="search-container">
        <input type="search" id="search-input" class="search-input" placeholder="Buscar produtos por nome..." autocomplete="off">
      </div>
      
      <div id="grid-container" class="grid"></div>
    `;
    }

    renderGrid() {
        const gridContainer = this.shadowRoot.getElementById('grid-container');

        if (this.filteredProducts.length === 0) {
            gridContainer.innerHTML = `<div class="no-results">Nenhum produto encontrado.</div>`;
            return;
        }

        gridContainer.innerHTML = this.filteredProducts.map((product, index) => `
          <div class="card" style="animation-delay: ${index * 0.05}s">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            <button data-id="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">
              Adicionar ao Carrinho
            </button>
          </div>
        `).join('');


        this.addEventListeners();
    }

    setupSearch() {
        const searchInput = this.shadowRoot.getElementById('search-input');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            this.filteredProducts = this.allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );

            this.renderGrid();
        });
    }

    addEventListeners() {
        const buttons = this.shadowRoot.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const product = this.allProducts.find(p => p.id === productId);
                const event = new CustomEvent('pdv:add-to-cart', {
                    detail: product,
                    bubbles: true,
                    composed: true
                });

                event.clickX = e.clientX;
                event.clickY = e.clientY;
                this.dispatchEvent(event);

            });
        });
    }
}

customElements.define('product-grid', ProductGrid);
