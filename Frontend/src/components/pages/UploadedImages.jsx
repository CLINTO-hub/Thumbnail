import React, { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setThumbnails } from '../AuthSlice'; 

const UploadedImages = () => {
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUploadedImages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/image/getalluploadimages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      setUploadedImages(result.uploadedImages);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUploadedImages();
    }
  }, [user]);

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('URL copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };

  const handleImageClick = async (image) => {
    try {
      const res = await fetch(`${BASE_URL}/image/getthumbnails/${encodeURIComponent(image)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      dispatch(setThumbnails(result.generatedThumbnails));
      navigate('/getthumbnails');
    } catch (error) {
      toast.error('Failed to fetch thumbnails');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 flex justify-center">Uploaded Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {uploadedImages.length === 0 ? (
          <p>No images uploaded.</p>
        ) : (
          uploadedImages.map((image, index) => (
            <div key={index} className="image-item p-2 border rounded-xl shadow-lg bg-white">
              <img
                className="w-full h-80 object-cover mb-5 rounded-xl cursor-pointer"
                src={image.originalImage}
                alt={`Uploaded ${index}`}
                onClick={() => handleImageClick(image.originalImage)}
              />
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => copyToClipboard(image.originalImage)}
                >
                  Copy
                </button>
                <div className="ml-2 flex flex-col">
                  <span className="text-sm text-gray-600 truncate block mr-80">{image.originalImage}</span>
                  <span className="text-base font-semibold text-gray-600 truncate block">Uploaded by: {image.username}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadedImages;
