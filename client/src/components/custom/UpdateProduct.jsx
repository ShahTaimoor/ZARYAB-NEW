import { AllCategory } from '@/redux/slices/categories/categoriesSlice'
import { getSingleProduct, updateSingleProduct } from '@/redux/slices/products/productSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'

const UpdateProduct = () => {
    const [inputValue, setInputValue] = useState({
        title: '',
        price: '',
        category: '',
        picture: '',
        description: '',
        stock: '',
    })

    const { categories } = useSelector((state) => state.categories);
    const { singleProducts } = useSelector(s => s.products);
    const { id } = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setInputValue((values) => ({ ...values, [name]: type === 'file' ? files[0] : value }));
    };

    const handleCategoryChange = (value) => {
        setInputValue((values) => ({ ...values, category: value }));
    }

    useEffect(() => {
        dispatch(getSingleProduct(id))
        dispatch(AllCategory())
    }, [id, dispatch])

    useEffect(() => {
        if (singleProducts) {
            const { title, price, category, picture, description, stock } = singleProducts
            setInputValue({
                title: title,
                price: price,
                category: category?._id,
                picture: picture,
                description: description,
                stock: stock,

            })


        }
    }, [singleProducts])


    const handleSubmit = (e) => {
        e.preventDefault();


        dispatch(updateSingleProduct({ inputValues: inputValue, id }))
            .unwrap()
            .then((response) => {
                if (response?.success) {
                    toast.success(response?.message);
                    setInputValue({
                        title: '',
                        price: '',
                        category: '',
                        picture: '',
                        description: '',
                        stock: ''
                      });
                    navigate('/admin/dashboard/all-products')
                } else {
                    toast.error(response?.message || 'Failed to add PRODUCTSsdsd');
                }

            })
            .catch((error) => {
                toast.error(error || 'Failed to add PRODCUTS');
            });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Product Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className='grid gap-6'>
                        <div className='grid gap-3'>
                            <Label htmlFor='title'>
                                Title
                            </Label>
                            <Input type="text" id='title'
                                placeholder='Enter Product Title'
                               
                                name='title'
                                value={inputValue.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className='grid gap-3'>
                                <Label htmlFor='price'>
                                    Price
                                </Label>
                                <Input type="text" id='price'
                                    placeholder='Enter Product Price'
                                    
                                    name='price'
                                    value={inputValue.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='grid gap-3'>
                                <Label htmlFor='category'>
                                    Category
                                </Label>
                                <Select value={inputValue.category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {categories &&
                                            categories.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}

                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className='grid grid-cols-2'>
                            <div className='grid gap-3'>
                                <Label htmlFor='picture'>
                                    Picture
                                </Label>
                                <Input type="file" id='picture'
                                    placeholder='Enter Product Image'
                                  
                                    name='picture'

                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'picture',
                                            value: e.target.files[0]
                                        }
                                    })}
                                />
                            </div>

                        </div>

                        <div className='grid grid-cols-2'>
                            <div className='grid gap-3'>
                                <Label htmlFor='description'>
                                    Description
                                </Label>
                                <Input type="text" id='description'
                                    placeholder='Enter Product Price'
                                 
                                    name='description'
                                    value={inputValue.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='grid gap-3'>
                                <Label htmlFor='stock'>
                                    Stock
                                </Label>
                                <Input type="number" id='stock'
                                    placeholder='Enter Product Stock'
                                    
                                    name='stock'
                                    value={inputValue.stock}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button type='submit'>
                            Update Product
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default UpdateProduct