interface PhotosByGuestsSectionProps {
  hotelData?: any;
  onImageClick?: (images: string[], startIndex: number) => void;
}

export function PhotosByGuestsSection({ hotelData, onImageClick }: PhotosByGuestsSectionProps) {
  // Get all images from hotel data
  const getAllHotelImages = () => {
    const allImages: string[] = [];
    
    // Add main hotel images
    if (hotelData?.images) {
      allImages.push(...hotelData.images.map((img: any) => img.file));
    }
    
    // Add room images
    if (hotelData?.rooms) {
      hotelData.rooms.forEach((room: any) => {
        if (room.images) {
          allImages.push(...room.images.map((img: any) => img.file));
        }
      });
    }
    
    // Add service images if available
    if (hotelData?.servicedetails) {
      hotelData.servicedetails.forEach((service: any) => {
        if (service.images && service.images.length > 0) {
          allImages.push(...service.images.map((img: any) => img.file || img));
        }
      });
    }
    
    return allImages;
  };

  const allImages = getAllHotelImages();
  
  // Fallback images if no hotel images available
  const fallbackPhotos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWQlMjBtb2Rlcm58ZW58MXx8fHwxNzU3NzU2MjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Modern hotel room"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTc3NDA4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Luxury hotel room interior"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1631048730670-ff5cd0d08f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJlZHJvb20lMjBkZXNpZ258ZW58MXx8fHwxNzU3NzU2MjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Hotel bedroom design"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXNvcnQlMjByb29tJTIwdHJvcGljYWx8ZW58MXx8fHwxNzU3NzU2MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Resort room tropical",
      showOverlay: true
    }
  ];

  // Use hotel images if available, otherwise use fallback
  const displayImages = allImages.length > 0 
    ? allImages.slice(0, 4).map((src, index) => ({
        id: index + 1,
        src,
        alt: `${hotelData?.name || 'Hotel'} - Photo ${index + 1}`,
        showOverlay: index === 3 && allImages.length > 4
      }))
    : fallbackPhotos;

  const handleImageClick = (index: number) => {
    if (onImageClick && allImages.length > 0) {
      onImageClick(allImages, index);
    }
  };

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 w-full mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Photos by Guests</h3>
        {allImages.length > 0 && (
          <span className="text-sm text-gray-500">{allImages.length} photos</span>
        )}
      </div>
      
      {/* Photos carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {displayImages.map((photo, index) => (
          <div 
            key={photo.id} 
            className="relative flex-1 h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(index)}
          >
            <img 
              src={photo.src} 
              alt={photo.alt}
              className="w-full h-full object-cover"
            />
            {photo.showOverlay && allImages.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium text-center text-sm">+{allImages.length - 3} More Photos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Info */}
      {hotelData && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            {hotelData.images && (
              <span>Hotel Photos: {hotelData.images.length}</span>
            )}
            {hotelData.rooms && (
              <span>Room Photos: {hotelData.rooms.reduce((acc: number, room: any) => acc + (room.images?.length || 0), 0)}</span>
            )}
            {hotelData.property_type && (
              <span>Property Type: {hotelData.property_type}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}