import React, { useEffect, useState, useContext } from 'react';
import { authContext } from '../context/AuthContext';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';

const UploadedImages = () => {
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(authContext);

  const fetchUploadedImages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/image/getalluploadimages/${user._id}`, {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uploadedImages.length === 0 ? (
          <p>No images uploaded.</p>
        ) : (
          uploadedImages.map((image, index) => (
            <div key={index} className="image-item">
              <img className="w-full h-auto object-cover mb-2" src={image} alt={`Uploaded ${index}`} />
              <div className="flex items-center">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => copyToClipboard(image)}
                >
                  Copy
                </button>
                <span className="text-sm text-gray-600 truncate w-full">{image}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadedImages;
