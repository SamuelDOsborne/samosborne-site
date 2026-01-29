# Signature Keynotes Section - Implementation Guide
## Sam Osborne Website Integration

---

## 📦 Files Included

1. **keynotes-section.html** - Complete standalone page (for testing)
2. **keynotes-html-section.html** - HTML section only (for integration)
3. **keynotes-styles.css** - Stylesheet
4. **keynotes-carousel.js** - JavaScript for testimonial carousel
5. **IMPLEMENTATION-GUIDE.md** - This file

---

## 🚀 Quick Start: 3-Step Integration

### Step 1: Add Google Fonts
Add this to the `<head>` section of your main HTML file (if not already present):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

### Step 2: Link CSS File
Add this to the `<head>` section (after your existing stylesheets):

```html
<link rel="stylesheet" href="css/keynotes-styles.css">
```

### Step 3: Replace Your Current Keynote Section
1. Find your current "Signature Keynote" section in your HTML
2. Replace it entirely with the content from **keynotes-html-section.html**
3. Add the JavaScript file before your closing `</body>` tag:

```html
<script src="js/keynotes-carousel.js"></script>
</body>
```

---

## 📁 File Organization

Recommended file structure:
```
samosborne.net/
├── index.html
├── css/
│   ├── keynotes-styles.css    ← Add this
│   └── (your existing styles)
└── js/
    ├── keynotes-carousel.js   ← Add this
    └── (your existing scripts)
```

---

## 🎨 Design Features

### Desktop View (>968px)
- Two-column side-by-side keynote cards
- Hover effects with subtle lift and gradient line animation
- Full testimonial carousel with quote marks backdrop

### Tablet View (641px - 968px)
- Single-column stacked keynote cards
- Adjusted typography scaling
- Maintained carousel functionality

### Mobile View (<640px)
- Optimized padding and spacing
- Smaller button controls
- Touch-friendly carousel navigation
- Reduced font sizes for readability

---

## 🎯 Key Features

### Testimonial Carousel
- **Auto-rotation**: Changes every 6 seconds
- **Pause on hover**: Stops rotation when user hovers
- **Manual controls**: Previous/Next buttons + dot navigation
- **Keyboard accessible**: Arrow keys for navigation
- **Touch-friendly**: Swipe support on mobile devices

### Visual Effects
- Fade-in animations on scroll
- Gradient accent line on card hover
- Smooth card lift effect
- Professional dark background for testimonials
- Large decorative quote mark in background

---

## ⚙️ Customization Options

### Color Scheme
Edit CSS variables in `keynotes-styles.css`:

```css
:root {
    --primary-dark: #1a1a1a;      /* Main dark color */
    --accent-gold: #c9a961;       /* Gold accent */
    --accent-blue: #2c5f7c;       /* Blue accent */
    --text-gray: #4a4a4a;         /* Body text */
}
```

### Carousel Speed
Edit in `keynotes-carousel.js`:

```javascript
this.autoplayDelay = 6000; // Change to desired milliseconds
```

### Animation Timing
Adjust fade-in delays in CSS:

```css
.keynote-card:nth-child(1) {
    animation-delay: 0.2s;  /* First card */
}
.keynote-card:nth-child(2) {
    animation-delay: 0.4s;  /* Second card */
}
```

---

## 🔧 Integration with Existing Site

### Navigation Anchor
The section includes `id="speaking"` to maintain your navigation:

```html
<section class="keynotes-container" id="speaking">
```

This ensures your menu link to `#speaking` still works.

### Current Section Replacement
Find and replace this in your current HTML:

**BEFORE (Current):**
```html
<div class="keynote-title">
    ### Signature Keynote
    ## The Gift of Sight. The Power of Insight.
    ...
</div>
```

**AFTER (New):**
```html
<!-- Replace entire section with keynotes-html-section.html content -->
```

---

## 📱 Testing Checklist

Before going live, test:

- [ ] Desktop view (1200px+): Side-by-side cards display correctly
- [ ] Tablet view (768px): Cards stack properly
- [ ] Mobile view (375px): All content readable, no overflow
- [ ] Carousel auto-rotates every 6 seconds
- [ ] Carousel pauses on hover
- [ ] Previous/Next buttons work
- [ ] Dot navigation works
- [ ] Keyboard navigation (arrow keys)
- [ ] Hover effects on cards
- [ ] Navigation anchor (#speaking) works
- [ ] Fonts load correctly (Cormorant Garamond, Work Sans)

---

## 🎭 Browser Compatibility

Tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## 🐛 Troubleshooting

### Fonts Not Loading
**Issue**: Default fonts appear instead of Cormorant Garamond/Work Sans
**Solution**: Verify Google Fonts link is in `<head>` section

### Carousel Not Rotating
**Issue**: Testimonials don't auto-rotate
**Solution**: Check console for JavaScript errors, ensure `keynotes-carousel.js` is loaded

### Cards Not Side-by-Side
**Issue**: Keynote cards stack on desktop
**Solution**: Verify `keynotes-styles.css` is loaded after other stylesheets

### Animations Not Working
**Issue**: Cards don't fade in
**Solution**: Check for CSS conflicts with existing animation libraries

### Hover Effects Missing
**Issue**: Cards don't lift on hover
**Solution**: Ensure no `transform` overrides in existing CSS

---

## 🔄 Future Additions

### Adding More Testimonials
1. Open `keynotes-html-section.html`
2. Copy a testimonial slide block
3. Update the content
4. Add another dot to the carousel-dots div
5. Update JavaScript slide count (automatic)

Example:
```html
<!-- Testimonial 4: New Person -->
<div class="testimonial-slide">
    <div class="testimonial-content">
        <p class="testimonial-quote">"Your quote here"</p>
        <div class="testimonial-author">
            <p class="author-name">Full Name</p>
            <p class="author-title">Title<br>Organization</p>
        </div>
    </div>
</div>
```

Add corresponding dot:
```html
<span class="dot" data-index="3"></span>
```

### Adding Third Keynote
Modify the grid in CSS:
```css
.keynotes-grid {
    grid-template-columns: repeat(3, 1fr); /* Change from 2 to 3 */
}
```

---

## 📞 Support

If you need assistance with implementation:
1. Check the troubleshooting section above
2. Verify all files are in correct directories
3. Check browser console for errors
4. Test in incognito/private mode to rule out caching issues

---

## ✨ What's Different From Current Site

### Current Site
- Single keynote: "The Gift of Sight"
- No testimonials visible
- Static layout

### New Implementation
- Two featured keynotes side-by-side
- Clear audience differentiation
- 3 rotating testimonials with carousel
- Hover effects and animations
- Mobile-optimized responsive design
- Professional dark testimonial section
- Target audience callouts for meeting planners

---

## 🎯 Benefits for Meeting Planners

This new layout specifically addresses meeting planner needs:

1. **Quick Comparison**: Side-by-side makes it easy to choose the right keynote
2. **Target Audience**: Clear "Perfect For" sections show immediate fit
3. **Social Proof**: Testimonial carousel builds credibility
4. **Professional Polish**: High-end design signals quality
5. **Mobile-First**: Meeting planners often browse on phones
6. **Engagement Indicators**: "Standing room only" testimonial

---

**Last Updated**: January 28, 2026
**Version**: 1.0
**Created for**: Sam Osborne (samosborne.net)
