import React, { useEffect, useState } from 'react';
import uploadImageToCloudinary from '../../../utils/UploadImageToCloudinary';
import { BASE_URL } from '../../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader.js';
import { setThumbnails } from '../AuthSlice';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await uploadImageToCloudinary(selectedFile);
      const formData = {
        imagePath: data.url,
      };

      const res = await fetch(`${BASE_URL}/image/upload/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': user.apiKey,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const { message, thumbnails } = await res.json();
      dispatch(setThumbnails(thumbnails));
      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      navigate('/getthumbnails');
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  if (!user) {
    return <p className='flex justify-center text-2xl'>Loading...</p>;
  }
  
  return (
    <div className='flex flex-col items-center h-screen'>
      <p className='text-2xl font-semibold mt-8'>
        Welcome back <span className='text-blue-500'>{user?.firstname} {user?.lastname}</span>
      </p>
      {previewURL && (
        <figure className='w-[750px] h-[450px] rounded border border-solid border-primaryColor flex items-center justify-center mt-28 overflow-hidden'>
          <img src={previewURL} alt='Preview' className='w-full h-full object-cover' />
        </figure>
      )}
      <div className='mt-5 flex items-center gap-3'>
        <div className='relative w-[160px] h-[50px]'>
          <input
            type='file'
            name='photo'
            id='customFile'
            onChange={handleFileInputChange}
            accept='.jpg, .png'
            className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
          />
          <label
            htmlFor='customFile'
            className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'
          >
            Upload cover photo
          </label>
        </div>     

        <div className='mt-0'>
          <button
            disabled={loading}
            onClick={submitHandler}
            className='bg-green-600 hover:bg-green-900 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'
          >
            {loading ? <HashLoader size={25} color='#fff' /> : 'Generate thumbnail'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
