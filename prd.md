# Product Requirements Document (PRD)

This PRD outlines how to build a personal website for the subdomain <strong>colin.krist.io</strong>. The design aims to be a fusion of cassette-futurism aesthetics and nu-brutalism font stylings, presenting a large hero section, a top status/navigation bar, and a branding that ties together with other subdomains.

Below is a comprehensive breakdown of each aspect, including requirements, user-flow, and sample code.

---

## 1. Overview and Goals

1. **Subdomain Focus**  
   - The site will live at <strong>colin.krist.io</strong>.
   - A top status/navigation bar indicates this is a subdomain “project of me,” referencing other subdomains.

2. **Aesthetics**  
   - **Cassette-Futurism**: Emphasize retrofuturistic vibes—glowing neon outlines, stylized glitch or cyberpunk touches.
   - **Nu-Brutalism**: Bold, blocky font choices, minimalistic color palette (strong contrasts).

3. **Hero Section**  
   - Prominent text (e.g., “Hello”) at ~144px font size, taking up at least one-third of the hero area below the status bar.
   - Emphasis on immediate brand recognition—bold color use that resonates with the theme.

4. **Navigation & Branding**  
   - A “logo” text reading “colin.krist” in the top-left corner.
   - On hover, the text “colin” animates with a rainbow shimmer.
   - A dropdown button outline appears with subdomain links (e.g., “nos,” “alt,” and possibly a wildcard “*” indicating the landing).

5. **User Experience**  
   - When hovered, the top-right corner also reveals a menu or a subtle placeholder for future expansions to displayed subdomains.
   - The site should feel consistent with other subdomains while still having unique styling that showcases the personal brand.

---

## 2. Detailed Requirements

### 2.1 Hero Section

- **Font Size & Style**  
  - Large text (144px or more) for the main heading (e.g., “Hello”).
  - Bold, blocky, customizable for nu-brutalism look.
  - Secondary or optional subheading to introduce the site concept.

- **Layout**  
  - Occupies at least 30% of the viewport height below the top bar.
  - Center alignment recommended to maintain strong visual presence.

- **Color & Aesthetics**  
  - Cassette-futurism suggests vibrant neon colors (e.g., gradient neon outlines, slight glow).
  - Provide enough contrast to keep text easily readable.

### 2.2 Status/Navigation Bar

- **Structure**  
  - Fixed at the top, ensuring consistent access to the navigation.
  - Displays “colin.krist” on the left; upon hover, the “colin” text cycles through a rainbow shimmer.
  - On the far right, a dropdown or icon that reveals subdomain links.

- **Dropdown Behavior**  
  - On hover or click, show a small menu for other subdomains:
    - “nos”
    - “alt”
    - “*” (landing)
  - Indicate the currently active subdomain (e.g., highlight <strong>colin.krist.io</strong>).

- **Branding**  
  - The hover effect for “colin” is a subtle but lively shimmer cycle.  
  - The background or outline for the nav bar can have a slightly glitchy, neon-inspired border.

### 2.3 Aesthetics & Theming

- **Cassette-Futurism**  
  - Think neon outlines, glitch effects, dark backgrounds with bright accents.
  - Possibly incorporate subtle animations on hover (e.g., flicker or glow transitions).

- **Nu-Brutalism**  
  - Bold, large fonts with minimal decoration.
  - Sharp color contrasts, blocky or chunky segments for sections.
  - Minimal texture, focusing on “bare-bones” layout with strong color blocks.

### 2.4 Accessibility & Error Handling

- **Accessibility**  
  - High contrast mode: ensure color scheme is still legible for low-vision/high-contrast mode users.
  - ARIA labels for navigation elements.

- **Error Handling**  
  - Graceful fallback if dropdown animation fails or is not supported.
  - Logging in place for any JavaScript errors relating to animations or hovers.

- **Logging & Comments**  
  - Log hover events or error states for debugging (e.g., console logs or integrated logging library).
  - Add clear, descriptive comments in code, especially around complex transitions.

---

## 3. Implementation Steps

### Step 1: Setup Project Files

1. Create a new project folder or integrate into existing monorepo.  
2. Initialize your chosen framework (e.g., React, Vue, or pure HTML/CSS/JS).
3. Configure linting, formatting, and logging tools (e.g., ESLint, Prettier, and console logs).

### Step 2: Create the Base Layout

1. **Header**  
   - Implement a header component with “colin.krist” text on the left.  
   - Insert placeholders or stubs for other subdomains on the right.
   - Use CSS or JavaScript for the hover effect that triggers the rainbow shimmer.

2. **Hero Section**  
   - Create a container that occupies a large portion of the viewport.
   - Add the large heading (e.g., “Hello”) with a 144px (or larger) font size.
   - Center it horizontally and vertically for emphasis.

3. **Styling**  
   - Add a base palette for cassette-futurism: neon pink, neon blue, neon green accents.  
   - Use a simple background (dark or white) for a brutalist approach but incorporate the neon lines or hover animations for additional flair.

### Step 3: Manage Navigation & Interactions

1. **Navigation Loading**  
   - If you have multiple subdomains, ensure dynamic loading or a static array that references them.
   - Provide active state or highlight for colin.krist.io.

2. **Dropdown Menu**  
   - Appear on hover or click over an icon or button on the far right.
   - Slide down or fade in with a neon outline.
   - Use an error-check or logging if the menu fails to open or if there are conflicts with other scripts.

3. **Rainbow Shimmer Hover**  
   - On the “colin” text, cycle through multiple colors (e.g., a CSS gradient or JavaScript-based transitions).
   - Log transitions in the console or handle fallback if the user’s browser doesn’t support certain CSS features.

### Step 4: Add Logging & Error Checks

1. **Browser Compatibility**  
   - Check for browser compatibility with CSS transitions and JavaScript features. Provide polyfills or fallback if needed.
2. **Console Logs & Alerts**  
   - Place dev-friendly logs for drop-down interactions and shimmer transitions.
   - If the dropdown fails to render, log an error and gracefully hide that feature.

### Step 5: Test & Validate

1. **Accessibility Testing**  
   - Validate color contrast with tools like Lighthouse or wave.webaim.org.
   - Ensure keyboard navigation is possible: Tab to focus the dropdown, Enter or Space to toggle it.
2. **User Testing**  
   - Verify that the large hero text is correct size on multiple screen resolutions.
   - Confirm that hover over “colin” triggers the rainbow shimmer on different browsers.

---

## 4. Sample Code

Below is an example of how you might implement these features in a React/TypeScript environment. Feel free to adapt to your preferred framework or a simple HTML/JavaScript setup.

```tsx
import React, { useState } from 'react';

function PersonalSite() {
  const [showDropdown, setShowDropdown] = useState(false);

  // List of other subdomains
  const subdomains = ['nos', 'alt', '*'];

  // Logging function for demonstration
  const logAction = (message: string) => {
    console.log(`[colin.krist.io LOG] ${message}`);
  };

  // Rainbow shimmer style as a pseudo example
  const rainbowShimmerStyle = {
    animation: 'rainbow 3s infinite',
    // Provide fallback or vendor prefixes if needed
  };

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      {/* Status/Navigation Bar */}
      <header 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#111', // or #fff for brutal contrast
          color: '#fff'
        }}
      >
        <div
          onMouseOver={() => {
            logAction('Hovering over colin.krist logo');
          }}
          style={{ cursor: 'pointer' }}
        >
          <span 
            style={{
              // normal styling...
            }}
            onMouseOver={(e) => {
              (e.currentTarget.style as any) = {
                ...e.currentTarget.style,
                ...rainbowShimmerStyle
              };
            }}
            onMouseOut={(e) => {
              // Remove shimmer on mouse out
              e.currentTarget.removeAttribute('style');
            }}
          >
            colin
          </span>
          .krist
        </div>

        <div style={{ position: 'relative' }}>
          <button
            style={{ 
              background: 'transparent', 
              border: '1px solid #fff', 
              color: '#fff', 
              cursor: 'pointer', 
              padding: '0.5rem 1rem' 
            }}
            onClick={() => {
              setShowDropdown(!showDropdown);
              logAction('Toggling dropdown');
            }}
          >
            Subdomains
          </button>
          {showDropdown && (
            <ul
              style={{
                position: 'absolute',
                top: '2.5rem',
                right: 0,
                listStyleType: 'none',
                margin: 0,
                padding: 0,
                backgroundColor: '#222',
                border: '1px solid neonpink'
              }}
            >
              {subdomains.map((domain, idx) => (
                <li key={idx}>
                  <a 
                    href={`https://${domain}.krist.io`} 
                    style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '0.5rem' }}
                    onClick={() => logAction(`Navigating to ${domain}.krist.io`)}
                  >
                    {domain}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff', // or #222 for a dark theme
          color: '#000',           // or neon styling
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <h1
          style={{
            fontSize: '144px',
            fontWeight: 'bold',
            margin: 0,
            // neon-like styling example:
            textShadow: '0 0 5px #00ffe5, 0 0 10px #00ffe5, 0 0 20px #00ffe5'
          }}
        >
          Hello
        </h1>
      </section>
      
      {/* Additional content or sections go here */}
    </div>
  );
}

export default PersonalSite;
```

### Explanation of Key Sections

1. **Navigation Bar**  
   - Uses flex layout to space elements.
   - “colin.krist” is split so “colin” can have a special hover animation.

2. **Hover Style**  
   - Rainbow shimmer effect is triggered by inline style changes for demonstration.  
   - In production, you’d typically use a dedicated CSS class or keyframes for smoother and more maintainable effects.

3. **Dropdown**  
   - Toggled by a React state variable (`showDropdown`), displaying a simple list of links.
   - Basic error checks via console logs.

4. **Hero Section**  
   - Large heading (144px) with a neon-like text shadow for a cassette-futurism vibe.
   - Centered horizontally and vertically.

---

## 5. Edge Cases & Potential Errors

1. **Animation & Browser Support**  
   - Certain browsers may not support advanced CSS animations. Provide a fallback or ensure no layout breakage.
2. **Dropdown Off-Screen**  
   - If too many subdomains are added, the dropdown might overflow. Consider scroll or missing a boundary check.
3. **Font Scaling on Mobile**  
   - The 144px font on smaller devices should either scale down or maintain responsiveness.

---

## 6. Conclusion

By carefully following the above steps—from planning the large hero text to designing a cassette-futurism meets nu-brutalism aesthetic, and including robust logging/error handling—you will create a visually striking and functional personal website at <strong>colin.krist.io</strong>. The detailed instructions in this PRD ensure no major aspects or error cases are overlooked, helping you deliver a clean, modern user experience.
