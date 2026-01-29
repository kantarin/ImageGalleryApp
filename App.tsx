
import React, { useState, ChangeEvent } from 'react';

// Define an interface for the image data to ensure type safety
interface GalleryImage {
  id: string; // Unique ID for key prop in React lists
  src: string; // The URL or Base64 string of the image
  alt: string; // Alternative text for accessibility
  label: string; // Text label to display on the image
  deletable?: boolean; // Optional property to indicate if the image can be deleted
}

const App: React.FC = () => {
  // State for the profile picture
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);
  // State for the editable bio text
  const [bioText, setBioText] = useState<string>('hello my name');

  // Initialize state with the existing placeholder images
  // Mark initial images as deletable based on the user's request
  const [images, setImages] = useState<GalleryImage[]>([
    { id: '1', src: "https://picsum.photos/600/600?random=1", alt: "Placeholder Image 1", label: "IMG 1", deletable: true },
    { id: '2', src: "https://picsum.photos/600/600?random=2", alt: "Placeholder Image 2", label: "IMG 2", deletable: true },
    { id: '3', src: "https://picsum.photos/600/600?random=3", alt: "Placeholder Image 3", label: "IMG 3", deletable: true },
  ]);

  // Handler for when a user selects a file to upload for the gallery
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader(); // Create a FileReader to read the file content
      reader.onloadend = () => {
        // When the file is read, create a new image object
        // Count only truly deletable images to maintain consistent uploaded labels
        const deletableImagesCount = images.filter(img => img.deletable).length;
        const newImage: GalleryImage = {
          id: Date.now().toString(), // Use current timestamp as a unique ID
          src: reader.result as string, // The Base64 string of the image
          alt: `Uploaded Image ${deletableImagesCount + 1}`, // Descriptive alt text
          label: `Uploaded ${deletableImagesCount + 1}`, // Label for the uploaded image
          deletable: true, // Mark uploaded images as deletable
        };
        // Add the new image to the existing list of images in state
        setImages((prevImages) => [...prevImages, newImage]);
      };
      reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
    }
  };

  // Handler for deleting an image from the gallery
  const handleDeleteImage = (idToDelete: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== idToDelete));
  };

  // Handler for when a user selects a file to upload for the profile picture
  const handleProfileImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for changing the bio text
  const handleBioTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBioText(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-darkBackground text-lightText">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 mb-8 border-b-2 border-darkBorder">
        {/* Group for Profile Picture and Title */}
        <div className="flex items-center mb-4 sm:mb-0">
          {/* Profile Picture Upload Area */}
          <label htmlFor="profile-upload" className="w-16 h-16 sm:w-20 sm:h-20 bg-darkSurface rounded-lg border-2 border-darkBorder flex items-center justify-center mr-4 flex-shrink-0 cursor-pointer overflow-hidden relative" aria-label="Upload profile picture">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt="Profile"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              // Placeholder SVG icon for when no profile image is set
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-lightText">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageUpload}
            />
          </label>
          {/* Editable Bio Text */}
          <input
            type="text"
            value={bioText}
            onChange={handleBioTextChange}
            className="bg-transparent border-none focus:outline-none text-xl sm:text-2xl font-light tracking-wide text-center sm:text-left whitespace-nowrap overflow-hidden text-ellipsis p-0"
            aria-label="Edit bio"
          />
        </div>

        {/* Upload Button for Gallery Images */}
        <label htmlFor="image-upload" className="cursor-pointer bg-darkSurface hover:bg-darkBorder text-lightText font-semibold py-2 px-4 rounded-lg border-2 border-darkBorder transition-colors duration-200 ease-in-out whitespace-nowrap">
          Upload Image
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </header>

      {/* Image Gallery Section */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {/* Map over the 'images' state to render each image */}
        {images.map((image) => (
          <div key={image.id} className="relative w-full aspect-square bg-darkSurface rounded-lg overflow-hidden border-2 border-darkBorder shadow-lg flex items-center justify-center text-3xl font-bold text-lightText">
            <img
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Image label with a semi-transparent background for readability */}
            <span className="relative z-10 p-2 bg-black bg-opacity-50 rounded text-base">
              {image.label}
            </span>
            
            {/* Delete button, only shown if the image is deletable */}
            {image.deletable && (
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors duration-200 ease-in-out z-20"
                aria-label={`Delete ${image.label}`}
              >
                &times; {/* HTML entity for 'X' */}
              </button>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default App;
