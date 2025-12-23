import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { pathToRoot } from "../util/path"

export default (() => {
  const AllImagesGallery: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    // Check if this is the all-images page or a family images page
    const isAllImagesPage = fileData.slug === "pages/all-images"
    const isFamilyImagesPage = fileData.slug?.startsWith("pages/family-") && fileData.slug?.endsWith("-images")
    
    if (!isAllImagesPage && !isFamilyImagesPage) {
      return null
    }

    // Get base path for this page (relative path to root)
    const basePath = pathToRoot(fileData.slug!)
    
    // Get family tree name if this is a family page
    const familyTreeName = isFamilyImagesPage 
      ? fileData.slug?.replace("pages/family-", "").replace("-images", "")
      : null

    return (
      <div 
        class={classNames(displayClass, "all-images-gallery")} 
        id="all-images-gallery-wrapper" 
        data-base-path={basePath}
        data-family-tree={familyTreeName || ""}
      >
        <div id="all-images-gallery-container">
          <div class="loading-message">
            {isAllImagesPage ? "Loading all images..." : `Loading images from ${familyTreeName}...`}
          </div>
        </div>
      </div>
    )
  }

  AllImagesGallery.css = `
.all-images-gallery {
  margin: 2rem 0;
}

.all-images-gallery .loading-message,
.all-images-gallery .empty-message {
  text-align: center;
  padding: 3rem;
  background: var(--light);
  border-radius: 8px;
  color: var(--gray);
  font-size: 1.1rem;
}

/* Gallery grid with 4 columns - High specificity to override ProfileTabs */
#all-images-gallery-wrapper .gallery-grid,
#all-images-gallery-container .gallery-grid,
.all-images-gallery .gallery-grid,
div.all-images-gallery .gallery-grid {
  column-count: 4 !important;
  column-gap: 0.75rem !important;
  padding: 0 !important;
  margin-top: 1rem !important;
  break-inside: avoid !important;
  -webkit-column-count: 4 !important;
  -moz-column-count: 4 !important;
}

.all-images-gallery .gallery-item {
  display: inline-block !important;
  width: 100% !important;
  vertical-align: top !important;
  border-radius: 0 !important;
  overflow: visible !important;
  background: transparent !important;
  transition: transform 0.2s ease !important;
  margin: 0 0 0.75rem 0 !important;
  cursor: pointer !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
  
  &:hover {
    transform: scale(1.01) !important;
    z-index: 10 !important;
  }
  
  img {
    width: 100% !important;
    height: auto !important;
    cursor: pointer !important;
    background: white !important;
    display: block !important;
    border: 2px solid #333 !important;
    border-radius: 4px 4px 0 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    padding: 0 !important;
    margin: 0 !important;
    object-fit: contain !important;
    max-width: 100% !important;
    content-visibility: auto !important;
  }
  
  .image-caption {
    padding: 0.35rem 0.5rem !important;
    font-size: 0.85rem !important;
    line-height: 1.3 !important;
    background: #ffffff !important;
    margin: 0 !important;
    border: 1px solid #e1e4e8 !important;
    border-top: none !important;
    border-radius: 0 0 4px 4px !important;
    text-align: left !important;
    color: #666 !important;
    
    a {
      color: #0066cc !important;
      text-decoration: underline !important;
      
      &:hover {
        text-decoration: none !important;
        color: #0052a3 !important;
      }
    }
  }
}

/* Responsive: 2 columns on tablets and mobile */
@media (max-width: 1024px) {
  #all-images-gallery-wrapper .gallery-grid,
  .all-images-gallery .gallery-grid,
  div.all-images-gallery .gallery-grid {
    column-count: 2 !important;
  }
}

@media (max-width: 768px) {
  #all-images-gallery-wrapper .gallery-grid,
  .all-images-gallery .gallery-grid,
  div.all-images-gallery .gallery-grid {
    column-count: 2 !important;
  }
}
`

  AllImagesGallery.afterDOMLoaded = `
(function() {
  function loadAllImages() {
    const container = document.getElementById('all-images-gallery-container');
    if (!container) {
      console.log('[AllImagesGallery] Container not found');
      return;
    }
    
    const galleryElement = document.querySelector('.all-images-gallery');
    let pageBasePath = galleryElement ? galleryElement.getAttribute('data-base-path') || '' : '';
    if (pageBasePath && !pageBasePath.endsWith('/')) {
      pageBasePath = pageBasePath + '/';
    }
    
    // Get family tree name if this is a family page
    const familyTreeName = galleryElement ? galleryElement.getAttribute('data-family-tree') || '' : '';
    const isFamilyPage = familyTreeName !== '';
    
    // Load both media-index.json and family-trees.json
    Promise.all([
      fetch(pageBasePath + 'static/media-index.json')
        .then(function(response) {
          if (!response.ok) throw new Error('No media index');
          return response.json();
        }),
      isFamilyPage 
        ? fetch(pageBasePath + 'static/family-trees.json')
            .then(function(response) {
              if (!response.ok) throw new Error('No family trees index');
              return response.json();
            })
        : Promise.resolve(null)
    ])
    .then(function([mediaData, familyTreesData]) {
      // Get list of profile IDs to include
      let profileIdsToInclude = null;
      if (isFamilyPage && familyTreesData) {
        // Find the family tree
        // familyTreeName comes from slug (e.g., "aron-zits"), but JSON keys use underscores (e.g., "aron_zits")
        let familyKey = familyTreeName.replace(/-/g, '_');  // Convert dashes to underscores
        console.log('[AllImagesGallery] Looking for family key:', familyKey);
        console.log('[AllImagesGallery] Available keys:', Object.keys(familyTreesData));
        
        if (!(familyKey in familyTreesData)) {
          // Try with .ged extension
          familyKey = familyTreeName.replace(/-/g, '_') + '.ged';
          console.log('[AllImagesGallery] Trying with .ged extension:', familyKey);
        }
        
        if (familyKey in familyTreesData) {
          profileIdsToInclude = new Set(familyTreesData[familyKey]);
          console.log('[AllImagesGallery] Found', profileIdsToInclude.size, 'profiles for family:', familyKey);
        } else {
          console.warn('[AllImagesGallery] Family tree not found:', familyTreeName, 'tried:', familyKey);
          container.innerHTML = '<div class="empty-message">Family tree not found: ' + familyTreeName + '</div>';
          return;
        }
      }
      
      console.log('[AllImagesGallery] isFamilyPage:', isFamilyPage, 'profileIdsToInclude:', profileIdsToInclude ? profileIdsToInclude.size : 'null');
      
      // Collect images from relevant profiles
      const allImages = [];
      const seenPaths = new Set(); // Track unique image paths
      let skippedProfiles = 0;
      let includedProfiles = 0;
      
      for (const profileId in mediaData.images) {
        // Skip if this is a family page and profile is not in the family
        if (profileIdsToInclude && !profileIdsToInclude.has(profileId)) {
          skippedProfiles++;
          continue;
        }
        
        includedProfiles++;
        const images = mediaData.images[profileId] || [];
        for (const img of images) {
          // Build the image path
          let imagePath;
          if (img.path) {
            imagePath = pageBasePath + (img.path.startsWith('/') ? img.path.substring(1) : img.path);
          } else {
            imagePath = pageBasePath + 'static/documents/' + profileId + '/' + img.filename;
          }
          
          // Only add if we haven't seen this path before
          if (!seenPaths.has(imagePath)) {
            seenPaths.add(imagePath);
            allImages.push({
              path: imagePath,
              caption: img.caption || '',
              filename: img.filename || ''
            });
          }
        }
      }
      
      console.log('[AllImagesGallery] Found', allImages.length, 'images' + (isFamilyPage ? ' for family ' + familyTreeName : ''));
      console.log('[AllImagesGallery] Included profiles:', includedProfiles, 'Skipped profiles:', skippedProfiles);
        
        if (allImages.length === 0) {
          container.innerHTML = '<div class="empty-message">No images available</div>';
          return;
        }
        
        // Create gallery grid
        container.innerHTML = '<div class="gallery-grid" id="all-images-gallery-grid"></div>';
        const galleryGrid = container.querySelector('.gallery-grid');
        
        // Force 4 columns via inline style to override any conflicting CSS
        if (galleryGrid) {
          // Check window width for responsive behavior
          const width = window.innerWidth;
          if (width > 1024) {
            galleryGrid.style.setProperty('column-count', '4', 'important');
          } else if (width > 768) {
            galleryGrid.style.setProperty('column-count', '2', 'important');
          } else {
            galleryGrid.style.setProperty('column-count', '2', 'important');
          }
        }
        
        // Render all images
        allImages.forEach(function(img) {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          
          const imageAlt = img.caption ? img.caption.replace(/<[^>]*>/g, '') : '';
          const newlineChar = String.fromCharCode(10);
          let formattedCaption = img.caption ? img.caption.split(newlineChar).join('<br>') : '';
          
          // Fix profile links in caption to include base path
          var basePathForLinks = pageBasePath;
          if (basePathForLinks && basePathForLinks.endsWith('/')) {
            basePathForLinks = basePathForLinks.substring(0, basePathForLinks.length - 1);
          }
          
          if (formattedCaption && basePathForLinks) {
            var linkPattern = new RegExp('href="(\\\\/profiles\\\\/[^"]+)"', 'g');
            formattedCaption = formattedCaption.replace(linkPattern, function(match, path) {
              return 'href="' + basePathForLinks + path + '"';
            });
          }
          
          // Create image element
          const imgElement = document.createElement('img');
          imgElement.src = img.path;
          imgElement.alt = imageAlt;
          
          item.appendChild(imgElement);
          if (formattedCaption) {
            const captionDiv = document.createElement('div');
            captionDiv.className = 'image-caption';
            captionDiv.innerHTML = formattedCaption;
            item.appendChild(captionDiv);
          }
          
          // Click to open full size
          item.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() === 'a') {
              return;
            }
            window.open(img.path, '_blank');
          });
          
          galleryGrid.appendChild(item);
        });
        
        // Add resize listener to update column count responsively
        function updateColumnCount() {
          const grid = document.querySelector('#all-images-gallery-wrapper .gallery-grid') || 
                       document.querySelector('.all-images-gallery .gallery-grid');
          if (grid) {
            const width = window.innerWidth;
            if (width > 1024) {
              grid.style.setProperty('column-count', '4', 'important');
            } else if (width > 768) {
              grid.style.setProperty('column-count', '2', 'important');
            } else {
              grid.style.setProperty('column-count', '2', 'important');
            }
          }
        }
        
        // Update on window resize (with debounce)
        let resizeTimeout;
        window.addEventListener('resize', function() {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(updateColumnCount, 100);
        });
      })
      .catch(function(err) {
        console.log('[AllImagesGallery] Error loading images:', err);
        const container = document.getElementById('all-images-gallery-container');
        if (container) {
          container.innerHTML = '<div class="empty-message">Error loading images</div>';
        }
      });
  }
  
  // Load on initial page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllImages);
  } else {
    loadAllImages();
  }
  
  // Also load on SPA navigation
  document.addEventListener('nav', loadAllImages);
})();
`

  return AllImagesGallery
}) satisfies QuartzComponentConstructor

