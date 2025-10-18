import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// This is now empty as the hero image is directly in the component.
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages.filter(img => img.id !== 'hero');
