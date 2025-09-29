# 🌾 How to Add Your Indian Farmer Images

## Step 1: Upload Your Images
Add your 6 Indian farmer images to the `/src/assets/` folder with these exact names:

1. `farmer-1.jpg` - Elderly farmer with crops
2. `farmer-2.jpg` - Young woman farmer  
3. `farmer-3.jpg` - Traditional plowing with oxen
4. `farmer-4.jpg` - Farmer with spring onions
5. `farmer-5.jpg` - Farmer with wooden stick
6. `farmer-6.jpg` - Farmers with laptop

## Step 2: Uncomment the Imports
Once you've uploaded the images, uncomment these lines in `src/components/HeroSection.tsx`:

```typescript
import farmer1 from '@/assets/farmer-1.jpg';
import farmer2 from '@/assets/farmer-2.jpg';
import farmer3 from '@/assets/farmer-3.jpg';
import farmer4 from '@/assets/farmer-4.jpg';
import farmer5 from '@/assets/farmer-5.jpg';
import farmer6 from '@/assets/farmer-6.jpg';
```

## Step 3: Update the Image Sources
Replace the current image sources in the background grid with:

```typescript
// Replace these lines in the background grid:
src={farmer1}  // for elderly farmer
src={farmer2}  // for young woman farmer
src={farmer3}  // for traditional plowing
src={farmer4}  // for farmer with spring onions
src={farmer5}  // for farmer with wooden stick
src={farmer6}  // for farmers with laptop
```

## Step 4: Update Testimonials
In `src/components/TestimonialsSection.tsx`, you can also use your farmer images:

```typescript
import farmer1 from '@/assets/farmer-1.jpg';
import farmer2 from '@/assets/farmer-2.jpg';
import farmer5 from '@/assets/farmer-5.jpg';
```

## Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 400x600px or similar aspect ratio
- **File size**: Under 500KB each for optimal loading
- **Quality**: High resolution for crisp display

## Current Status
✅ Code is ready to use your images
✅ Fallback images are working
⏳ Waiting for you to upload the actual farmer images

Once you upload the images, the homepage will display your beautiful Indian farmer photos in the background!
