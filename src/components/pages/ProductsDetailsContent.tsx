"use client";

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';
import { SocialMediaPosts } from '@/components/SocialMediaPosts';

// Helper function to format key-value pairs with bold keys
const formatKeyValuePair = (text: string): React.JSX.Element => {
  // Split text by key-value pattern: "Key: Value" where Key starts with capital letter
  // Pattern: Capital letter, followed by letters/spaces, then colon, then value until next key or end
  const parts: React.JSX.Element[] = [];
  let remainingText = text;
  let hasMatches = false;

  // Find all key-value pairs: look for pattern like "Crop Period:", "Boll Shape:", etc.
  // Key pattern: starts with capital, contains letters/spaces, ends with colon
  const keyPattern = /\b([A-Z][A-Za-z\s]{2,}?):\s*/g;
  const matches: Array<{ key: string; keyEnd: number; valueStart: number }> = [];

  let match;
  keyPattern.lastIndex = 0;

  while ((match = keyPattern.exec(text)) !== null) {
    const key = match[1].trim();
    const keyEnd = match.index + match[0].length;

    // Find where the value ends (next key pattern or end of string)
    const afterMatch = text.substring(keyEnd);
    const nextKeyMatch = afterMatch.match(/\b[A-Z][A-Za-z\s]{2,}?:\s*/);
    const valueEnd = nextKeyMatch && typeof nextKeyMatch.index === 'number'
      ? keyEnd + nextKeyMatch.index
      : text.length;

    matches.push({
      key,
      keyEnd: match.index,
      valueStart: keyEnd
    });
  }

  // If we found matches, format them
  if (matches.length > 0) {
    hasMatches = true;
    let lastIndex = 0;

    matches.forEach((matchInfo, index) => {
      // Add text before this key-value pair
      if (matchInfo.keyEnd > lastIndex) {
        const beforeText = text.substring(lastIndex, matchInfo.keyEnd).trim();
        if (beforeText) {
          parts.push(<>{beforeText} </>);
        }
      }

      // Find value end (start of next key or end of text)
      const valueEnd = index < matches.length - 1
        ? matches[index + 1].keyEnd
        : text.length;
      const value = text.substring(matchInfo.valueStart, valueEnd).trim();

      // Add formatted key-value pair
      parts.push(
        <React.Fragment key={`kv-${matchInfo.keyEnd}`}>
          <strong style={{ fontWeight: 'bold' }}>{matchInfo.key}</strong>: {value}
        </React.Fragment>
      );

      // Add space if not last
      if (index < matches.length - 1) {
        parts.push(<>{' '}</>);
      }

      lastIndex = valueEnd;
    });

    // Add any remaining text after last match
    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex).trim();
      if (remaining) {
        parts.push(<>{remaining}</>);
      }
    }

    return <>{parts}</>;
  }

  // Fallback: try simple single key-value pattern
  const simpleMatch = text.match(/^([^:]+):\s*(.+)$/);
  if (simpleMatch) {
    const key = simpleMatch[1].trim();
    const value = simpleMatch[2].trim();
    return (
      <>
        <strong style={{ fontWeight: 'bold' }}>{key}</strong>: {value}
      </>
    );
  }

  // If no match, return original text
  return <>{text}</>;
};

// Function to format description with bullet points
const formatDescription = (description: string | null | undefined): React.JSX.Element | null => {
  if (!description) return null;

  // Handle escape characters and normalize line breaks
  let normalizedDesc = description
    .replace(/\\n/g, '\n')      // Convert \n to actual newline
    .replace(/\\r/g, '\r')      // Convert \r to carriage return
    .replace(/\\t/g, '\t');     // Convert \t to tab

  // Split by lines and process
  const lines = normalizedDesc.split(/\r?\n/).filter(line => line.trim());
  const formattedContent: React.JSX.Element[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      formattedContent.push(
        <ul key={`list-${formattedContent.length}`} className="product-details__features-list" style={{
          listStyle: 'none',
          paddingLeft: '0',
          marginTop: '15px',
          marginBottom: '15px'
        }}>
          {currentList.map((item, index) => (
            <li key={index} style={{
              marginBottom: '10px',
              paddingLeft: '25px',
              position: 'relative',
              lineHeight: '1.6'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                color: '#f5cb4b',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>•</span>
              {formatKeyValuePair(item.trim())}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Check if line starts with bullet point (• or -)
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
      // Remove the bullet and add to current list
      const itemText = trimmedLine.replace(/^[•\-]\s*/, '').trim();
      if (itemText) {
        currentList.push(itemText);
      }
    } else if (trimmedLine.includes(':') && trimmedLine.length < 100 && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-')) {
      // This might be a section heading (e.g., "Special Features :")
      flushList();
      if (trimmedLine.endsWith(':')) {
        formattedContent.push(
          <p key={`heading-${index}`} style={{
            marginTop: '20px',
            marginBottom: '10px',
            fontSize: '18px',
            lineHeight: '1.6'
          }}>
            {trimmedLine}
          </p>
        );
      } else {
        // Check if this is a key-value pair (has colon but doesn't end with colon)
        // Format with bold key
        if (currentList.length > 0) {
          flushList();
        }
        formattedContent.push(
          <p key={`text-${index}`} style={{ marginBottom: '10px', lineHeight: '1.6' }}>
            {formatKeyValuePair(trimmedLine)}
          </p>
        );
      }
    } else if (trimmedLine) {
      // Regular text line
      if (currentList.length > 0) {
        flushList();
      }
      formattedContent.push(
        <p key={`text-${index}`} style={{ marginBottom: '10px', lineHeight: '1.6' }}>
          {trimmedLine}
        </p>
      );
    }
  });

  // Flush any remaining list items
  flushList();

  return formattedContent.length > 0 ? <div>{formattedContent}</div> : null;
};

interface Product {
  id: number;
  documentId: string;
  locale: string;
  Name: string;
  Description: string;
  Variety_Name: string;
  Group_Name: string;
  Image: any;
  Instagram_Post_URL?: string;
  YouTube_Post_URL?: string;
  Facebook_Post_URL?: string;
}

// ===== MAIN COMPONENT =====
export function ProductsDetailsContent() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [sameNameProducts, setSameNameProducts] = useState<Product[]>([]);
  const [sameNameLoading, setSameNameLoading] = useState(false);
  const [sameNameError, setSameNameError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);
        const apiKey = process.env.NEXT_STRAPI_API_KEY;
        const headers: HeadersInit = {};

        if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }

        // Query by documentId - Strapi requires explicit locale parameter
        // Fetch all locales in parallel to get all variants
        const localesToFetch = ['en', 'hi', 'mr'];
        const fetchPromises = localesToFetch.map(async (loc) => {
          const apiUrl = `/strapi/api/products?locale=${loc}&fields[0]=documentId&fields[1]=locale&fields[2]=Name&fields[3]=Description&fields[4]=Variety_Name&fields[5]=Group_Name&fields[6]=Instagram_Post_URL&fields[7]=YouTube_Post_URL&fields[8]=Facebook_Post_URL&filters[documentId][$eq]=${productId}&populate[Image][fields][1]=url`;
          try {
            const resp = await fetch(apiUrl, { headers });
            if (resp.ok) {
              const data = await resp.json();
              return data.data || [];
            }
            return [];
          } catch (err) {
            console.warn(`[ProductDetails] Failed to fetch locale ${loc}:`, err);
            return [];
          }
        });

        console.log('[ProductDetails] Fetching product by documentId (all locales in parallel)', {
          productId,
          requestedLocale: locale,
          localesToFetch,
        });

        const localeResults = await Promise.all(fetchPromises);
        const allVariants = localeResults.flat().filter(Boolean);

        console.log('[ProductDetails] Fetched variants from all locales', {
          totalVariants: allVariants.length,
          variantsByLocale: allVariants.map((p: Product) => ({ locale: p.locale, id: p.id, hasDescription: !!p.Description })),
        });

        // If we got variants, process them
        if (allVariants.length > 0) {
          // Extract shared fields (Name, Variety_Name, Group_Name) from any variant
          // These should be identical across all locales
          const sharedFields = allVariants[0];

          // Log all available locales for debugging
          const availableLocales = allVariants.map((p: Product) => p.locale);
          console.log('[ProductDetails] Available locales in response:', availableLocales);
          console.log('[ProductDetails] Requested locale:', locale, 'Type:', typeof locale);
          console.log('[ProductDetails] Locale type check:', typeof locale, locale === 'hi', locale === 'en', locale === 'mr');

          // Extract locale-specific Description from the current locale variant
          // Use case-insensitive matching and trim whitespace
          // Also check for locale variations (e.g., 'hi-IN', 'hi_IN', etc.)
          const localeSpecific = allVariants.find((p: Product) => {
            const productLocale = String(p.locale || '').toLowerCase().trim();
            const requestedLocale = String(locale || '').toLowerCase().trim();

            // Direct match
            if (productLocale === requestedLocale) {
              console.log(`[ProductDetails] Direct locale match found: "${productLocale}" === "${requestedLocale}"`);
              return true;
            }

            // Check if locale starts with requested locale (e.g., 'hi-IN' matches 'hi')
            if (productLocale.startsWith(requestedLocale + '-') || productLocale.startsWith(requestedLocale + '_')) {
              console.log(`[ProductDetails] Locale prefix match found: "${productLocale}" starts with "${requestedLocale}"`);
              return true;
            }

            // Check if requested locale starts with product locale (e.g., 'hi' matches 'hi-IN')
            if (requestedLocale.startsWith(productLocale + '-') || requestedLocale.startsWith(productLocale + '_')) {
              console.log(`[ProductDetails] Reverse locale prefix match found: "${requestedLocale}" starts with "${productLocale}"`);
              return true;
            }

            return false;
          });

          // Fallback strategy: prefer default locale (en) if current locale not found
          const fallbackLocale = localeSpecific || allVariants.find((p: Product) => {
            const productLocale = String(p.locale || '').toLowerCase().trim();
            return productLocale === 'en';
          }) || allVariants[0];

          if (!localeSpecific) {
            // If current locale not found, log warning and use fallback
            console.warn(`[ProductDetails] Locale "${locale}" not found in available locales: [${availableLocales.join(', ')}]. Using fallback locale (${fallbackLocale.locale}) for Description`);
            console.warn('[ProductDetails] This means the product may not have a Description in the requested locale.');
          } else {
            console.log(`[ProductDetails] ✓ Found locale-specific variant for "${locale}", using Description from ${localeSpecific.locale} locale`);
            console.log(`[ProductDetails] Description preview (first 100 chars): ${localeSpecific.Description?.substring(0, 100)}...`);
          }

          // Merge shared fields with locale-specific Description
          const mergedProduct: Product = {
            ...sharedFields,
            Description: localeSpecific?.Description || fallbackLocale.Description,
            locale: locale, // Set to current locale for tracking
          };

          console.log('[ProductDetails] Merged product summary', {
            requestedLocale: locale,
            foundLocale: localeSpecific?.locale || fallbackLocale.locale,
            descriptionSource: localeSpecific ? 'locale-specific' : 'fallback',
            descriptionLocale: localeSpecific?.locale || fallbackLocale.locale,
            descriptionLength: mergedProduct.Description?.length || 0,
            descriptionPreview: mergedProduct.Description?.substring(0, 150) || '(empty)',
            availableLocales: availableLocales,
          });

          console.log('[ProductDetails] Social Media URLs:', {
            instagram: mergedProduct?.Instagram_Post_URL,
            youtube: mergedProduct?.YouTube_Post_URL,
            facebook: mergedProduct?.Facebook_Post_URL
          });

          setProduct(mergedProduct);
        } else {
          // If parallel fetch didn't work, try fetching by ID as fallback
          const apiUrlById = `/strapi/api/products/${productId}?fields[0]=documentId&fields[1]=locale&fields[2]=Name&fields[3]=Description&fields[4]=Variety_Name&fields[5]=Group_Name&fields[6]=Instagram_Post_URL&fields[7]=YouTube_Post_URL&fields[8]=Facebook_Post_URL&populate[Image][fields][1]=url`;

          console.log('[ProductDetails] Parallel fetch returned no results, trying ID fallback', {
            productId,
            locale,
            apiUrlById,
          });

          const responseById = await fetch(apiUrlById, {
            headers,
          });

          if (!responseById.ok) {
            throw new Error(`Failed to fetch product. Status: ${responseById.status}`);
          }

          const dataById = await responseById.json();
          console.log('[ProductDetails] Product by ID response', dataById);

          // For ID-based fetch, try to fetch all variants by documentId if we have it
          if (dataById.data?.documentId) {
            // Fetch all locales in parallel for the documentId
            const idFetchPromises = localesToFetch.map(async (loc) => {
              const apiUrl = `/strapi/api/products?locale=${loc}&fields[0]=documentId&fields[1]=locale&fields[2]=Name&fields[3]=Description&fields[4]=Variety_Name&fields[5]=Group_Name&fields[6]=Instagram_Post_URL&fields[7]=YouTube_Post_URL&fields[8]=Facebook_Post_URL&filters[documentId][$eq]=${dataById.data.documentId}&populate[Image][fields][1]=url`;
              try {
                const resp = await fetch(apiUrl, { headers });
                if (resp.ok) {
                  const data = await resp.json();
                  return data.data || [];
                }
                return [];
              } catch (err) {
                console.warn(`[ProductDetails] ID fallback - Failed to fetch locale ${loc}:`, err);
                return [];
              }
            });

            const idLocaleResults = await Promise.all(idFetchPromises);
            const idAllVariants = idLocaleResults.flat().filter(Boolean);

            if (idAllVariants.length > 0) {
              // Extract shared fields and merge with locale-specific Description
              const sharedFields = idAllVariants[0];
              const availableLocales = idAllVariants.map((p: Product) => p.locale);

              const localeSpecific = idAllVariants.find((p: Product) => {
                const productLocale = String(p.locale || '').toLowerCase().trim();
                const requestedLocale = String(locale || '').toLowerCase().trim();
                return productLocale === requestedLocale;
              });

              const fallbackLocale = localeSpecific || idAllVariants.find((p: Product) => {
                const productLocale = String(p.locale || '').toLowerCase().trim();
                return productLocale === 'en';
              }) || idAllVariants[0];

              const mergedProduct: Product = {
                ...sharedFields,
                Description: localeSpecific?.Description || fallbackLocale.Description,
                locale: locale,
              };

              console.log('[ProductDetails] Merged product from ID fallback variants', {
                requestedLocale: locale,
                foundLocale: localeSpecific?.locale || fallbackLocale.locale,
                availableLocales: availableLocales,
              });

              setProduct(mergedProduct);
              return;
            }
          }

          // Final fallback: use the single product from ID fetch
          // Note: This may not have locale-specific Description if locale doesn't match
          setProduct(dataById.data);
        }
      } catch (err) {
        console.error('[ProductDetails] Error fetching product', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, locale]);

  useEffect(() => {
    if (!product) {
      console.log('[RelatedProducts] No product loaded yet, skipping related fetch');
      setRelatedProducts([]);
      setSameNameProducts([]);
      return;
    }

    // Fetch products with same Group_Name
    const groupName = product.Group_Name?.trim();
    if (groupName) {
      fetchRelatedProducts(groupName, product);
    } else {
      setRelatedProducts([]);
    }

    // Fetch products with same Name
    const productName = product.Name?.trim();
    if (productName) {
      fetchSameNameProducts(productName, product);
    } else {
      setSameNameProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, locale]);

  // Re-initialize swiper when product images change
  useEffect(() => {
    if (!product) return;

    const images = getAllProductImages(product);
    if (images.length === 0) return;

    // Wait for DOM to update, then re-initialize swiper
    const timer = setTimeout(() => {
      try {
        const carouselEl = document.getElementById('shop-details-one__carousel');
        const thumbEl = document.getElementById('shop-details-one__thumb');

        if (!carouselEl || !thumbEl) return;

        // Check if Swiper is available globally
        const Swiper = (window as any).Swiper;
        if (!Swiper) {
          console.warn('[Swiper] Swiper library not found, trying to trigger external initialization');
          // Fallback: dispatch event for external script
          window.dispatchEvent(new CustomEvent('swiper-reinit'));
          return;
        }

        // Destroy existing swiper instances if they exist
        if ((window as any).shopDetailsOneCarousel) {
          try {
            (window as any).shopDetailsOneCarousel.destroy(true, true);
          } catch (e) {
            console.warn('[Swiper] Error destroying carousel:', e);
          }
        }
        if ((window as any).shopDetailsOneThumb) {
          try {
            (window as any).shopDetailsOneThumb.destroy(true, true);
          } catch (e) {
            console.warn('[Swiper] Error destroying thumb:', e);
          }
        }

        // Initialize thumbnail swiper first
        const shopDetailsThumb = new Swiper('#shop-details-one__thumb', {
          slidesPerView: 3,
          spaceBetween: 0,
          speed: 1400,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          loop: images.length > 1,
          autoplay: {
            delay: 5000
          }
        });

        // Initialize main carousel swiper
        const shopDetailsCarousel = new Swiper('#shop-details-one__carousel', {
          observer: true,
          observeParents: true,
          loop: images.length > 1,
          speed: 1400,
          mousewheel: false,
          slidesPerView: 1,
          autoplay: {
            delay: 5000
          },
          thumbs: {
            swiper: shopDetailsThumb
          },
          navigation: {
            nextEl: '#product-details__swiper-button-next',
            prevEl: '#product-details__swiper-button-prev'
          },
        });

        // Store instances in window for cleanup
        (window as any).shopDetailsOneCarousel = shopDetailsCarousel;
        (window as any).shopDetailsOneThumb = shopDetailsThumb;

        console.log('[Swiper] Re-initialized with', images.length, 'images');
      } catch (err) {
        console.warn('[Swiper] Error re-initializing swiper:', err);
      }
    }, 500); // Increased delay to ensure DOM is fully updated

    return () => {
      clearTimeout(timer);
      // Cleanup: destroy swiper instances on unmount
      if ((window as any).shopDetailsOneCarousel) {
        try {
          (window as any).shopDetailsOneCarousel.destroy(true, true);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if ((window as any).shopDetailsOneThumb) {
        try {
          (window as any).shopDetailsOneThumb.destroy(true, true);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.Image, product?.id]);

  const getProductImage = (product: Product | null) => {
    if (!product || !product.Image) {
      return '/assets/images/backgrounds/1-1.png';
    }

    // Handle array of image objects: Image[0].url (most common in Strapi v5)
    if (Array.isArray(product.Image) && product.Image.length > 0) {
      const firstImage = product.Image[0];
      if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
        const imageUrl = (firstImage as { url: string }).url;
        if (imageUrl) {
          return `/strapi${imageUrl}`;
        }
      }
    }

    // Handle Strapi v5 nested structure: Image.data[0].attributes.url
    const nestedArrayUrl = (product.Image as any)?.data?.[0]?.attributes?.url;
    if (nestedArrayUrl) {
      return `/strapi${nestedArrayUrl}`;
    }

    // Handle Strapi v5 nested single structure: Image.data.attributes.url
    const nestedSingleUrl = (product.Image as any)?.data?.attributes?.url;
    if (nestedSingleUrl) {
      return `/strapi${nestedSingleUrl}`;
    }

    // Handle flat single structure: Image.url
    const flatSingleUrl = (product.Image as { url?: string })?.url;
    if (flatSingleUrl) {
      return `/strapi${flatSingleUrl}`;
    }

    // Fallback to default image
    console.warn('No image URL found for product:', product.id, 'Image data:', product.Image);
    return '/assets/images/backgrounds/1-1.png';
  };

  const getAllProductImages = (product: Product | null): string[] => {
    if (!product || !product.Image) {
      return ['/assets/images/backgrounds/1-1.png'];
    }

    const images: string[] = [];

    // Handle array of image objects: Image[].url (most common in Strapi v5)
    if (Array.isArray(product.Image) && product.Image.length > 0) {
      product.Image.forEach((img) => {
        if (img && typeof img === 'object' && 'url' in img) {
          const imageUrl = (img as { url: string }).url;
          if (imageUrl) {
            images.push(`/strapi${imageUrl}`);
          }
        }
      });
      if (images.length > 0) {
        console.log(`[ProductImages] Found ${images.length} images for product ${product.id}:`, images);
        return images;
      }
    }

    // Handle Strapi v5 nested structure: Image.data[].attributes.url
    const nestedArray = (product.Image as any)?.data;
    if (Array.isArray(nestedArray) && nestedArray.length > 0) {
      nestedArray.forEach((item: any) => {
        const url = item?.attributes?.url;
        if (url) {
          images.push(`/strapi${url}`);
        }
      });
      if (images.length > 0) {
        return images;
      }
    }

    // Handle Strapi v5 nested single structure: Image.data.attributes.url
    const nestedSingleUrl = (product.Image as any)?.data?.attributes?.url;
    if (nestedSingleUrl) {
      return [`/strapi${nestedSingleUrl}`];
    }

    // Handle flat single structure: Image.url
    const flatSingleUrl = (product.Image as { url?: string })?.url;
    if (flatSingleUrl) {
      return [`/strapi${flatSingleUrl}`];
    }

    // Fallback to default image
    return ['/assets/images/backgrounds/1-1.png'];
  };

  const fetchRelatedProducts = async (groupName: string, currentProduct: Product) => {
    if (!groupName) return;

    try {
      setRelatedLoading(true);
      setRelatedError(null);

      const apiKey = process.env.NEXT_STRAPI_API_KEY;
      const headers: HeadersInit = {};

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // Fetch products with same Group_Name (shared field)
      // Fetch without locale filter to get all locale variants
      // Then merge shared fields with locale-specific Description
      const encodedGroupName = encodeURIComponent(groupName);
      const relatedUrl = `/strapi/api/products?filters[Group_Name][$eq]=${encodedGroupName}&fields[0]=documentId&fields[1]=locale&fields[2]=Name&fields[3]=Description&fields[4]=Variety_Name&fields[5]=Group_Name&populate[Image][fields][1]=url&pagination[page]=1&pagination[pageSize]=100`;
      console.log('[RelatedProducts] Fetching related products by Group_Name (all locales)', {
        groupName,
        encodedGroupName,
        locale,
        relatedUrl,
        currentKey: currentProduct.documentId || String(currentProduct.id),
      });

      const response = await fetch(
        relatedUrl,
        {
          headers,
        }
      );

      if (!response.ok) {
        console.error('[RelatedProducts] Non-OK response', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Failed to fetch related products');
      }

      const data = await response.json();
      const allItems: Product[] = data?.data ?? [];
      console.log('[RelatedProducts] Raw related items (all locales)', {
        count: allItems.length,
        ids: allItems.map((p) => ({ id: p.id, documentId: p.documentId, name: p.Name, groupName: p.Group_Name, locale: p.locale })),
      });

      // Group by documentId and merge shared fields with locale-specific Description
      const productsByDocumentId = new Map<string, Product[]>();
      allItems.forEach((product) => {
        const key = product.documentId || String(product.id);
        if (!productsByDocumentId.has(key)) {
          productsByDocumentId.set(key, []);
        }
        productsByDocumentId.get(key)!.push(product);
      });

      // Filter out current product and merge locale variants
      const currentKey = currentProduct.documentId || String(currentProduct.id);
      const mergedProducts: Product[] = [];

      productsByDocumentId.forEach((variants, docId) => {
        if (docId === currentKey) return; // Skip current product

        if (variants.length === 0) return;

        // Get shared fields from first variant (they should be identical across locales)
        const sharedFields = variants[0];

        // Find locale-specific variant for Description
        // Use case-insensitive matching and trim whitespace
        const localeSpecific = variants.find((p) => {
          const productLocale = String(p.locale || '').toLowerCase().trim();
          const requestedLocale = String(locale || '').toLowerCase().trim();
          return productLocale === requestedLocale;
        }) || variants.find((p) => {
          const productLocale = String(p.locale || '').toLowerCase().trim();
          return productLocale === 'en';
        }) || variants[0];

        // Merge: shared fields + locale-specific Description
        const mergedProduct: Product = {
          ...sharedFields,
          Description: localeSpecific.Description,
          locale: locale, // Set to current locale for tracking
        };

        mergedProducts.push(mergedProduct);
      });

      // Limit to 4 products
      const filtered = mergedProducts.slice(0, 4);
      console.log('[RelatedProducts] Merged and filtered related items', {
        currentKey,
        totalVariants: allItems.length,
        uniqueProducts: mergedProducts.length,
        filteredCount: filtered.length,
        filteredIds: filtered.map((p) => ({ id: p.id, documentId: p.documentId, name: p.Name, locale: p.locale })),
      });

      setRelatedProducts(filtered);
    } catch (err) {
      console.error('[RelatedProducts] Error fetching related products', err);
      setRelatedError(
        err instanceof Error
          ? err.message
          : 'An error occurred while loading related products'
      );
      setRelatedProducts([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  const fetchSameNameProducts = async (productName: string, currentProduct: Product) => {
    if (!productName) return;

    try {
      setSameNameLoading(true);
      setSameNameError(null);

      const apiKey = process.env.NEXT_STRAPI_API_KEY;
      const headers: HeadersInit = {};

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // Fetch products with same Name (shared field)
      // Fetch without locale filter to get all locale variants
      // Then merge shared fields with locale-specific Description
      const encodedName = encodeURIComponent(productName);
      const sameNameUrl = `/strapi/api/products?filters[Name][$eq]=${encodedName}&fields[0]=documentId&fields[1]=locale&fields[2]=Name&fields[3]=Description&fields[4]=Variety_Name&fields[5]=Group_Name&populate[Image][fields][1]=url&pagination[page]=1&pagination[pageSize]=100`;
      console.log('[SameNameProducts] Fetching products with same Name (all locales)', {
        productName,
        encodedName,
        locale,
        sameNameUrl,
        currentKey: currentProduct.documentId || String(currentProduct.id),
      });

      const response = await fetch(
        sameNameUrl,
        {
          headers,
        }
      );

      if (!response.ok) {
        console.error('[SameNameProducts] Non-OK response', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Failed to fetch same name products');
      }

      const data = await response.json();
      const allItems: Product[] = data?.data ?? [];
      console.log('[SameNameProducts] Raw same name items (all locales)', {
        count: allItems.length,
        ids: allItems.map((p) => ({ id: p.id, documentId: p.documentId, name: p.Name, varietyName: p.Variety_Name, locale: p.locale })),
      });

      // Group by documentId and merge shared fields with locale-specific Description
      const productsByDocumentId = new Map<string, Product[]>();
      allItems.forEach((product) => {
        const key = product.documentId || String(product.id);
        if (!productsByDocumentId.has(key)) {
          productsByDocumentId.set(key, []);
        }
        productsByDocumentId.get(key)!.push(product);
      });

      // Filter out current product and merge locale variants
      const currentKey = currentProduct.documentId || String(currentProduct.id);
      const mergedProducts: Product[] = [];

      productsByDocumentId.forEach((variants, docId) => {
        if (docId === currentKey) return; // Skip current product

        if (variants.length === 0) return;

        // Get shared fields from first variant (they should be identical across locales)
        const sharedFields = variants[0];

        // Find locale-specific variant for Description
        // Use case-insensitive matching and trim whitespace
        const localeSpecific = variants.find((p) => {
          const productLocale = String(p.locale || '').toLowerCase().trim();
          const requestedLocale = String(locale || '').toLowerCase().trim();
          return productLocale === requestedLocale;
        }) || variants.find((p) => {
          const productLocale = String(p.locale || '').toLowerCase().trim();
          return productLocale === 'en';
        }) || variants[0];

        // Merge: shared fields + locale-specific Description
        const mergedProduct: Product = {
          ...sharedFields,
          Description: localeSpecific.Description,
          locale: locale, // Set to current locale for tracking
        };

        mergedProducts.push(mergedProduct);
      });

      // Limit to 6 products
      const filtered = mergedProducts.slice(0, 6);
      console.log('[SameNameProducts] Merged and filtered same name items', {
        currentKey,
        totalVariants: allItems.length,
        uniqueProducts: mergedProducts.length,
        filteredCount: filtered.length,
        filteredIds: filtered.map((p) => ({ id: p.id, documentId: p.documentId, name: p.Name, locale: p.locale })),
      });

      setSameNameProducts(filtered);
    } catch (err) {
      console.error('[SameNameProducts] Error fetching same name products', err);
      setSameNameError(
        err instanceof Error
          ? err.message
          : 'An error occurred while loading same name products'
      );
      setSameNameProducts([]);
    } finally {
      setSameNameLoading(false);
    }
  };


  return (
    <PageLayout currentPage="/products">
      {/*Page Header Start*/}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{product ? (product.Variety_Name || product.Name) : t('productDetails.title')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li><Link href="/products">{t('nav.products')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{product ? (product.Variety_Name || product.Name) : t('productDetails.title')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/*Page Header End*/}

      {/*Start Product Details*/}
      <section className="product-details">
        <div className="container">
          {loading && (
            <div className="text-center" style={{ padding: '50px' }}>
              <p>{t('common.loading')}</p>
            </div>
          )}
          {error && !loading && (
            <div className="text-center" style={{ padding: '50px' }}>
              <p>{error}</p>
              <Link href="/products" className="thm-btn">{t('nav.products')}</Link>
            </div>
          )}
          {product && !loading && !error && (
            <div className="row">
              <div className="col-lg-6 col-xl-6">
                <div className="product-details__left">
                  <div className="product-details__left-inner">
                    <div className="product-details__content-box">
                      <div
                        key={`carousel-${product.id}-${getAllProductImages(product).length}`}
                        className="swiper-container"
                        id="shop-details-one__carousel"
                      >
                        <div className="swiper-wrapper">
                          {getAllProductImages(product).map((imageUrl, index) => (
                            <div key={`${product.id}-img-${index}`} className="swiper-slide">
                              <div className="product-details__img">
                                <img src={imageUrl} alt={`${product.Name} - Image ${index + 1}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="product-details__nav">
                        <div className="swiper-button-next" id="product-details__swiper-button-prev">
                          <i className="fal fa-long-arrow-left" />
                        </div>
                        <div className="swiper-button-prev" id="product-details__swiper-button-next">
                          <i className="fal fa-long-arrow-right" />
                        </div>
                      </div>
                    </div>
                    <div className="product-details__thumb-box">
                      <div
                        key={`thumb-${product.id}-${getAllProductImages(product).length}`}
                        className="swiper-container"
                        id="shop-details-one__thumb"
                      >
                        <div className="swiper-wrapper">
                          {getAllProductImages(product).map((imageUrl, index) => (
                            <div key={`${product.id}-thumb-${index}`} className="swiper-slide">
                              <div className="product-details__thumb-img">
                                <img src={imageUrl} alt={`${product.Name} - Thumbnail ${index + 1}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-xl-6">
                <div className="product-details__right">
                  <div className="product-details__top">
                    <h3 className="product-details__title">
                      {product.Variety_Name || product.Name}
                    </h3>
                    {product.Variety_Name && product.Name && product.Variety_Name !== product.Name && (
                      <p className="product-details__subtitle" style={{ marginTop: '10px', fontSize: '18px', color: '#666', fontWeight: 'bold' }}>
                        {product.Name}
                      </p>
                    )}
                  </div>
                  <div className="product-details__content">
                    <div className="product-details__content-text1">
                      {formatDescription(product.Description) || (
                        <p>{t('productDetails.description')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Social Media Posts Section */}
          {product && !loading && !error && (
            <SocialMediaPosts
              instagramUrl={product.Instagram_Post_URL || undefined}
              youtubeUrl={product.YouTube_Post_URL || undefined}
              facebookUrl={product.Facebook_Post_URL || undefined}
            />
          )}
          {/* Same Name Products Section */}
          {!loading && !error && !sameNameLoading && sameNameProducts.length > 0 && (
            <div className="container" style={{ marginTop: '40px' }}>
              <div className="row">
                <div className="col-12">
                  <h4 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' }}>
                    {t('productDetails.moreVarieties', { name: product?.Name || '' })}
                  </h4>
                  <div className="row">
                    {sameNameProducts.map((item, index) => {
                      const imageUrl = getProductImage(item);
                      const productUrl = `/products/${item.documentId || item.id}`;
                      return (
                        <div
                          key={item.id}
                          className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                          style={{ marginBottom: '20px' }}
                        >
                          <Link href={productUrl} className="single-product-style1" style={{ height: '100%', textDecoration: 'none', display: 'block', color: 'inherit' }}>
                            <div className="single-product-style1__img">
                              <img src={imageUrl} alt={item.Name} />
                              <img src={imageUrl} alt={item.Name} />
                            </div>
                            <div className="single-product-style1__content">
                              <div className="single-product-style1__content-left">
                                <h4 style={{ fontSize: '14px', marginBottom: '5px' }}>
                                  {item.Variety_Name || item.Name}
                                </h4>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          {!loading && !error && !relatedLoading && relatedProducts.length > 0 && (
            <section className="related-products" style={{ marginTop: '60px' }}>
              <div className="container">
                <div className="related-products__title text-center">
                  <h3 style={{ marginBottom: '10px' }}>{t('productDetails.relatedProducts')}</h3>
                  <p style={{ color: '#666' }}>{t('productDetails.relatedProductsDesc')}</p>
                </div>
                <div className="row">
                  {relatedProducts.map((item, index) => {
                    const imageUrl = getProductImage(item);
                    const productUrl = `/products/${item.documentId || item.id}`;
                    return (
                      <div
                        key={item.id}
                        className="col-xl-3 col-lg-4 col-md-6"
                      >
                        <div className="single-product-style1" style={{ maxWidth: 370, width: '100%', margin: '0 auto' }}>
                          <div className="single-product-style1__img" style={{ position: 'relative' }}>
                            <Link href={productUrl} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
                              <img src={imageUrl} alt={item.Name} />
                              <img src={imageUrl} alt={item.Name} />
                            </Link>
                            {index % 3 === 0 && (
                              <ul className="single-product-style1__overlay">
                                <li>
                                  <p>New</p>
                                </li>
                              </ul>
                            )}
                            <ul className="single-product-style1__info" onClick={(e) => e.stopPropagation()}>
                              <li>
                                <button
                                  type="button"
                                  title="Add to Wishlist"
                                  onClick={(e) => e.preventDefault()}
                                  style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--farmology-white)',
                                    boxShadow: '0px 0px 35px 0px rgba(0, 0, 0, .2)',
                                    color: 'var(--farmology-base)',
                                    fontSize: '15px',
                                    lineHeight: 0,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 200ms linear',
                                    transitionDelay: '0.1s',
                                    padding: 0
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-white)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-base)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-base)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-white)';
                                  }}
                                >
                                  <i className="fa fa-regular fa-heart" />
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  title="Add to cart"
                                  onClick={(e) => e.preventDefault()}
                                  style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--farmology-white)',
                                    boxShadow: '0px 0px 35px 0px rgba(0, 0, 0, .2)',
                                    color: 'var(--farmology-base)',
                                    fontSize: '15px',
                                    lineHeight: 0,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 200ms linear',
                                    transitionDelay: '0.1s',
                                    padding: 0
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-white)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-base)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-base)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-white)';
                                  }}
                                >
                                  <i className="fa fa-solid fa-cart-plus" />
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  title="Quick View"
                                  onClick={(e) => e.preventDefault()}
                                  style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--farmology-white)',
                                    boxShadow: '0px 0px 35px 0px rgba(0, 0, 0, .2)',
                                    color: 'var(--farmology-base)',
                                    fontSize: '15px',
                                    lineHeight: 0,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 200ms linear',
                                    transitionDelay: '0.1s',
                                    padding: 0
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-white)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-base)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-base)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-white)';
                                  }}
                                >
                                  <i className="fa fa-regular fa-eye" />
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  title="Compare"
                                  onClick={(e) => e.preventDefault()}
                                  style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--farmology-white)',
                                    boxShadow: '0px 0px 35px 0px rgba(0, 0, 0, .2)',
                                    color: 'var(--farmology-base)',
                                    fontSize: '15px',
                                    lineHeight: 0,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 200ms linear',
                                    transitionDelay: '0.1s',
                                    padding: 0
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-white)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-base)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--farmology-base)';
                                    e.currentTarget.style.backgroundColor = 'var(--farmology-white)';
                                  }}
                                >
                                  <i className="fa fa-solid fa-repeat" />
                                </button>
                              </li>
                            </ul>
                          </div>
                          <div className="single-product-style1__content">
                            <div className="single-product-style1__content-left">
                              <Link href={productUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h4>
                                  {item.Variety_Name || item.Name}
                                </h4>
                              </Link>
                              {item.Variety_Name && item.Name && item.Variety_Name !== item.Name && (
                                <p>{item.Name}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

