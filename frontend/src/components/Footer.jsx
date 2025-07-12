import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <p
            style={{
              backgroundImage:
                "linear-gradient(90deg, #f5d76e, #ffd700, #f9a602)",
              WebkitBackgroundClip: "text",
              fontWeight: "bold",
              fontSize: "1.875rem", // equivalent to text-3xl
              textAlign: "center",
              textShadow:
                "0 0 8px rgba(255, 215, 0, 0.6), 0 0 15px rgba(255, 215, 0, 0.4)",
              fontFamily: '"Times New Roman", sans-serif',
              width: "9rem", // equivalent to w-36
            }}
          >
            RAMINDER
          </p>
          <p className="w-full md:w-2/3 text-gray-600">
            Home Decor | Gifts | Toys | Men's Accessories
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">Get in Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 88607 97971</li>
            <li>support@raminder.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ raminder.com - All rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
