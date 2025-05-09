const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const upload = require('../middleware/multer')
const { deleteImageOnCloudinary, uploadImageOnCloudinary } = require('../utils/cloudinary');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');
const { default: mongoose } = require('mongoose');

// @route POST /api/products/create-product
// @desc Create a new Product
// @access Private/Admin
router.post('/create-product', isAuthorized, isAdmin, upload.single('picture'), async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;
        const picture = req.file?.fieldname;
        const picturePath = req.file?.path;

        // Input validation
        if (!title || !description || !price || !category || !stock || !picture) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Cloudinary image upload
        const { secure_url, public_id } = await uploadImageOnCloudinary(picturePath, "products");

        // Check if the image upload was successful
        if (!secure_url || !public_id) {
            return res.status(500).json({
                success: false,
                message: 'Error while uploading image',
                error: 'Cloudinary upload failed'
            });
        }

        // Create product
        const product = await Product.create({
            title, description, category, price, stock, user: req.user._id,
            picture: { secure_url, public_id }
        });


        await product.save();

        return res.status(201).json({
            success: true,
            message: 'Product Added Successfully',
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ success: false, message: 'Server error in create Product' });
    }
});


// @route PUT /api/products/update-product/:id
// @desc Update an existing product ID
// @access Private/Admin
router.put('/update-product/:id', isAuthorized, isAdmin, upload.single('picture'),async (req, res) => {


    try {
        const { id } = req.params
        const { title, description, price, category, stock } = req.body;
        const picturePath = req.file?.path;

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404)
                .json({ success: false, message: 'Product not found' })
        }

        if (title) product.title = title
        if (description) product.description = description
        if (price) product.price = price
        if (category) product.category = category
        if (stock) product.stock = stock

        if (picturePath) {
            const { secure_url, public_id } = await uploadImageOnCloudinary(picturePath, 'products')
            // delete cloudinary image 
            if (product.picture && product.picture.public_id) {
                await deleteImageOnCloudinary(product.picture.public_id)
            }

            product.picture = {
                secure_url, public_id
            }
        }

        await product.save()

        return res.status(200).json({
            success: true,
            message: 'product updated successfully',
            product
        });

    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Server error while updating category' });
    }
});

// @route DELETE /api/products/delete-product/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete('/delete-product/:id', isAuthorized, isAdmin,  async (req, res) => {

    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product Not Found' });
        }

        // delete cloudinary image 

        if (product.picture && product.picture.public_id) {
            await deleteImageOnCloudinary(product.picture.public_id)
        }

        return res.status(200).json({ success: true, message: 'Product Deleted Successfully', data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error in delete Product' });
    }
});

// @route GET /api/products/get-products
// @desc Get all products with optional query filters
// @access Public
router.get('/get-products', async (req, res) => {
    try {
        let { category, search } = req.query;
        let query = {};

        // Handle category filter
        if (category && category.trim().toLowerCase() !== 'all') {
            const trimmedCategory = category.trim();
            const isValidObjectId = mongoose.Types.ObjectId.isValid(trimmedCategory);
            if (isValidObjectId) {
                query.category = trimmedCategory;
            } else {
                query.category = trimmedCategory[0].toUpperCase() + trimmedCategory.slice(1).toLowerCase();
            }
        }

        // Handle search filter
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query)
            .select('title picture price description stock').populate('user', 'name')
            .populate('category', 'name')

        if (!products.length) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }

        const newProductArray = products.map((product) => {
            const productObj = product.toObject();
            productObj.image = productObj.picture?.secure_url || null;

            delete productObj.picture;
            return productObj;

        });


        return res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: newProductArray,
            products
        });

    } catch (error) {
        console.error('Error while fetching products:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching products' });
    }
});

router.get('/single-product/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
            .populate('user', 'name')
            .populate('category', 'name')

        return res.status(200).json({
            success: true,
            message: 'Single product fetched successfully',
            product
        });
    } catch (error) {
        console.error('Error fetching single category:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching single category' });
    }
});


module.exports = router;
