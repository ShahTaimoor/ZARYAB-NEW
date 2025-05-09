import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login } from '@/redux/slices/auth/authSlice'

const Login = () => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const [inputValue, setInputValues] = useState({})

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((values) => ({ ...values, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(login(inputValue))
      .unwrap()
      .then((response) => {
        if (response?.success === true) {
          toast.success(response?.message);
          setInputValues({});
          navigate('/')
        } else {
          toast.error(response?.message || 'Failed to user login');
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error || 'Failed to user login');
        setLoading(false);
      });
  };

  return (
    <div className='w-full mx-auto md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
        <div className='flex justify-center mb-6'>
          <h2 className='text-xl font-medium'>Zaryab Auto</h2>
        </div>
        <h2 className='text-2xl font-bold text-center mb-6'>Hey There!</h2>
        <p className='text-center mb-6'>
          Enter your details to Login
        </p>

        {/* Show Error Message if any */}
        {errorMsg && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Name</label> {/* Changed label to 'Name' */}
          <Input placeholder='Enter Your Name' type='text' name='name' value={inputValue.name} onChange={handleChange} /> {/* Changed 'email' to 'name' */}
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <Input placeholder='Enter Your Password' type='password' name='password' value={inputValue.password} onChange={handleChange} />
        </div>

        <Button
          className="w-full mt-4"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        <p className='mt-6 text-center text-sm'>
          I don't have an account?
          <Link to={`/signup`} className='text-blue-500'> Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
