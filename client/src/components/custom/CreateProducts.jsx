import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AddProduct } from '@/redux/slices/products/productSlice';

const CreateProducts = () => {


    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [inputValues, setInputValues] = useState({});
    const { categories } = useSelector((state) => state.categories);
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues((values) => ({ ...values, [name]: value }));
    };

    const handleCategoryChange = (value) => {
        setInputValues((values) => ({ ...values, category: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();


        setLoading(true);

        dispatch(AddProduct(inputValues))
            .unwrap()
            .then((response) => {
                if (response?.success) {
                    toast.success(response?.message);
                    setInputValues({});
                    navigate('/admin/dashboard/all-products')
                } else {
                    toast.error(response?.message || 'Failed to add category');
                }
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error || 'Failed to add category');
                setLoading(false);
            });
    };




    useEffect(() => {
        dispatch(AllCategory());
    }, [dispatch]);


    return (
        <Card className="w-[900px] ml-10 ">
            <CardHeader>
                <CardTitle>Create Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="title">Product Title</Label>
                            <Input value={inputValues.title} onChange={handleChange} id="title" type='text' name='title' placeholder="Product Title" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="price">Product Price</Label>
                            <Input value={inputValues.price} onChange={handleChange} id="price" type='number' name='price' placeholder="Product Price" />
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={handleCategoryChange}>
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
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="picture">Upload Image</Label>
                            <Input onChange={(e) => handleChange({
                                target: {
                                    name: 'picture',
                                    value: e.target.files[0],
                                }
                            })} id="picture" type='file' name='picture' placeholder="Product Image" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="description">Product Description</Label>
                            <Input value={inputValues.description} onChange={handleChange} id="description" name='description' placeholder="Product description" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="stock">Product Stock</Label>
                            <Input value={inputValues.stock} onChange={handleChange} id="stock" name='stock' placeholder="Product stock" />
                        </div>
                    </div>
                    <Button type='submit' className="mt-4" disabled={loading}>
                        {loading ? 'Adding...' : 'Adding Products'}
                    </Button>
                </form>
            </CardContent>

        </Card>
    )
}

export default CreateProducts