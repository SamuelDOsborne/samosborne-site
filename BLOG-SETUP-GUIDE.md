# Blog System Setup Guide

## Welcome to Your Professional Blog! 🚀

Your blog system has been successfully set up on samosborne.net. This guide walks you through maintaining and adding new articles.

## System Structure

```
samosborne-site/
├── blog.html                          # Main blog landing page
├── blogs/
│   ├── blog-index.json               # Article registry (update this weekly!)
│   ├── blog-emotional-reactivity.html  # Sample article 1
│   ├── blog-conflict-frameworks.html   # Sample article 2
│   └── blog-balanced-perception.html   # Sample article 3
└── BLOG-SETUP-GUIDE.md              # This file
```

## Adding a New Article (Weekly Process)

### Step 1: Create the Article HTML File

1. Copy the content from `blog-post-template.html` (or use one of the sample posts as reference)
2. 2. Create a new file in the `/blogs` folder with the naming pattern: `blog-{topic-slug}.html`
   3. 3. Replace all placeholders:
      4.    - `[ARTICLE TITLE]` → Your article title
            -    - `[DATE]` → Publication date
                 -    - `[CATEGORY]` → Leadership | Conflict | Growth | Keynotes
                      -    - `[READING TIME]` → e.g., "5 min read"
                           -    - Content sections → Your article body
                            
                                - ### Step 2: Update blog-index.json
                            
                                - Add a new entry at the TOP of the articles array in `blogs/blog-index.json`:
                            
                                - ```json
                                  {
                                    "id": "unique-id-2026-02-23",
                                    "title": "Your Article Title",
                                    "excerpt": "2-3 sentence summary of the article",
                                    "date": "2026-02-23",
                                    "category": "Leadership",
                                    "url": "blogs/blog-your-topic.html",
                                    "emoji": "🎯",
                                    "color": "#667eea",
                                    "colorEnd": "#764ba2",
                                    "readingTime": "6 min read",
                                    "author": "Sam Osborne"
                                  }
                                  ```

                                  ### Step 3: Commit to GitHub

                                  ```bash
                                  git add blogs/blog-your-topic.html blogs/blog-index.json
                                  git commit -m "Publish blog post: Your Article Title"
                                  git push origin main
                                  ```

                                  Your new article will appear on `samosborne.net/blog.html` automatically!

                                  ## Suggested Color Gradients by Category

                                  Choose from these pre-designed gradients or create your own:

                                  - **Leadership**: `#667eea` → `#764ba2` (Purple)
                                  - - **Conflict**: `#f093fb` → `#f5576c` (Pink-Red)
                                    - - **Growth**: `#4facfe` → `#00f2fe` (Cyan-Blue)
                                      - - **Keynotes**: `#fa709a` → `#fee140` (Orange-Yellow)
                                        - - **Innovation**: `#30cfd0` → `#330867` (Cyan-Purple)
                                          - - **Strategy**: `#a8edea` → `#fed6e3` (Mint-Pink)
                                           
                                            - ## Content Guidelines
                                           
                                            - Each article should include:
                                           
                                            - - **Title**: Clear, benefit-focused (5-8 words)
                                              - - **Excerpt**: 2-3 sentences summarizing the article
                                                - - **Sections**:
                                                  -   - Introduction (hook + overview)
                                                      -   - 2-3 main sections (each with h2 headers)
                                                          -   - Key takeaways or practical steps
                                                              -   - Conclusion
                                                                  - - **Author bio**: Always included at the end
                                                                    - - **Word count**: 800-1500 words (5-8 minute read)
                                                                     
                                                                      - ## Navigation Links
                                                                     
                                                                      - The blog is integrated into your site's navigation:
                                                                     
                                                                      - - Main site: `samosborne.net/`
                                                                        - - Blog index: `samosborne.net/blog.html`
                                                                          - - Individual articles: `samosborne.net/blogs/blog-[topic].html`
                                                                           
                                                                            - Update navigation links in `index.html` if needed to point to the blog.
                                                                           
                                                                            - ## Styling & Brand Consistency
                                                                           
                                                                            - All blog pages use your site's teal and dark blue color scheme:
                                                                            - - Primary: `#1e7e8a` (Teal)
                                                                              - - Secondary: `#2c3e50` (Dark blue)
                                                                                - - Accent: `#2d5f7b` (Medium blue)
                                                                                  - - Text: `#2c3e50` (Dark)
                                                                                    - - Background: Gradient from `#f5f7fa` to `#c3cfe2`
                                                                                     
                                                                                      - The template CSS includes:
                                                                                      - - Responsive design (mobile, tablet, desktop)
                                                                                        - - Smooth hover transitions
                                                                                          - - Professional typography
                                                                                            - - Accessible color contrast
                                                                                              - - Gradient headers matching your brand
                                                                                               
                                                                                                - ## SEO Best Practices
                                                                                               
                                                                                                - Each article includes:
                                                                                                - - Meta description (150-160 characters)
                                                                                                  - - Open Graph tags (for social sharing)
                                                                                                    - - Semantic HTML structure
                                                                                                      - - Internal linking (back to blog index)
                                                                                                        - - Mobile-friendly viewport
                                                                                                         
                                                                                                          - ## Troubleshooting
                                                                                                         
                                                                                                          - **Article not appearing on blog page?**
                                                                                                          - - Check that the entry is in `blogs/blog-index.json`
                                                                                                            - - Verify the `url` field matches the actual file name
                                                                                                              - - Ensure JSON syntax is valid (no missing commas or brackets)
                                                                                                                - - Hard refresh your browser (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)
                                                                                                                 
                                                                                                                  - **Styling looks off?**
                                                                                                                  - - Check that the article HTML includes the `<style>` section
                                                                                                                    - - Verify all CSS class names match the template
                                                                                                                      - - Ensure navigation links start with `/` for absolute paths
                                                                                                                       
                                                                                                                        - **Images not loading?**
                                                                                                                        - - Place images in the `/images` folder
                                                                                                                          - - Reference them as `/images/filename.jpg`
                                                                                                                            - - Keep file sizes under 200KB for web
                                                                                                                             
                                                                                                                              - ## Weekly Publishing Workflow
                                                                                                                             
                                                                                                                              - 1. **Monday-Wednesday**: Write your article
                                                                                                                                2. 2. **Wednesday**: Review and edit for clarity
                                                                                                                                   3. 3. **Thursday**:
                                                                                                                                      4.    - Create HTML file in `/blogs` folder
                                                                                                                                            -    - Update `blog-index.json` with metadata
                                                                                                                                                 -    - Test locally if possible
                                                                                                                                                      - 4. **Friday**: Commit and push to GitHub
                                                                                                                                                        5. 5. **Saturday**: Verify it appears on samosborne.net/blog.html
                                                                                                                                                          
                                                                                                                                                           6. ## Sample Article Topics
                                                                                                                                                          
                                                                                                                                                           7. Suggested topics aligned with your expertise:
                                                                                                                                                          
                                                                                                                                                           8. - The Demartini Method in Modern Leadership
                                                                                                                                                              - - Emotional Intelligence vs. Balanced Perception
                                                                                                                                                                - - Conflict as a Growth Opportunity
                                                                                                                                                                  - - Decision-Making Under Pressure
                                                                                                                                                                    - - Building Psychological Safety in Teams
                                                                                                                                                                      - - Values-Aligned Leadership
                                                                                                                                                                        - - The Cost of Misaligned Teams
                                                                                                                                                                          - - Transforming Reactivity into Response-Ability
                                                                                                                                                                           
                                                                                                                                                                            - ## Questions?
                                                                                                                                                                           
                                                                                                                                                                            - Review the sample articles (`blog-emotional-reactivity.html`, etc.) for reference implementations of all features.
                                                                                                                                                                           
                                                                                                                                                                            - ---
                                                                                                                                                                            
                                                                                                                                                                            **Created**: February 2026
                                                                                                                                                                            **Last Updated**: February 2026
                                                                                                                                                                            **Maintained by**: Sam Osborne
