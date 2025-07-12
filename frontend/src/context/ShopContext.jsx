import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "₹";
    const platform_fee = 0;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        // Initialize cart from localStorage if available
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId) => {
        try {
            let cartData = { ...cartItems };

            if (cartData[itemId]) {
                cartData[itemId] += 1;
            } else {
                cartData[itemId] = 1;
            }

            setCartItems(cartData);
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cartData));
            
            // Show success message when product is added
            const productName = products.find(product => product._id === itemId)?.name || 'Product';
            toast.success(`${productName} Added to Cart`);

            if (token) {
                try {
                    await axios.post(backendUrl + '/api/cart/add', { itemId, quantity: cartData[itemId] }, { headers: { token } });
                } catch (error) {
                    console.error('Error updating server cart:', error);
                    toast.error('Failed to update cart on server');
                }
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            try {
                if (cartItems[itemId] > 0) {
                    totalCount += cartItems[itemId];
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, quantity) => {
        try {
            let cartData = { ...cartItems };
            
            if (quantity <= 0) {
                // Remove the item if quantity is 0 or less
                delete cartData[itemId];
            } else {
                // Update the quantity
                cartData[itemId] = quantity;
            }
            
            setCartItems(cartData);
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cartData));

            if (token) {
                try {
                    if (quantity <= 0) {
                        await axios.post(backendUrl + '/api/cart/remove', { itemId }, { headers: { token } });
                    } else {
                        await axios.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token } });
                    }
                } catch (error) {
                    console.error('Error updating server cart:', error);
                    toast.error('Failed to update cart on server');
                }
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    }


    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.price * cartItems[itemId];
            }
        }
        return totalAmount;
    }


    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });

            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProductsData();
    }, [])

    // Load token on first mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // When token is available, fetch the user's cart
    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token]);


    const value = {
        products, currency, platform_fee,
        search, setSearch, showSearch, setShowSearch, cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity, getCartAmount, navigate, backendUrl, token, setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider