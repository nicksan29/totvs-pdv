import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../components/cart-summary.js';

describe('Testes do Componente: CartSummary', () => {
    let cart;

    beforeEach(() => {
        cart = document.createElement('cart-summary');
        document.body.appendChild(cart);
    });

    afterEach(() => {
        document.body.removeChild(cart);
    });

    it('1. Deve começar com o carrinho vazio e sem desconto', () => {
        expect(cart.items.length).toBe(0);
        expect(cart.discount).toBe(0);
    });

    it('2. Deve adicionar um novo produto ao carrinho', () => {
        const mockProduct = { id: 'p1', name: 'Produto Teste', price: 100.00 };
        cart.addToCart(mockProduct);

        expect(cart.items.length).toBe(1);
        expect(cart.items[0].quantity).toBe(1);
    });

    it('3. Deve somar a quantidade se adicionar o mesmo produto duas vezes', () => {
        const mockProduct = { id: 'p2', name: 'Produto Teste 2', price: 50.00 };

        cart.addToCart(mockProduct);
        cart.addToCart(mockProduct);

        expect(cart.items.length).toBe(1);
        expect(cart.items[0].quantity).toBe(2);
    });

    it('4. Deve aplicar 10% de desconto se usar o cupom TOTVS10', () => {
        const mockProduct = { id: 'p3', name: 'Produto Caro', price: 1000.00 };
        cart.addToCart(mockProduct);

        cart.applyDiscount('TOTVS10');

        expect(cart.discount).toBe(0.10);

        const totalText = cart.shadowRoot.querySelector('#total').textContent;
        expect(totalText).toContain('900,00');
    });

    it('5. Não deve aplicar desconto para cupons inválidos', () => {
        const mockProduct = { id: 'p4', name: 'Produto Teste 3', price: 100.00 };
        cart.addToCart(mockProduct);

        cart.applyDiscount('CUPOMFALSO');

        expect(cart.discount).toBe(0);
        const errorText = cart.shadowRoot.querySelector('#coupon-error').textContent;
        expect(errorText).toBe('Cupom inválido.');
    });
});
