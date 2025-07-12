import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('HomeDecor');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);

  const subcategoryMap = {
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

  useEffect(() => {
    setSubCategory(subcategoryMap[category]?.[0] || '');
  }, [category]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image1 || !name || !description || !price || !category || !subCategory) {
      toast.error('Please fill all required fields and upload at least one image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setPrice('');
        setCategory('HomeDecor');
        setSubCategory(subcategoryMap['HomeDecor'][0]);
        setBestseller(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Upload Section */}
      <div>
        <p className="mb-2">Upload Image (at least one required)</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((img, i) => (
            <label htmlFor={`image${i + 1}`} key={i}>
              <img
                className="w-20"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />
              <input
                onChange={(e) => {
                  const setter = [setImage1, setImage2, setImage3, setImage4][i];
                  setter(e.target.files[0]);
                }}
                type="file"
                hidden
                id={`image${i + 1}`}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Category and Subcategory */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
            required
          >
            <option value="HomeDecor">Home Decor</option>
            <option value="Gifts">Gifts</option>
            <option value="Toys">Toys</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
            required
          >
            {subcategoryMap[category]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller (optional)
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
