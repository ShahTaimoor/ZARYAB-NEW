import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { removeFromCart } from '@/redux/slices/cartSlice';

const CartProduct = ({ _id, name, price, quantity, image, stock }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const total = price * quantity;

    const handleBuyNow = async () => {
        if (quantity > stock) {
            toast.error('Product out of stock');
            return;
        }
        navigate('/');
    };

    const handleRemove = (e) => {
        e.stopPropagation(); // prevent triggering handleBuyNow
        dispatch(removeFromCart(_id));
        toast.success('Product removed from cart');
    };

    return (
        <div
            className="flex justify-between items-center py-3 border-b cursor-pointer hover:bg-gray-50"
            onClick={handleBuyNow}
        >
            <div className="flex items-center">
                <img
                    src={image || '/fallback.jpg'}
                    alt={name}
                    className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{name}</h4>
                    <p className="text-sm text-gray-500">Qty: {quantity}</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <p className="font-semibold text-gray-900">0</p>

                <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Remove from cart"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default CartProduct;
