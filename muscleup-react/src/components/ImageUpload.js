import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faTimes,
  faEdit,
  faTrash,
  faExpand,
  faSpinner,
  faUser,
  faCalendar,
  faWeight,
  faDumbbell,
} from '@fortawesome/free-solid-svg-icons';

// Main Container
const ImageUploadContainer = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadowLight};
  border: 1px solid ${props => props.theme.colors.border};
`;

// Upload Zone
const UploadZone = styled(motion.div)`
  border: 2px dashed ${props => props.isDragActive 
    ? props.theme.colors.primary 
    : props.theme.colors.border
  };
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragActive 
    ? props.theme.colors.primary + '10' 
    : props.theme.colors.backgroundSecondary
  };
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}20;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.textTertiary};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: ${props => props.theme.colors.textTertiary};
  font-size: 0.875rem;
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

// Image Preview
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const ImageCard = styled(motion.div)`
  position: relative;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadowLight};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ImageCard}:hover & {
    opacity: 1;
  }
`;

const OverlayButton = styled(motion.button)`
  background: ${props => {
    if (props.variant === 'danger') return props.theme.colors.danger;
    if (props.variant === 'success') return props.theme.colors.success;
    return props.theme.colors.primary;
  }};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ImageInfo = styled.div`
  padding: 1rem;
`;

const ImageTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;
  font-weight: 600;
`;

const ImageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const ImageDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.4;
`;

// Progress Photos Specific
const ProgressPhotoCard = styled(ImageCard)`
  border-left: 4px solid ${props => props.theme.colors.success};
`;

const ProgressStats = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatValue = styled.span`
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 500;
`;

// Upload Progress
const UploadProgress = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
`;

const ProgressBar = styled.div`
  width: 80%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  border-radius: 2px;
`;

// Modal for full-size view
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const ModalClose = styled.button`
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    opacity: 0.7;
  }
`;

// Main Image Upload Component
export const ImageUpload = ({
  images = [],
  onUpload,
  onDelete,
  onEdit,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  uploadType = 'general', // 'profile', 'progress', 'general'
  showGrid = true,
  title = "Upload Images"
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback(async (files) => {
    const validFiles = files.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        alert(`File type ${file.type} not supported`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Max size: ${maxFileSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > maxFiles) {
      alert(`Cannot upload more than ${maxFiles} files`);
      return;
    }

    for (const file of validFiles) {
      await uploadFile(file);
    }
  }, [images.length, maxFiles, maxFileSize, acceptedTypes]);

  const uploadFile = useCallback(async (file) => {
    const fileId = Date.now() + Math.random();
    
    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    try {
      // Create file reader to get base64 data
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: fileId,
          name: file.name,
          src: e.target.result,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          description: '',
          ...(uploadType === 'progress' && {
            weight: null,
            bodyFat: null,
            notes: ''
          })
        };

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
            onUpload?.(imageData);
          } else {
            setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
          }
        }, 200);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  }, [uploadType, onUpload]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const renderUploadZone = () => (
    <UploadZone
      isDragActive={isDragActive}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={openFileDialog}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <HiddenInput
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
      />
      
      <UploadIcon>
        <FontAwesomeIcon icon={uploadType === 'profile' ? faUser : faImage} />
      </UploadIcon>
      
      <UploadText>
        {uploadType === 'profile' ? 'Upload Profile Picture' : 
         uploadType === 'progress' ? 'Upload Progress Photo' :
         'Drop images here or click to browse'}
      </UploadText>
      
      <UploadSubtext>
        Supports: {acceptedTypes.map(type => type.split('/')[1]).join(', ')} • 
        Max {maxFileSize / 1024 / 1024}MB • 
        Up to {maxFiles} files
      </UploadSubtext>

      {/* Upload Progress Overlays */}
      <AnimatePresence>
        {Object.entries(uploadProgress).map(([fileId, progress]) => (
          <UploadProgress
            key={fileId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Uploading...</p>
            <ProgressBar>
              <ProgressFill
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </ProgressBar>
          </UploadProgress>
        ))}
      </AnimatePresence>
    </UploadZone>
  );

  const renderImageGrid = () => {
    if (!showGrid || images.length === 0) return null;

    const ImageComponent = uploadType === 'progress' ? ProgressPhotoCard : ImageCard;

    return (
      <ImageGrid>
        <AnimatePresence>
          {images.map((image) => (
            <ImageComponent
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ImageContainer>
                <Image src={image.src} alt={image.name} />
                <ImageOverlay
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <OverlayButton
                    onClick={() => setSelectedImage(image)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View full size"
                  >
                    <FontAwesomeIcon icon={faExpand} />
                  </OverlayButton>
                  
                  {onEdit && (
                    <OverlayButton
                      variant="success"
                      onClick={() => onEdit(image.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit image"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </OverlayButton>
                  )}
                  
                  {onDelete && (
                    <OverlayButton
                      variant="danger"
                      onClick={() => onDelete(image.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete image"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </OverlayButton>
                  )}
                </ImageOverlay>
              </ImageContainer>

              <ImageInfo>
                <ImageTitle>{image.name}</ImageTitle>
                <ImageMeta>
                  <span>
                    <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '0.25rem' }} />
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </span>
                  <span>{(image.size / 1024 / 1024).toFixed(2)}MB</span>
                </ImageMeta>
                
                {image.description && (
                  <ImageDescription>{image.description}</ImageDescription>
                )}

                {/* Progress Photo Stats */}
                {uploadType === 'progress' && (image.weight || image.bodyFat) && (
                  <ProgressStats>
                    {image.weight && (
                      <StatItem>
                        <StatLabel>
                          <FontAwesomeIcon icon={faWeight} />
                          Weight
                        </StatLabel>
                        <StatValue>{image.weight} lbs</StatValue>
                      </StatItem>
                    )}
                    {image.bodyFat && (
                      <StatItem>
                        <StatLabel>
                          <FontAwesomeIcon icon={faDumbbell} />
                          Body Fat
                        </StatLabel>
                        <StatValue>{image.bodyFat}%</StatValue>
                      </StatItem>
                    )}
                  </ProgressStats>
                )}
              </ImageInfo>
            </ImageComponent>
          ))}
        </AnimatePresence>
      </ImageGrid>
    );
  };

  return (
    <ImageUploadContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>
        {title}
      </h3>

      {renderUploadZone()}
      {renderImageGrid()}

      {/* Full Size Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <ModalContent
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalClose onClick={() => setSelectedImage(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </ModalClose>
              <ModalImage src={selectedImage.src} alt={selectedImage.name} />
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </ImageUploadContainer>
  );
};

// Preset Components
export const ProfilePictureUpload = ({ currentImage, onUpload, onDelete }) => (
  <ImageUpload
    images={currentImage ? [currentImage] : []}
    onUpload={onUpload}
    onDelete={onDelete}
    maxFiles={1}
    uploadType="profile"
    title="Profile Picture"
    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
    maxFileSize={2 * 1024 * 1024} // 2MB for profile pictures
  />
);

export const ProgressPhotos = ({ photos, onUpload, onDelete, onEdit }) => (
  <ImageUpload
    images={photos}
    onUpload={onUpload}
    onDelete={onDelete}
    onEdit={onEdit}
    maxFiles={20}
    uploadType="progress"
    title="Progress Photos"
    showGrid={true}
  />
);

export default ImageUpload;
