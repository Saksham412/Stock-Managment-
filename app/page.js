"use client"
import Header from '@/components/Header'
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [dropdown, setDropdown] = useState([])
  const [loadingaction, setLoadingaction] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.products)
    }
    fetchProducts()
  }, [])


  const addProduct = async (e) => {
    e.preventDefault()
    

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });
      if (response.ok) {
        console.log('Product added successfully')
        setAlert('Product added successfully')
        setProductForm({})
      } else {
        console.error('Error adding product')
      }
    } catch (error) {
      console.error('Error', error)
    }
    const response = await fetch('/api/product')
    let rjson = await response.json()
    setProducts(rjson.products)
  };


  const onChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const buttonAction = async (action, slug, initialQuantity) => {
    let index = products.findIndex((item) => item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if(action=="plus"){
      newProducts[index].quantity = parseInt(initialQuantity)+1
    }else{
      newProducts[index].quantity = parseInt(initialQuantity)-1
    }
    setProducts(newProducts)

    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if(action=="plus"){
      newDropdown[indexdrop].quantity = parseInt(initialQuantity)+1
    }else{
      newDropdown[indexdrop].quantity = parseInt(initialQuantity)-1
    }
    setDropdown(newDropdown)

    console.log(action,slug)
    setLoadingaction(true);

    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action, slug,initialQuantity})
    });
    let r = await response.json()
    console.log(r)
    setLoadingaction(false)
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)
    if (value.length>2) {
      setLoading(true);
      setDropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products)
      setLoading(false);
    }else{
      setDropdown([])
    }
  }
  return (
    <>
      <Header />
      <div className="container mx-auto mb-6 my-5">
        <div className="text-green-750 text-center">{alert}</div>
        <h1 className="text-2xl font-semibold mb-2">
          Search Products</h1>
        <form className="mt-4">
          <div className="flex">
            <input
              onChange={onDropdownEdit}
              type="text"
              name="searchQuery"
              placeholder="Search..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
            />
            <select
              name="selectedCategory"
              className="border border-l-0 rounded-r-lg px-3 py-2 bg-white focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              <option value="category3">Category 3</option>
              {/* Add more options for categories as needed */}
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">Search</button>
          </div>
        </form>
        {loading && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="40" stroke="#000000" fill="none" strokeWidth="5" strokeDasharray="150" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" values="150; 0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>}
        <div className="dropcontainer absolute w-[67vw] border-1 bg-purple-100 rounded-md">
          {dropdown.map(item => {
            return <div key={item.slug} className="container flex justify-between border-b-2 p-1 my-3">
              <span className="slug">{item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div>
              <button onClick={()=>{buttonAction("minus", item.slug, item.quantity)}} disabled={loadingaction} className="subtract inline-block cursor-pointer px-3 py-1 bg-purple-500 text-white font semi-bold rounded-lg shadow-md disabled:bg-purple-200">-</button>
              <span className="quantity inline-block min-w-3 mx-3">{item.quantity}</span>
              <button onClick={()=>{buttonAction("plus", item.slug, item.quantity)}} disabled={loadingaction} className="add inline-block cursor-pointer px-3 py-1 bg-purple-500 text-white font semi-bold rounded-lg shadow-md disabled:bg-purple-200">+</button>
              </div>
            </div>
          })}
        </div>
      </div>


      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Add a product</h1>
        <form>
          <div className='mb-4'>
            <label htmlFor='product' className='block mb-2'>Product Slug:</label>
            <input name="slug" onChange={onChange} value={productForm?.slug || ""} type="text" id='productName' className='w-full border border-gray-300 px-4 py-2' />
          </div>
          <div className='mb-4'>
            <label htmlFor='quantity' className='block mb-2'>Quantity:</label>
            <input name="quantity" onChange={onChange} value={productForm?.quantity || ""} type="number" id='quantity' className='w-full border border-gray-300 px-4 py-2' />
          </div>
          <div className='mb-4'>
            <label htmlFor='price' className='block mb-2'>Price:</label>
            <input name="price" onChange={onChange} value={productForm?.price || ""} type="text" id='price' className='w-full border border-gray-300 px-4 py-2' />
          </div>

          <button onClick={addProduct} type="submit" className='bg-red-500 text-white px-4 py-2'>Add Product</button>
        </form>
      </div>

      <div className="container my-5 mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className='px-4 py-2'>Product</th>
              <th className='px-4 py-2'>Quantity</th>
              <th className='px-4 py-2'>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return <tr key={product.slug}>
                <td className='border px-4 py-2'>{product.slug}</td>
                <td className='border px-4 py-2'>{product.quantity}</td>
                <td className='border px-4 py-2'>₹{product.price}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>

    </>
  )
}
