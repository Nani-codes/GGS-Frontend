"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SocialMediaPostsProps {
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
}

// Helper function to check if string is HTML embed code
const isHtmlEmbed = (str: string): boolean => {
  if (!str) return false;
  return str.trim().startsWith('<') || str.includes('<blockquote') || str.includes('data-instgrm-permalink') || str.includes('<iframe');
};

// Helper function to check if string is Facebook iframe embed
const isFacebookIframe = (str: string): boolean => {
  if (!str) return false;
  return str.includes('<iframe') && (str.includes('facebook.com/plugins/post.php') || str.includes('facebook.com/plugins'));
};

// Helper function to extract Instagram URL from embed HTML
const extractInstagramUrlFromHtml = (html: string): string | null => {
  if (!html) return null;
  
  // Try to extract from data-instgrm-permalink attribute
  const permalinkMatch = html.match(/data-instgrm-permalink="([^"]+)"/);
  if (permalinkMatch) {
    return permalinkMatch[1].split('?')[0]; // Remove query params
  }
  
  // Try to extract from href attribute
  const hrefMatch = html.match(/href="(https?:\/\/[^"]*instagram\.com[^"]*)"/);
  if (hrefMatch) {
    return hrefMatch[1].split('?')[0]; // Remove query params
  }
  
  return null;
};

// Helper function to extract Instagram post ID from URL
const getInstagramPostId = (url: string): string | null => {
  if (!url) return null;
  
  // If it's HTML, extract URL first
  if (isHtmlEmbed(url)) {
    const extractedUrl = extractInstagramUrlFromHtml(url);
    if (!extractedUrl) return null;
    url = extractedUrl;
  }
  
  // Match patterns like:
  // https://www.instagram.com/p/POST_ID/
  // https://www.instagram.com/p/POST_ID/?utm_source=...
  // https://instagram.com/p/POST_ID/
  const match = url.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Match various YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

// Helper function to extract Facebook post ID from URL
const getFacebookPostId = (url: string): string | null => {
  if (!url) return null;
  
  // Match patterns like:
  // https://www.facebook.com/PAGE_NAME/posts/POST_ID
  // https://www.facebook.com/PAGE_NAME/posts/POST_ID/...
  // https://fb.com/PAGE_NAME/posts/POST_ID
  const match = url.match(/facebook\.com\/[^\/]+\/posts\/(\d+)/);
  if (match) return match[1];
  
  // Alternative pattern for direct post links
  const altMatch = url.match(/facebook\.com\/permalink\.php\?story_fbid=(\d+)/);
  if (altMatch) return altMatch[1];
  
  return null;
};

export function SocialMediaPosts({ instagramUrl, youtubeUrl, facebookUrl }: SocialMediaPostsProps) {
  const instagramRef = useRef<HTMLDivElement>(null);
  const facebookRef = useRef<HTMLDivElement>(null);
  const [instagramLoaded, setInstagramLoaded] = useState(false);
  const [facebookLoaded, setFacebookLoaded] = useState(false);
  const [instagramHtml, setInstagramHtml] = useState<string | null>(null);
  const [facebookHtml, setFacebookHtml] = useState<string | null>(null);

  // Process Instagram URL and set HTML state
  useEffect(() => {
    if (!instagramUrl) {
      setInstagramHtml(null);
      return;
    }

    // Check if it's HTML embed code
    if (isHtmlEmbed(instagramUrl)) {
      // Remove script tag from HTML (we'll load it separately)
      const htmlWithoutScript = instagramUrl.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
      setInstagramHtml(htmlWithoutScript);
    } else {
      // It's a URL, extract post ID and create iframe HTML
      const postId = getInstagramPostId(instagramUrl);
      if (postId) {
        setInstagramHtml(`<iframe src="https://www.instagram.com/p/${postId}/embed/" width="100%" height="600" frameborder="0" scrolling="no" allowtransparency="true" style="border: none; border-radius: 8px; display: block; margin: 0 auto;"></iframe>`);
      } else {
        setInstagramHtml(null);
      }
    }
  }, [instagramUrl]);

  // Load Instagram embed script after HTML is set
  useEffect(() => {
    if (!instagramHtml || !instagramRef.current) return;

    // Reset loaded state when HTML changes
    setInstagramLoaded(false);

    // Load Instagram embed script if not already loaded
    const loadInstagramScript = () => {
      const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
          // Wait for script to be fully ready and HTML to be rendered
          setTimeout(() => {
            try {
              if ((window as any).instgrm && instagramRef.current) {
                // Process all embeds in the container
                (window as any).instgrm.Embeds.process();
                setInstagramLoaded(true);
              } else {
                // Retry if instgrm not ready yet
                setTimeout(() => {
                  if ((window as any).instgrm && instagramRef.current) {
                    (window as any).instgrm.Embeds.process();
                  }
                  setInstagramLoaded(true);
                }, 500);
              }
            } catch (e) {
              console.warn('Error processing Instagram embed:', e);
              setInstagramLoaded(true);
            }
          }, 300);
        };
        script.onerror = () => {
          console.warn('Failed to load Instagram embed script');
          setInstagramLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        // Script already loaded, process embeds after ensuring HTML is rendered
        setTimeout(() => {
          try {
            if ((window as any).instgrm) {
              // Process all embeds (Instagram will find them automatically)
              (window as any).instgrm.Embeds.process();
            }
            setInstagramLoaded(true);
          } catch (e) {
            console.warn('Error processing Instagram embed:', e);
            setInstagramLoaded(true);
          }
        }, 300);
      }
    };

    // Wait a bit for React to render the HTML, then load script
    const timer = setTimeout(() => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadInstagramScript);
      } else {
        loadInstagramScript();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [instagramHtml]);

  // Process Facebook URL and set HTML state
  useEffect(() => {
    if (!facebookUrl) {
      setFacebookHtml(null);
      return;
    }

    // Check if it's an iframe embed code
    if (isFacebookIframe(facebookUrl)) {
      // It's an iframe embed, use it directly
      // Make iframe responsive
      let iframeHtml = facebookUrl;
      // Update iframe width to 100% for responsiveness
      iframeHtml = iframeHtml.replace(/width="\d+"/, 'width="100%"');
      iframeHtml = iframeHtml.replace(/width='\d+'/, "width='100%'");
      // Add responsive wrapper styles
      setFacebookHtml(iframeHtml);
      setFacebookLoaded(true); // Iframe embeds don't need SDK
    } else {
      // It's a URL, will use Facebook SDK
      setFacebookHtml(null);
    }
  }, [facebookUrl]);

  // Load Facebook embed script for URL-based embeds
  useEffect(() => {
    if (!facebookUrl || facebookHtml !== null || !facebookRef.current || facebookLoaded) return;

    const initFacebookEmbed = () => {
      if (!facebookRef.current) return;
      
      // Create Facebook embed div
      const embedDiv = document.createElement('div');
      embedDiv.className = 'fb-post';
      embedDiv.setAttribute('data-href', facebookUrl);
      embedDiv.setAttribute('data-width', '100%');
      embedDiv.setAttribute('data-show-text', 'true');
      
      facebookRef.current.appendChild(embedDiv);
      
      // Parse the embed if FB SDK is available
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse(facebookRef.current);
        setFacebookLoaded(true);
      }
    };

    // Load Facebook SDK if not already loaded
    if (!(window as any).FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
      
      script.onload = () => {
        (window as any).FB.init({
          xfbml: true,
          version: 'v18.0'
        });
        initFacebookEmbed();
      };
    } else {
      // SDK already loaded, initialize embed
      initFacebookEmbed();
    }
  }, [facebookUrl, facebookHtml, facebookLoaded]);

  const youtubeVideoId = youtubeUrl ? getYouTubeVideoId(youtubeUrl) : null;

  // Only render if at least one URL is provided
  if (!instagramUrl && !youtubeUrl && !facebookUrl) {
    return null;
  }

  return (
    <section className="social-media-posts" style={{ marginTop: '60px', marginBottom: '60px' }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3 className="text-center" style={{ marginBottom: '40px', fontSize: '28px', fontWeight: 'bold' }}>
              Social Media Posts
            </h3>
          </div>
        </div>
        <div className="row">
          {/* Instagram Post */}
          {instagramUrl && (
            <div className="col-lg-4 col-md-4 col-sm-12" style={{ marginBottom: '30px' }}>
              <div className="social-media-post social-media-post--instagram">
                <div className="social-media-post__header" style={{ 
                  marginBottom: '15px', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fab fa-instagram" style={{ fontSize: '24px', color: '#E4405F' }}></i>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Instagram</h4>
                </div>
                {instagramHtml ? (
                  <div 
                    ref={instagramRef}
                    className="social-media-post__embed"
                    style={{
                      minHeight: '400px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                    dangerouslySetInnerHTML={{ __html: instagramHtml }}
                  />
                ) : (
                  <div 
                    ref={instagramRef}
                    className="social-media-post__embed"
                    style={{
                      minHeight: '400px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                  >
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      Loading Instagram post...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* YouTube Post */}
          {youtubeUrl && youtubeVideoId && (
            <div className="col-lg-4 col-md-4 col-sm-12" style={{ marginBottom: '30px' }}>
              <div className="social-media-post social-media-post--youtube">
                <div className="social-media-post__header" style={{ 
                  marginBottom: '15px', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fab fa-youtube" style={{ fontSize: '24px', color: '#FF0000' }}></i>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>YouTube</h4>
                </div>
                <div className="social-media-post__embed" style={{
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Facebook Post */}
          {facebookUrl && (
            <div className="col-lg-4 col-md-4 col-sm-12" style={{ marginBottom: '30px' }}>
              <div className="social-media-post social-media-post--facebook">
                <div className="social-media-post__header" style={{ 
                  marginBottom: '15px', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fab fa-facebook" style={{ fontSize: '24px', color: '#1877F2' }}></i>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Facebook</h4>
                </div>
                {facebookHtml ? (
                  <div 
                    ref={facebookRef}
                    className="social-media-post__embed"
                    style={{
                      minHeight: '400px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                    dangerouslySetInnerHTML={{ __html: facebookHtml }}
                  />
                ) : (
                  <div 
                    ref={facebookRef}
                    className="social-media-post__embed"
                    style={{
                      minHeight: '400px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                  >
                    {!facebookLoaded && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        Loading Facebook post...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

