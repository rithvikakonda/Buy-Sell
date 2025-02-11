import React, { useState } from 'react';
import axios from 'axios';

import './additem.css';
// import './ai.css';
const AddItemPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const email = localStorage.getItem('userEmail'); // Retrieve the email from localStorage
            const token = localStorage.getItem('token');
            if (!email) {
                setMessage('User email not found. Please log in.');
                return;
            }
    
            // Send the form data along with the email
            const response = await axios.post('http://localhost:5000/add_items', { ...formData, email },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            setMessage(response.data.message);
            setFormData({ name: '', price: '', description: '', category: '' }); // Reset form
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };
    

    return (
        // <div className="max-w-md mx-auto p-4">
        //     <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
        //     {message && <div className="p-2 bg-green-100 text-green-800 mb-4">{message}</div>}
        //     <form onSubmit={handleSubmit}>
        //         <div className="mb-4">
        //             <label className="block text-sm font-medium">Name</label>
        //             <input
        //                 type="text"
        //                 name="name"
        //                 value={formData.name}
        //                 onChange={handleChange}
        //                 className="border rounded w-full p-2"
        //                 required
        //             />
        //         </div>
        //         <div className="mb-4">
        //             <label className="block text-sm font-medium">Price</label>
        //             <input
        //                 type="number"
        //                 name="price"
        //                 value={formData.price}
        //                 onChange={handleChange}
        //                 className="border rounded w-full p-2"
        //                 required
        //             />
        //         </div>
        //         <div className="mb-4">
        //             <label className="block text-sm font-medium">Description</label>
        //             <textarea
        //                 name="description"
        //                 value={formData.description}
        //                 onChange={handleChange}
        //                 className="border rounded w-full p-2"
        //                 required
        //             />
        //         </div>
        //         <div className="mb-4">
        //             <label className="block text-sm font-medium">Category</label>
        //             <input
        //                 type="text"
        //                 name="category"
        //                 value={formData.category}
        //                 onChange={handleChange}
        //                 className="border rounded w-full p-2"
        //                 required
        //             />
        //         </div>
        //         <button
        //             type="submit"
        //             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        //         >
        //             Add Item
        //         </button>
        //     </form>
        // </div>
//  <div className ="add-item-page">
//         <div className="form-container">
//     <h1>Add Item</h1>
//     <form onSubmit={handleSubmit}>
//         <div className="form-group">
//             <div className="input-container">
//                 <label className="block text-sm font-medium">Name</label>
//                 <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="border rounded w-full p-2"
//                     required
//                 />
//             </div>
//             <div className="input-container">
//                 <label className="block text-sm font-medium">Price</label>
//                 <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleChange}
//                     className="border rounded w-full p-2"
//                     required
//                 />
//             </div>
//         </div>
//         <div className="form-group">
//             <label className="block text-sm font-medium">Description</label>
//             <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="border rounded w-full p-2"
//                 required
//             />
//         </div>
//         <div className="form-group">
//             <label className="block text-sm font-medium">Category</label>
//             <input
//                 type="text"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="border rounded w-full p-2"
//                 required
//             />
//         </div>
//         <button type="submit" className="border rounded w-full p-2 bg-blue-500 text-white">
//             Add Item
//         </button>
//     </form>
// </div>
// </div>
<div className="add-item-page">
    <div className="form-container">
        <h1>Add Item</h1>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <div className="form-group">
                <label className="block text-sm font-medium">Price</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <div className="form-group">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <div className="form-group">
                <label className="block text-sm font-medium">Category</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <button type="submit" className="border rounded w-full p-2 bg-blue-500 text-white">
                Add Item
            </button>
        </form>
    </div>
</div>
    );
};

export default AddItemPage;
