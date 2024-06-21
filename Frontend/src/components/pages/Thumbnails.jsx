import React, { useContext } from 'react';
import { authContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Thumbnails = () => {
  const { thumbnails } = useContext(authContext);

  const platforms = ['Instagram', 'Facebook', 'Twitter', 'YouTube'];

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('URL copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 flex justify-center">Generated Thumbnails</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {thumbnails.length === 0 ? (
          <p>No thumbnails generated.</p>
        ) : (
          thumbnails.map((thumbnail, index) => (
            <div key={index} className="thumbnail-item">
              <h3 className="text-lg font-medium mb-2">{platforms[index]}</h3>
              <img className="w-full h-auto object-cover" src={thumbnail} alt={`${platforms[index]} thumbnail`} />
              <div className="flex items-center mt-2">
                <button 
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => copyToClipboard(thumbnail)}
                >
                  Copy
                </button>
                <span className="text-sm text-gray-600 truncate w-full">{thumbnail}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Thumbnails;
