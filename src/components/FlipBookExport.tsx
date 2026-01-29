interface Page {
  id: string;
  name: string;
  content: any;
  order: number;
  type: 'cover' | 'content' | 'back_cover';
}

interface FlipBookExportProps {
  pages: Page[];
  currentPageIndex: number;
  currentValues: any;
  templateSubject?: string;
}

export const generateFlipBookHtml = ({
  pages,
  currentPageIndex,
  templateSubject
}: Omit<FlipBookExportProps, 'currentValues'>): string => {
  // Use pages as-is since convertToMagazinePages already provides the correct content
  const allPages = [...pages];

  // Calculate scale factor for flipbook display dynamically
  // This will be calculated based on the actual flipbook dimensions
  let scaleFactor = 0.6; // Default fallback
  
  // We'll calculate the actual scale factor in the JavaScript initialization
  // and store it globally for the HTML generation to use

  // Direct HTML rendering for flipbook elements with scaling
  const renderFlipbookElements = (pageContent: any): string => {
    if (!pageContent) return '';
    
    // Handle both MJML-like structure and direct element array
    let elements = [];
    if (pageContent.children && Array.isArray(pageContent.children)) {
      // MJML-like structure
      elements = pageContent.children;
    } else if (Array.isArray(pageContent)) {
      // Direct element array
      elements = pageContent;
    } else {
      return '';
    }
    
    return elements.map((element: any) => {
      // Handle both MJML-like structure and direct element
      let elementData = element;
      if (element.attributes) {
        // MJML-like structure - convert to direct element format
        elementData = {
          type: element.type,
          ...element.attributes
        };
      }
      
      // Apply scaling to all coordinates and sizes
      const scaledX = Math.round((elementData.x || 0) * scaleFactor);
      const scaledY = Math.round((elementData.y || 0) * scaleFactor);
      const scaledWidth = Math.round((elementData.width || 200) * scaleFactor);
      const scaledHeight = Math.round((elementData.height || 150) * scaleFactor);
      const scaledFontSize = Math.round((elementData.fontSize || 16) * scaleFactor);
      
      switch (elementData.type) {
        case 'text':
          // Show empty text boxes with a subtle border instead of hiding them
          const isEmpty = !elementData.content || elementData.content.trim() === '';
          const borderStyle = isEmpty ? '1px dashed #ccc' : 'none';
          const bgColor = isEmpty ? '#f9f9f9' : 'transparent';
          const content = elementData.content || (isEmpty ? '<span style="color: #999;">Empty text</span>' : '');
          return `<div style="position: absolute; left: ${scaledX}px; top: ${scaledY}px; width: ${scaledWidth}px; height: ${scaledHeight}px; font-size: ${scaledFontSize}px; color: ${elementData.color || '#000'}; font-family: ${elementData.fontFamily || 'Arial, sans-serif'}; font-weight: ${elementData.fontWeight || 'normal'}; text-align: ${elementData.textAlign || 'left'}; line-height: ${elementData.lineHeight || 1.5}; white-space: pre-wrap; border: ${borderStyle}; background-color: ${bgColor}; min-height: 20px; z-index: 10;">${content}</div>`;
        
        case 'image':
          return `<img src="${elementData.src || 'https://via.placeholder.com/200x150'}" alt="${elementData.alt || 'Image'}" style="position: absolute; left: ${scaledX}px; top: ${scaledY}px; width: ${scaledWidth}px; height: ${scaledHeight}px; border-radius: ${elementData.borderRadius || 0}px; object-fit: ${elementData.objectFit || 'cover'}; z-index: 10;" />`;
        
        case 'button':
          return `<button style="position: absolute; left: ${scaledX}px; top: ${scaledY}px; width: ${scaledWidth}px; height: ${scaledHeight}px; background: ${elementData.backgroundColor || '#1890ff'}; color: ${elementData.textColor || 'white'}; font-size: ${elementData.fontSize || 14}px; font-weight: ${elementData.fontWeight || 'normal'}; border: none; border-radius: ${elementData.borderRadius || 4}px; padding: ${elementData.padding || 10}px; z-index: 10; cursor: pointer; display: flex; align-items: center; justify-content: center;">${elementData.text || 'Button'}</button>`;
        
        case 'divider':
          return `<hr style="position: absolute; left: ${scaledX}px; top: ${scaledY}px; width: ${scaledWidth}px; height: ${scaledHeight}px; border: none; border-bottom: 1px ${elementData.style || 'solid'} ${elementData.color || '#ddd'}; z-index: 10;" />`;
        
        case 'video':
          return `<video src="${elementData.src || ''}" poster="${elementData.poster || ''}" controls playsinline style="position: absolute; left: ${scaledX}px; top: ${scaledY}px; width: ${scaledWidth}px; height: ${scaledHeight}px; object-fit: cover; z-index: 10;">Your browser does not support the video tag.</video>`;
        
        case 'audio':
          return `<audio src="${elementData.src || ''}" controls style="position: absolute; left: ${scaledX}px; top: ${scaledY}px; width: ${scaledWidth}px; z-index: 10;">Your browser does not support the audio tag.</audio>`;
        
        case 'spacer':
          return `<div style="position: absolute; left: ${scaledX}px; top: ${scaledY}px; width: ${scaledWidth}px; height: ${scaledHeight}px; z-index: 10;"></div>`;
        
        default:
          return '';
      }
    }).join('');
  };

  // Convert all pages to HTML slides
  const slides = allPages
    .map((page, index) => {
      const isCover = page.type === "cover" || page.type === "back_cover";
      const pageContent = renderFlipbookElements(page.content);

      return `
      <!-- ${page.name} -->
      <div class="page ${isCover ? "--cover" : ""}" ${isCover ? 'data-density="hard"' : ""}>
        <div class="page-content">
          ${pageContent || '<div style="text-align: center; padding: 50px; color: #666;">Empty Page</div>'}
        </div>
        <div class="page-footer">
          ${index + 1}
        </div>
      </div>`;
    })
    .join("\n");

  // NOTE: The complete HTML with all features (search, zoom, fullscreen) will be added below
  // This is extracted from the original git version to preserve all functionality

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateSubject || "Magazine"}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #525659;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      height: 50px;
      background: rgba(82, 86, 89, 0.95);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 0 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .toolbar-btn {
      background: transparent;
      border: none;
      color: #e8eaed;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      font-size: 16px;
    }

    .toolbar-btn:hover {
      background: rgba(255,255,255,0.1);
    }

    .toolbar-btn:active {
      background: rgba(255,255,255,0.2);
    }

    .zoom-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.1);
      padding: 4px 8px;
      border-radius: 4px;
    }

    .zoom-slider {
      width: 100px;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      outline: none;
    }

    .zoom-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
      cursor: pointer;
    }

    .zoom-slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }

    .page-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #e8eaed;
      min-width: 80px;
      justify-content: center;
    }

    .page-current {
      font-weight: 600;
      color: #fff;
    }

    .page-total {
      color: rgba(255,255,255,0.6);
    }

    .search-wrapper {
      position: relative;
    }

    .search-input {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      width: 200px;
      outline: none;
    }

    .search-input:focus {
      background: rgba(255,255,255,0.15);
      border-color: rgba(255,255,255,0.4);
    }

    .search-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      font-size: 14px;
    }

    .search-sidebar {
      position: fixed;
      right: -320px;
      top: 50px;
      width: 320px;
      height: calc(100vh - 50px);
      background: rgba(60, 64, 67, 0.98);
      backdrop-filter: blur(10px);
      box-shadow: -2px 0 8px rgba(0,0,0,0.3);
      transition: right 0.3s ease;
      overflow-y: auto;
      padding: 20px;
      z-index: 1000;
    }

    .search-sidebar.active {
      right: 0;
    }

    .close-search {
      display: inline-block;
      cursor: pointer;
      color: #999;
      font-size: 13px;
      margin-bottom: 20px;
      padding: 6px 0;
      transition: color 0.2s;
    }

    .close-search:hover {
      color: #fff;
    }

    .search-result-item {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 10px;
      cursor: pointer;
      background: rgba(255,255,255,0.05);
      transition: background 0.2s;
    }

    .search-result-item:hover {
      background: rgba(255,255,255,0.1);
    }

    .result-page {
      font-size: 11px;
      color: #999;
      margin-bottom: 6px;
    }

    .result-snippet {
      font-size: 13px;
      line-height: 1.5;
      color: #e8eaed;
    }

    .result-snippet mark {
      background: rgba(255, 255, 0, 0.4);
      color: #fff;
      padding: 2px 4px;
      border-radius: 2px;
    }

    .no-results {
      text-align: center;
      color: #999;
      padding: 40px 20px;
      font-size: 14px;
    }

    .mag-highlight {
      background: rgba(255, 255, 0, 0.4);
      padding: 2px 4px;
      border-radius: 2px;
    }

    body.search-open .stage {
      margin-right: 320px;
    }

    .stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      transition: margin-right 0.3s ease;
    }

    .zoom-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    #loading {
      font-size: 18px;
      color: rgba(255,255,255,0.7);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .loader {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    #book {
      display: none;
      transition: transform 0.3s ease;
    }

    .flip-book {
    }

    .page {
      width: 100%;
      height: 100%;
      background: white;
      color: #000;
      position: relative;
      overflow: hidden;
    }

    .page-content {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      padding: 20px;
      position: relative;
    }
    
    /* Scale elements to match editor coordinates */
    .page-content > div,
    .page-content > img,
    .page-content > button,
    .page-content > hr {
      transform-origin: top left;
    }
    
    .page-footer {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: #666;
      text-align: center;
      z-index: 20;
    }
    
    .page-content::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30px;
      background: linear-gradient(transparent, rgba(255,255,255,0.9));
      pointer-events: none;
      z-index: 10;
    }
    
    /* Force columns to stay side-by-side */
    .page-content table[class*="mj-column"] {
      display: inline-block !important;
      vertical-align: top !important;
      max-width: 100% !important;
    }
    
    .page-content div[class*="mj-column-per-"] {
      display: inline-block !important;
      vertical-align: top !important;
      max-width: 100% !important;
    }
    
    /* Ensure proper column alignment */
    .page-content table[class*="mj-column-per-50"] {
      width: 48% !important;
      margin: 0 1% !important;
    }
    
    .page-content table[class*="mj-column-per-33"] {
      width: 31% !important;
      margin: 0 1% !important;
    }
    
    .page-content table[class*="mj-column-per-25"] {
      width: 23% !important;
      margin: 0 1% !important;
    }
    
    .page-content table[class*="mj-column-per-66"] {
      width: 65% !important;
      margin: 0 1% !important;
    }
    
    .page-content table[class*="mj-column-per-75"] {
      width: 74% !important;
      margin: 0 1% !important;
    }
    
    /* Fix text and image alignment */
    .page-content td {
      vertical-align: top !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
    }
    
    .page-content img {
      max-width: 100% !important;
      height: auto !important;
      display: block !important;
    }
    
    /* Ensure proper text flow */
    .page-content p {
      margin: 0 0 10px 0 !important;
      line-height: 1.4 !important;
    }
    
    .page-content div {
      box-sizing: border-box !important;
    }
    
    /* Add gradient fade at bottom */
    div[class*="editor-container"] > div::after,
    div[class*="visual-editor"] > div::after,
    .easy-email-editor-visual-editor > div::after,
    .easy-email-editor-render-wrapper > div::after,
    .easy-email-editor-preview-content > div::after,
    .easy-email-editor-email-render > div::after {
       content: "";
       position: absolute;
       bottom: 0;
       left: 0;
       right: 0;
       height: 30px;
       background: linear-gradient(transparent, rgba(255,255,255,0.9));
       pointer-events: none;
       z-index: 10;
    }

    /* Hide gradient when content is within limits */
    div[class*="editor-container"].height-ok > div::after,
    div[class*="visual-editor"].height-ok > div::after,
    .easy-email-editor-visual-editor.height-ok > div::after,
    .easy-email-editor-render-wrapper.height-ok > div::after,
    .easy-email-editor-preview-content.height-ok > div::after,
    .easy-email-editor-email-render.height-ok > div::after {
       display: none;
    }

    /* Add page number */
    div[class*="editor-container"]::before,
    div[class*="visual-editor"]::before,
    .easy-email-editor-visual-editor::before,
    .easy-email-editor-render-wrapper::before,
    .easy-email-editor-preview-content::before,
    .easy-email-editor-email-render::before {
       content: "${currentPageIndex + 1}";
       position: absolute;
       bottom: 15px;
       right: 20px;
       width: auto;
       text-align: center;
       font-size: 12px;
       color: #666;
       font-family: Arial, sans-serif;
       z-index: 100;
       pointer-events: none;
    }

    div[class*="editor-container"].height-warning,
    div[class*="visual-editor"].height-warning {
       border-color: #faad14 !important;
       box-shadow: 0 10px 30px rgba(250, 173, 20, 0.2) !important;
    }

    div[class*="editor-container"].height-danger,
    div[class*="visual-editor"].height-danger {
       border-color: #ff4d4f !important;
       box-shadow: 0 10px 30px rgba(255, 77, 79, 0.3) !important;
    }
    
    /* Ensure columns don't stack on small screens */
    @media (max-width: 768px) {
      .page-content table[class*="mj-column"],
      .page-content div[class*="mj-column-per-"] {
        display: block !important;
        width: 100% !important;
        margin: 0 0 10px 0 !important;
      }
    }
  </style>
</head>
<body id="bodyRoot">
  <div class="toolbar">
    <button class="toolbar-btn" onclick="pageFlip.prev()" title="Previous Page">
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="page-info">
      <span class="page-current" id="pageDisplay">1</span>
      <span class="page-total">/ <span id="totalPages">1</span></span>
    </div>

    <button class="toolbar-btn" onclick="pageFlip.next()" title="Next Page">
      <i class="fas fa-chevron-right"></i>
    </button>

    <div class="zoom-wrapper">
      <button class="toolbar-btn" onclick="updateZoom(50)" title="Zoom Out">
        <i class="fas fa-search-minus"></i>
      </button>
      <input type="range" class="zoom-slider" id="zoomSlider" min="50" max="200" value="100" oninput="updateZoom(this.value)">
      <button class="toolbar-btn" onclick="updateZoom(200)" title="Zoom In">
        <i class="fas fa-search-plus"></i>
      </button>
    </div>

    <div class="search-wrapper">
      <input type="text" class="search-input" id="searchInput" placeholder="Search in magazine..." onkeypress="if(event.key === 'Enter') performSearch()">
      <i class="fas fa-search search-icon" onclick="performSearch()"></i>
    </div>

    <button class="toolbar-btn" onclick="toggleFullscreen()" title="Toggle Fullscreen">
      <i class="fas fa-expand"></i>
    </button>

    <button class="toolbar-btn" onclick="shareMagazine()" title="Share Magazine">
      <i class="fas fa-share-alt"></i>
    </button>
  </div>

  <div class="search-sidebar" id="searchSidebar">
    <div class="close-search" onclick="toggleSearch(false)">
      <i class="fas fa-times"></i> Close Search
    </div>
    <div id="searchResults">
      <div class="no-results">Results will appear here</div>
    </div>
  </div>

  <div class="stage">
    <div id="loading">
      <div class="loader"><i class="fas fa-spinner"></i></div>
    </div>

    <div class="zoom-wrapper" id="zoomWrapper">
      <div id="book" class="flip-book">
${slides}
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/page-flip/dist/js/page-flip.browser.js"></script>
  <script>
    let pageFlip;
    let totalPages = 0;
    let currentScale = 1;
    let initialBookWidth = 0;
    let initialBookHeight = 0;

    document.addEventListener('DOMContentLoaded', function() {
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight - 50;
        
        // Use the exact same dimensions as the editor: 800x1000
        // Calculate the maximum size that fits the screen while maintaining aspect ratio
        const aspectRatio = 800 / 1000; // 0.8
        
        let maxWidth = availableWidth * 0.45; // Each page gets 45% of screen width
        let maxHeight = availableHeight * 0.85; // Max 85% of screen height
        
        // Start with full editor dimensions
        let targetWidth = 800;
        let targetHeight = 1000;
        
        // Scale down if too tall for screen
        if (targetHeight > maxHeight) {
            const scale = maxHeight / targetHeight;
            targetWidth = targetWidth * scale;
            targetHeight = maxHeight;
        }
        
        // Scale down if too wide for screen
        if (targetWidth > maxWidth) {
            const scale = maxWidth / targetWidth;
            targetWidth = maxWidth;
            targetHeight = targetHeight * scale;
        }
        
        initialBookWidth = targetWidth;
        initialBookHeight = targetHeight;
        
        // Calculate the actual scale factor for HTML generation
        const actualScaleFactor = initialBookWidth / 800;
        
        // Store scale factor globally for HTML elements to use
        window.flipbookScaleFactor = actualScaleFactor;

        pageFlip = new St.PageFlip(document.getElementById('book'), {
            width: initialBookWidth, 
            height: initialBookHeight,
            size: "fixed",
            minWidth: 200,
            maxWidth: 1600,
            minHeight: 300,
            maxHeight: 2000,
            maxShadowOpacity: 0.5,
            showCover: true,
            usePortrait: false,
            startPage: 0,
            mobileScrollSupport: false
        });

        // Load pages and apply dynamic scaling
        const pages = document.querySelectorAll('.page');
        totalPages = pages.length;
        
        // Apply the correct scale factor to all positioned elements
        pages.forEach((page, index) => {
            const pageContent = page.querySelector('.page-content');
            if (pageContent) {
                const elements = pageContent.querySelectorAll('div[style*="position: absolute"], img[style*="position: absolute"], button[style*="position: absolute"], hr[style*="position: absolute"]');
                elements.forEach(element => {
                    const style = element.getAttribute('style');
                    if (style) {
                        // Re-scale all position values using the actual scale factor
                        let scaledStyle = style;
                        scaledStyle = scaledStyle.replace(/left:\s*(\d+)px/g, function(match, value) {
                            return 'left: ' + Math.round(parseInt(value) * actualScaleFactor) + 'px';
                        });
                        scaledStyle = scaledStyle.replace(/top:\s*(\d+)px/g, function(match, value) {
                            return 'top: ' + Math.round(parseInt(value) * actualScaleFactor) + 'px';
                        });
                        scaledStyle = scaledStyle.replace(/width:\s*(\d+)px/g, function(match, value) {
                            return 'width: ' + Math.round(parseInt(value) * actualScaleFactor) + 'px';
                        });
                        scaledStyle = scaledStyle.replace(/height:\s*(\d+)px/g, function(match, value) {
                            return 'height: ' + Math.round(parseInt(value) * actualScaleFactor) + 'px';
                        });
                        scaledStyle = scaledStyle.replace(/font-size:\s*(\d+)px/g, function(match, value) {
                            return 'font-size: ' + Math.round(parseInt(value) * actualScaleFactor) + 'px';
                        });
                        element.setAttribute('style', scaledStyle);
                    }
                });
            }
        });
        
        pageFlip.loadFromHTML(pages);
        
        // Initialize video and audio elements
        const videos = document.querySelectorAll('video');
        const audios = document.querySelectorAll('audio');
        
        videos.forEach(video => {
            // Ensure videos have proper attributes for playback
            if (!video.hasAttribute('controls')) {
                video.setAttribute('controls', '');
            }
            
            // Add event listeners for debugging
            video.addEventListener('loadstart', () => console.log('Video loading started'));
            video.addEventListener('canplay', () => console.log('Video can play'));
            video.addEventListener('error', (e) => console.log('Video error:', e));
            
            // Try to load the video
            video.load();
        });
        
        audios.forEach(audio => {
            // Ensure audios have proper attributes for playback
            if (!audio.hasAttribute('controls')) {
                audio.setAttribute('controls', '');
            }
            
            // Add event listeners for debugging
            audio.addEventListener('loadstart', () => console.log('Audio loading started'));
            audio.addEventListener('canplay', () => console.log('Audio can play'));
            audio.addEventListener('error', (e) => console.log('Audio error:', e));
            
            // Try to load the audio
            audio.load();
        });
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('book').style.display = 'block';

        pageFlip.on('flip', (e) => {
           updatePageDisplay(e.data);
        });
        
        updatePageDisplay(0);
    });

    function updatePageDisplay(index) {
       document.getElementById('totalPages').innerText = totalPages;
       
       let displayText;
       if (index === 0) {
           displayText = '1';
       } else if (index === totalPages - 1) {
           displayText = totalPages;
       } else {
           const leftPage = index + 1;
           const rightPage = index + 2;
           if (rightPage <= totalPages) {
               displayText = leftPage + '-' + rightPage;
           } else {
               displayText = leftPage;
           }
       }
       
       document.getElementById('pageDisplay').innerText = displayText;
    }

    function toggleSearch(show) {
      const sidebar = document.getElementById('searchSidebar');
      const body = document.getElementById('bodyRoot');
      if (show) {
        sidebar.classList.add('active');
        body.classList.add('search-open');
      } else {
        sidebar.classList.remove('active');
        body.classList.remove('search-open');
        clearHighlights();
      }
    }

    function clearHighlights() {
      const highlights = document.querySelectorAll('.mag-highlight');
      highlights.forEach(h => {
        h.outerHTML = h.innerHTML;
      });
    }

    function highlightTextInElement(element, query) {
      if (!query) return;
      const nodes = Array.from(element.childNodes);
      nodes.forEach(node => {
        if (node.nodeType === 3) {
          const text = node.nodeValue;
          const pos = text.toLowerCase().indexOf(query.toLowerCase());
          if (pos !== -1) {
            const span = document.createElement('span');
            span.className = 'mag-highlight';
            
            const before = text.substring(0, pos);
            const mid = text.substring(pos, pos + query.length);
            const after = text.substring(pos + query.length);
            
            node.nodeValue = before;
            span.innerText = mid;
            node.parentNode.insertBefore(span, node.nextSibling);
            const afterNode = document.createTextNode(after);
            span.parentNode.insertBefore(afterNode, span.nextSibling);
          }
        } else if (node.nodeType === 1 && node.childNodes.length > 0) {
          highlightTextInElement(node, query);
        }
      });
    }

    function performSearch() {
      const query = document.getElementById('searchInput').value.trim().toLowerCase();
      const resultsContainer = document.getElementById('searchResults');
      
      if (!query) return;
      
      toggleSearch(true);
      clearHighlights();
      resultsContainer.innerHTML = '';
      
      const pages = document.querySelectorAll('.page');
      let matches = 0;
      
      pages.forEach((page, index) => {
        const text = page.innerText || "";
        const pos = text.toLowerCase().indexOf(query);
        
        if (pos !== -1) {
          matches++;
          
          const start = Math.max(0, pos - 40);
          const end = Math.min(text.length, pos + query.length + 80);
          let snippet = text.substring(start, end);
          
          const regex = new RegExp("(" + query + ")", "gi");
          snippet = snippet.replace(regex, '<mark>$1</mark>');
          
          const resultItem = document.createElement('div');
          resultItem.className = 'search-result-item';
          resultItem.innerHTML = \`
            <div class="result-page">p.\${index + 1}</div>
            <div class="result-snippet">...\${snippet}...</div>
          \`;
          resultItem.onclick = () => {
            pageFlip.flip(index);
            setTimeout(() => {
              clearHighlights();
              const targetPage = document.querySelectorAll('.page')[index];
              highlightTextInElement(targetPage, query);
            }, 600);
          };
          resultsContainer.appendChild(resultItem);
        }
      });
      
      if (matches === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No matches found for "' + query + '"</div>';
      }
    }

    function updateZoom(value) {
       currentScale = value / 100;
       document.getElementById('book').style.transform = 'scale(' + currentScale + ')';
    }

    function toggleFullscreen() {
       if (!document.fullscreenElement) {
           document.documentElement.requestFullscreen();
       } else {
           document.exitFullscreen();
       }
    }

    function shareMagazine() {
       if (navigator.share) {
           navigator.share({
               title: document.title,
               url: window.location.href
           }).catch(() => {});
       } else {
           const dummy = document.createElement('input');
           document.body.appendChild(dummy);
           dummy.value = window.location.href;
           dummy.select();
           document.execCommand('copy');
           document.body.removeChild(dummy);
           alert("Link copied to clipboard!");
       }
    }
  </script>
</body>
</html>`;
};
