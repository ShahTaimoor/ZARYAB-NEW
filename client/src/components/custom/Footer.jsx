import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className='border-t py-12'>
            <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Newsletter</h3>
                    <p className='text-gray-500 mb-4'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae voluptatum minima sequi quam? Fugit qui quaerat natus soluta fugiat cupiditate.
                    </p>
                    <p className='mb-6'>Sign up and get 10% off your first order</p>

                    <form className='flex' >
                        <input type="email"
                            placeholder='Enter your email'
                            className='p-3 w-full text-sm border-t border border-gray-300 rounded-l-md focus:outline:none focus:ring-2 focus:ring-gray-500 transition-all'

                        />
                        <button type='submit' className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800'>Subscribe</button>
                    </form>
                </div>

                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
                    <ul className='space-y-2 text-gray-600'>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>Mens Top Wear</Link>
                        </li>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>Women Top Wear</Link>
                        </li>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>Mens Bottom Wear</Link>
                        </li>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>Women Bottom Wear</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
                    <ul className='space-y-2 text-gray-600'>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>Contact Us</Link>
                        </li>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>About Us</Link>
                        </li>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>FAQs</Link>
                        </li>
                        <li>
                            <Link to='/' className='hover:text-gray-500 transition-colors'>Features</Link>
                        </li>
                    </ul>
                </div>

             
            </div>
            <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6'>
                <p className='text-gray-500 text-sm tracking-tighter text-center'>
                    Shah Taimoor All Right Reserved
                </p>
            </div>
        </footer>
    )
}

export default Footer