import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const subcategoryMap = {
    Men: [], // If you have other Men categories, you can add here
    Women: [], // If needed
    Kids: [], // Not used in updated UI

    HomeDecor: [
      'Photo Frames & Albums',
      'Diyas, Candles & Holders',
      'Home Fragrance',
      'Flowers & Vases',
      'Showpieces & Decor Accents'
    ],
    Gifts: [
      'Greeting Cards',
      'Rakhi & Rakhi Sets',
      'Festive Gift Boxes',
      'Decorative Platters'
    ],
    Toys: [
      'Action toys',
      'Sports Toys',
      'Role play toys',
      'soft toys',
      'Learning and Educational Toys'
    ],
    Accessories: [
      'wallets',
      'Clutches',
      'Travel Document Holders',
      'Chains',
      'Belts'
    ]
  };

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Left Filters */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['HomeDecor', 'Gifts', 'Toys', 'Accessories'].map(cat => (
              <label key={cat} className='flex gap-2'>
                <input
                  type="checkbox"
                  value={cat}
                  className='w-3'
                  onChange={toggleCategory}
                />
                {cat === 'HomeDecor' ? 'Home Decor' : cat}
              </label>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        {category.length > 0 && (
          <div className={`border border-gray-300 pl-5 py-3 mt-5 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>TYPE</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              {category.map(cat =>
                (subcategoryMap[cat] || []).map(sub => (
                  <label key={sub} className='flex gap-2'>
                    <input
                      type="checkbox"
                      value={sub}
                      className='w-3'
                      onChange={toggleSubCategory}
                    />
                    {sub}
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Products Section */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTION'} />
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
