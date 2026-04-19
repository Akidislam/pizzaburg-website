import { createContext, useContext, useReducer, useEffect } from 'react';
import staticMenuData, { categories } from '../data/menuData';

const CartContext = createContext();

// Get next token number from localStorage
const getNextToken = () => {
    const lastToken = localStorage.getItem('pb_last_token');
    const next = lastToken ? parseInt(lastToken) + 1 : 1001;
    return next;
};

// Load cart from localStorage
const loadCart = () => {
    try {
        const saved = localStorage.getItem('pb_cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

// Load orders from localStorage
const loadOrders = () => {
    try {
        const saved = localStorage.getItem('pb_orders');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

// Load menu from localStorage
const loadMenu = () => {
    try {
        const saved = localStorage.getItem('pb_menu');
        return saved ? JSON.parse(saved) : staticMenuData;
    } catch {
        return staticMenuData;
    }
};

const initialState = {
    cart: loadCart(),
    orders: loadOrders(),
    menu: loadMenu(),
    lastOrder: null,
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingIndex = state.cart.findIndex(
                (item) => item.id === action.payload.id
            );
            let newCart;
            if (existingIndex >= 0) {
                newCart = state.cart.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newCart = [...state.cart, { ...action.payload, quantity: 1 }];
            }
            return { ...state, cart: newCart };
        }

        case 'REMOVE_FROM_CART': {
            const newCart = state.cart.filter((item) => item.id !== action.payload);
            return { ...state, cart: newCart };
        }

        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;
            if (quantity <= 0) {
                return {
                    ...state,
                    cart: state.cart.filter((item) => item.id !== id),
                };
            }
            const newCart = state.cart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            );
            return { ...state, cart: newCart };
        }

        case 'CLEAR_CART':
            return { ...state, cart: [] };

        case 'PLACE_ORDER': {
            const tokenNum = getNextToken();
            const token = `PB-${tokenNum}`;
            localStorage.setItem('pb_last_token', tokenNum.toString());

            const order = {
                token,
                phone: action.payload.phone,
                items: [...state.cart],
                total: state.cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
                status: 'Pending',
                time: new Date().toLocaleString(),
                timestamp: Date.now(),
            };

            const newOrders = [...state.orders, order];
            return {
                ...state,
                cart: [],
                orders: newOrders,
                lastOrder: order,
            };
        }

        case 'UPDATE_ORDER_STATUS': {
            const { token, status } = action.payload;
            const newOrders = state.orders.map((order) =>
                order.token === token ? { ...order, status } : order
            );
            return { ...state, orders: newOrders };
        }

        case 'ADD_MENU_ITEM': {
            const { category, item } = action.payload;
            const newMenu = { ...state.menu };
            if (!newMenu[category]) newMenu[category] = [];
            newMenu[category] = [item, ...newMenu[category]];
            return { ...state, menu: newMenu };
        }

        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('pb_cart', JSON.stringify(state.cart));
    }, [state.cart]);

    useEffect(() => {
        localStorage.setItem('pb_orders', JSON.stringify(state.orders));
    }, [state.orders]);

    useEffect(() => {
        localStorage.setItem('pb_menu', JSON.stringify(state.menu));
    }, [state.menu]);

    const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });
    const placeOrder = (phone) => dispatch({ type: 'PLACE_ORDER', payload: { phone } });
    const updateOrderStatus = (token, status) => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { token, status } });

    // Admin specific
    const addMenuItem = (category, item) => dispatch({ type: 'ADD_MENU_ITEM', payload: { category, item } });

    const cartTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart: state.cart,
                orders: state.orders,
                menu: state.menu,
                categories,
                lastOrder: state.lastOrder,
                cartTotal,
                cartCount,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                placeOrder,
                updateOrderStatus,
                addMenuItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

export default CartContext;
