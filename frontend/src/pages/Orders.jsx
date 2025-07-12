import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pollingIntervalRef = useRef(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      setIsLoading(true);
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order.orderId
            allOrdersItem.push(item);
          })
        })
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Initial load of order data
    loadOrderData();
    
    // Set up polling to check for status updates every 30 seconds
    if (token) {
      pollingIntervalRef.current = setInterval(() => {
        loadOrderData();
      }, 30000); // 30 seconds interval
    }
    
    // Cleanup interval on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [token])

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative'>
              <div className='flex items-start gap-6 text-sm'>
                <img src={item.image[0]} className='w-16 sm:w-20' alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              
              {/* Status indicator positioned absolutely to center it vertically */}
              <div className='absolute right-4 top-1/2 pt-10 transform -translate-y-1/2 hidden md:flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base text-green-600 font-medium'>{item.status}</p>
              </div>
              
              {/* Mobile status display */}
              <div className='md:hidden flex items-center gap-2 justify-end mt-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm text-green-600 font-medium'>{item.status}</p>
              </div>
              
              <div className='text-sm mt-6 mb-4'>
                <p className='font-medium'>Order ID: <span className='text-gray-600'>{item.orderId || 'N/A'}</span></p>
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Orders