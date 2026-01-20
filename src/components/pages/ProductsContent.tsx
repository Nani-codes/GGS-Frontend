"use client";

import { useEffect, useState } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';
const qs = require('qs');

// ===== LAYOUT CONFIGURATION =====
// Adjust these values to change products per row:
// - col-12 = 1 product per row (full width)
// - col-6 = 2 products per row (half width)
// - col-4 = 3 products per row (one-third width)
// - col-3 = 4 products per row (one-quarter width)
const MOBILE_COLUMNS = 'col-6'; // 2 products per row on mobile (change to 'col-12' for 1, 'col-4' for 3, etc.)
const TABLET_COLUMNS = 'col-md-6'; // 2 products per row on tablet
const DESKTOP_COLUMNS = 'col-lg-6'; // 2 products per row on desktop
const LARGE_DESKTOP_COLUMNS = 'col-xl-4'; // 3 products per row on large desktop

// ===== TYPES =====
interface Product {
  id: number;
  documentId: string;
  locale: string;
  Name: string;
  Description: string;
  Variety_Name: string;
  Image: any;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface ProductsContentProps {
  category?: string;
  subcategory?: string;
  search?: string;
}

export function ProductsContent({ category, subcategory, search: initialSearch }: ProductsContentProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 25,
    pageCount: 1,
    total: 0
  });
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_STRAPI_API_KEY;
      const headers: HeadersInit = apiKey
        ? { Authorization: `Bearer ${apiKey}` }
        : {};

      const queryParams: any = {
        fields: ['documentId', 'Name', 'Description', 'Variety_Name', 'Group_Name', 'locale'],
        populate: {
          Image: {
            fields: ['url'],
          },
        },
        pagination: {
          page,
          pageSize: 100, // Fetch more to account for locale variants, will deduplicate
        },
      };

      // Build filters object
      // Note: Filters use shared fields (Name, Group_Name) which are consistent across locales
      const filters: any = {};
      const filterConditions: any[] = [];

      // Add category filter if provided (Group_Name is a shared field)
      if (category && category.trim()) {
        filterConditions.push({
          Group_Name: {
            $eq: category.trim(),
          },
        });
      }

      // Add subcategory filter if provided (Name is a shared field)
      if (subcategory && subcategory.trim()) {
        filterConditions.push({
          Name: {
            $eq: subcategory.trim(),
          },
        });
      }

      // Add search filter if provided
      // Search in shared fields (Name, Variety_Name, Group_Name) and localized Description
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        filterConditions.push({
          $or: [
            { Name: { $containsi: searchTerm } },
            { Description: { $containsi: searchTerm } },
            { Variety_Name: { $containsi: searchTerm } },
            { Group_Name: { $containsi: searchTerm } },
          ],
        });
      }

      // Build final filters structure
      if (filterConditions.length === 1) {
        // Single condition - use it directly
        queryParams.filters = filterConditions[0];
      } else if (filterConditions.length > 1) {
        // Multiple conditions - combine with $and
        queryParams.filters = {
          $and: filterConditions,
        };
      }

      const query = qs.stringify(queryParams, { encodeValuesOnly: true });

      // Fetch without locale filter to get all locale variants
      // We'll merge shared fields with locale-specific Description
      const response = await fetch(
        `/strapi/api/products?${query}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: ProductsResponse = await response.json();
      console.log('Products data (all locales):', data);

      // Group products by documentId and merge shared fields with locale-specific Description
      const productsByDocumentId = new Map<string, Product[]>();

      // Group all products by documentId
      data.data.forEach((product) => {
        const key = product.documentId || String(product.id);
        if (!productsByDocumentId.has(key)) {
          productsByDocumentId.set(key, []);
        }
        productsByDocumentId.get(key)!.push(product);
      });

      // Merge shared fields with locale-specific Description
      const mergedProducts: Product[] = [];
      productsByDocumentId.forEach((variants) => {
        if (variants.length === 0) return;

        // Get shared fields from first variant (they should be identical across locales)
        const sharedFields = variants[0];

        // Find locale-specific variant for Description
        const localeSpecific = variants.find((p) => p.locale === locale) || variants[0];

        // Merge: shared fields + locale-specific Description
        const mergedProduct: Product = {
          ...sharedFields,
          Description: localeSpecific.Description,
          locale: locale, // Set to current locale for tracking
        };

        mergedProducts.push(mergedProduct);
      });

      console.log('Merged products:', {
        totalVariants: data.data.length,
        uniqueProducts: mergedProducts.length,
        locale,
      });

      // Apply pagination to merged products
      const pageSize = 25;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedProducts = mergedProducts.slice(startIndex, endIndex);

      // Calculate pagination metadata
      const totalPages = Math.ceil(mergedProducts.length / pageSize);

      setProducts(paginatedProducts);
      setPagination({
        page,
        pageSize,
        pageCount: totalPages,
        total: mergedProducts.length,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const apiKey = process.env.NEXT_STRAPI_API_KEY;
      const headers: HeadersInit = apiKey
        ? { Authorization: `Bearer ${apiKey}` }
        : {};

      // Skip custom endpoint if it's locale-aware (it returns different results per locale)
      // Always use fallback to ensure consistent categories across all locales
      // Fallback: fetch products and extract categories
      // Fetch without locale filter since Group_Name is a shared field
      const query = qs.stringify(
        {
          fields: ['documentId', 'Group_Name'],
          pagination: {
            page: 1,
            pageSize: 1000, // Large page size to get all categories
          },
        },
        { encodeValuesOnly: true }
      );

      const response = await fetch(
        `/strapi/api/products?${query}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products for categories');
      }

      const data = await response.json();
      const products = data.data || [];

      // Deduplicate by documentId and extract unique Group_Name values
      // Group_Name is a shared field, so we can use any variant
      const seenDocumentIds = new Set<string>();
      const categoriesSet = new Set<string>();

      products.forEach((product: any) => {
        const docId = product.documentId || String(product.id);
        // Only process each documentId once
        if (!seenDocumentIds.has(docId)) {
          seenDocumentIds.add(docId);
          if (product.Group_Name && typeof product.Group_Name === 'string') {
            categoriesSet.add(product.Group_Name.trim());
          }
        }
      });

      // Convert to sorted array
      const sortedCategories = Array.from(categoriesSet).sort();
      setCategories(sortedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    if (!category || !category.trim()) {
      setSubCategories([]);
      return;
    }

    try {
      setSubCategoriesLoading(true);
      const apiKey = process.env.NEXT_STRAPI_API_KEY;
      const headers: HeadersInit = apiKey
        ? { Authorization: `Bearer ${apiKey}` }
        : {};

      // Try custom endpoint first
      try {
        const encodedCategory = encodeURIComponent(category.trim());
        const response = await fetch(
          `/strapi/api/products/subcategories?locale=${locale}&category=${encodedCategory}`,
          { headers }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            setSubCategories(data.data);
            setSubCategoriesLoading(false);
            return;
          }
        }
      } catch (endpointError) {
        console.warn('Custom subcategories endpoint failed, using fallback:', endpointError);
      }

      // Fallback: fetch products and extract Name
      // Fetch without locale filter since Name and Group_Name are shared fields
      const query = qs.stringify(
        {
          fields: ['documentId', 'Name', 'Group_Name'],
          filters: {
            Group_Name: {
              $eq: category.trim(),
            },
          },
          pagination: {
            page: 1,
            pageSize: 1000, // Large page size to get all sub-categories
          },
        },
        { encodeValuesOnly: true }
      );

      const response = await fetch(
        `/strapi/api/products?${query}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products for sub-categories');
      }

      const data = await response.json();
      const products = data.data || [];

      // Deduplicate by documentId and extract unique Name values
      // Name is a shared field, so we can use any variant
      const seenDocumentIds = new Set<string>();
      const subCategoriesSet = new Set<string>();

      products.forEach((product: any) => {
        const docId = product.documentId || String(product.id);
        // Only process each documentId once
        if (!seenDocumentIds.has(docId)) {
          seenDocumentIds.add(docId);
          if (product.Name && typeof product.Name === 'string') {
            subCategoriesSet.add(product.Name.trim());
          }
        }
      });

      // Convert to sorted array
      const sortedSubCategories = Array.from(subCategoriesSet).sort();
      setSubCategories(sortedSubCategories);
    } catch (err) {
      console.error('Error fetching sub-categories:', err);
      setSubCategories([]);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when category, subcategory, or search query changes
    setCurrentPage(1);
  }, [category, subcategory, searchQuery]);

  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, currentPage, category, subcategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    fetchSubCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, locale]);

  // Handle click outside to close dropdown on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      const dropdownWrapper = document.querySelector('.product__category-dropdown-wrapper');

      if (dropdownWrapper && !dropdownWrapper.contains(target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getProductImage = (product: Product) => {
    if (!product.Image) {
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


  const renderGridProduct = (product: Product, index: number) => {
    const imageUrl = getProductImage(product);
    const imageIndex = (index % 12) + 1;

    // Combine all column classes for responsive layout
    const columnClasses = `${MOBILE_COLUMNS} ${TABLET_COLUMNS} ${DESKTOP_COLUMNS} ${LARGE_DESKTOP_COLUMNS}`;
    const productUrl = `/products/${product.documentId || product.id}`;

    return (
      <div key={product.id} className={columnClasses}>
        <Link href={productUrl} className="single-product-style1" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
          <div className="single-product-style1__img">
            <Image
              src={imageUrl}
              alt={product.Name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={85}
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              className="single-product-style1__img-hover"
            />
            <Image
              src={imageUrl}
              alt={product.Name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={85}
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              className="single-product-style1__img-default"
            />
            {index % 3 === 0 && (
              <ul className="single-product-style1__overlay">
                <li>
                  <p>New</p>
                </li>
              </ul>
            )}
            {/* <ul className="single-product-style1__info" onClick={(e) => e.stopPropagation()}>
              <li>
                <a href="/products#" title="Add to Wishlist" onClick={(e) => e.preventDefault()}>
                  <i className="fa fa-regular fa-heart" />
                </a>
              </li>
              <li>
                <a href="/products#" title="Add to cart" onClick={(e) => e.preventDefault()}>
                  <i className="fa fa-solid fa-cart-plus" />
                </a>
              </li>
              <li>
                <a href="/products#" title="Quick View" onClick={(e) => e.preventDefault()}>
                  <i className="fa fa-regular fa-eye" />
                </a>
              </li>
              <li>
                <a href="/products#" title="Compare" onClick={(e) => e.preventDefault()}>
                  <i className="fa fa-solid fa-repeat" />
                </a>
              </li>
            </ul> */}
          </div>
          <div className="single-product-style1__content">
            <div className="single-product-style1__content-left">
              <h4>
                {product.Variety_Name || product.Name}
              </h4>
              {product.Variety_Name && product.Name && product.Variety_Name !== product.Name && (
                <p>{product.Name}</p>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const renderListProduct = (product: Product, index: number) => {
    const imageUrl = getProductImage(product);
    const imageIndex = (index % 12) + 1;
    const productUrl = `/products/${product.documentId || product.id}`;

    return (
      <div key={product.id} className="col-xl-6 col-lg-6">
        <Link href={productUrl} className="single-product-style2" style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="single-product-style2__img">
                <img src={imageUrl} alt={product.Name} />
                <img src={imageUrl} alt={product.Name} />
                {index % 3 === 0 && (
                  <ul className="single-product-style1__overlay">
                    <li>
                      <p>New</p>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="single-product-style2__content">
                <div className="single-product-style2__review">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>
                <div className="single-product-style2__text">
                  <h4>
                    {product.Variety_Name || product.Name}
                  </h4>
                  {product.Variety_Name && product.Name && product.Variety_Name !== product.Name && (
                    <p>{product.Name}</p>
                  )}
                </div>
                {/* <ul className="single-product-style2__info" onClick={(e) => e.stopPropagation()}>
                  <li>
                    <a href="/products#" title="Add to Wishlist" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-regular fa-heart" />
                    </a>
                  </li>
                  <li>
                    <a href="/products#" title="Add to cart" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-solid fa-cart-plus" />
                    </a>
                  </li>
                  <li>
                    <a href="/products#" title="Quick View" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-regular fa-eye" />
                    </a>
                  </li>
                  <li>
                    <a href="/products#" title="Compare" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-solid fa-repeat" />
                    </a>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const renderHeaderCategoryFilter = () => (
    <section className="product-header-filter" aria-label="Product categories">
      <div className="container">
        <div className="product-header-filter__inner">
          {categoriesLoading ? (
            <span className="product-header-filter__state">Loading...</span>
          ) : categories.length > 0 ? (
            <>
              <Link
                href="/products"
                className={`product-header-filter__pill ${!category ? 'product-header-filter__pill--active' : ''}`}
              >
                {t('nav.productCategories.allProducts')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className={`product-header-filter__pill ${category === cat ? 'product-header-filter__pill--active' : ''}`}
                >
                  {cat}
                </Link>
              ))}
            </>
          ) : (
            <span className="product-header-filter__state">No categories found</span>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <PageLayout currentPage="/products">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>
              {subcategory && category
                ? `${subcategory} - ${category} - ${t('products.pageTitle')}`
                : category
                  ? `${category} - ${t('products.pageTitle')}`
                  : t('products.pageTitle')
              }
            </h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li><Link href="/products">{t('products.pageTitle')}</Link></li>
                {category && (
                  <>
                    <li><span className="fas fa-angle-right" /></li>
                    <li>
                      {subcategory ? (
                        <Link href={`/products?category=${encodeURIComponent(category)}`}>
                          {category}
                        </Link>
                      ) : (
                        category
                      )}
                    </li>
                  </>
                )}
                {subcategory && (
                  <>
                    <li><span className="fas fa-angle-right" /></li>
                    <li>{subcategory}</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {renderHeaderCategoryFilter()}
      {/*Product Start*/}
      <section className="product">
        <div className="container">
          <div className="row">
            {/* Unified Filter Bar - appears first on mobile, last on desktop */}
            <div className="col-xl-3 col-lg-12 order-1 order-xl-2">
              <div className="product-filter-bar">
                {/* Search Section */}
                <div className="product-filter-bar__search">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Update URL with search parameter
                      const params = new URLSearchParams();
                      if (category) params.set('category', category);
                      if (subcategory) params.set('subcategory', subcategory);
                      if (searchQuery.trim()) {
                        params.set('search', searchQuery.trim());
                      } else {
                        params.delete('search');
                      }
                      const queryString = params.toString();
                      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
                      router.push(newUrl);
                    }}
                  >
                    <div className={`product-filter-bar__search-input-wrapper ${searchQuery ? 'product-filter-bar__search-input-wrapper--has-clear' : ''}`}>
                      <input
                        type="text"
                        placeholder={t('products.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                        className="product-filter-bar__search-input"
                        aria-label="Search products"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            // Update URL to remove search parameter
                            const params = new URLSearchParams();
                            if (category) params.set('category', category);
                            if (subcategory) params.set('subcategory', subcategory);
                            const queryString = params.toString();
                            const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
                            router.push(newUrl);
                          }}
                          className="product-filter-bar__clear-button"
                          aria-label="Clear search"
                          title="Clear search"
                        >
                          <i className="fa fa-times" aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="product-filter-bar__submit-button"
                        aria-label="Submit search"
                      >
                        <i className="fa fa-search" />
                      </button>
                    </div>
                  </form>
                </div>
                {/* Categories Accordion Section */}
                <div className="product-filter-bar__categories">
                  <button
                    className="product-filter-bar__categories-trigger"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-controls="categories-accordion"
                    role="button"
                    tabIndex={0}
                  >
                    {t('footer.categories')}
                    <i className={`fa fa-angle-${isDropdownOpen ? 'up' : 'down'}`} aria-hidden="true" />
                  </button>
                  <div
                    id="categories-accordion"
                    className={`product-filter-bar__categories-accordion ${isDropdownOpen ? 'product-filter-bar__categories-accordion--open' : ''}`}
                  >
                    <ul className="product-filter-bar__categories-list">
                      {!category ? (
                        <li>
                          <Link
                            href="/products"
                            onClick={() => setIsDropdownOpen(false)}
                            className={!category ? 'product-filter-bar__category-item--active' : ''}
                          >
                            {t('nav.productCategories.allProducts')}
                          </Link>
                        </li>
                      ) : (
                        <>
                          <li>
                            <Link
                              href={`/products?category=${encodeURIComponent(category)}`}
                              onClick={() => setIsDropdownOpen(false)}
                              className={category && !subcategory ? 'product-filter-bar__category-item--active' : ''}
                            >
                              All {category}
                            </Link>
                          </li>
                          {subCategoriesLoading ? (
                            <li><span className="product-filter-bar__loading-state">Loading...</span></li>
                          ) : subCategories.length > 0 ? (
                            subCategories.map((subCat) => (
                              <li key={subCat}>
                                <Link
                                  href={`/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subCat)}`}
                                  onClick={() => setIsDropdownOpen(false)}
                                  className={subcategory === subCat ? 'product-filter-bar__category-item--active' : ''}
                                >
                                  {subCat}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li><span className="product-filter-bar__empty-state">No sub-categories found</span></li>
                          )}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Products List - appears second on mobile, first on desktop */}
            <div className="col-xl-9 col-lg-12 order-2 order-xl-1">
              <div className="product__items">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="product__showing-result">
                      <div className="product__showing-text-box">
                        <p className="product__showing-text">{t('products.showingResults')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product__all">
                  <div className="product__all-tab">
                    <div className="product__all-tab-button">
                      <ul className="tabs-button-box clearfix">
                        <li
                          data-tab="#grid"
                          className={`tab-btn-item ${viewMode === 'grid' ? 'active-btn-item' : ''}`}
                          onClick={() => setViewMode('grid')}
                          style={{ cursor: 'pointer' }}
                          role="button"
                          aria-label="Grid view"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setViewMode('grid');
                            }
                          }}
                        >
                          <div className="product__all-tab-button-icon one">
                            <i className="fa fa-solid fa-bars" />
                          </div>
                        </li>
                        <li
                          data-tab="#list"
                          className={`tab-btn-item ${viewMode === 'list' ? 'active-btn-item' : ''}`}
                          onClick={() => setViewMode('list')}
                          style={{ cursor: 'pointer' }}
                          role="button"
                          aria-label="List view"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setViewMode('list');
                            }
                          }}
                        >
                          <div className="product__all-tab-button-icon">
                            <i className="fa fa-solid fa-list-ul" />
                          </div>
                        </li>
                      </ul>
                    </div>
                    {/*Start Tabs Content Box*/}
                    <div className="tabs-content-box">
                      {/*Start Tab*/}
                      <div className={`tab-content-box-item ${viewMode === 'grid' ? 'tab-content-box-item-active' : ''}`} id="grid">
                        <div className="product__all-tab-content-box-item">
                          <div className="product__all-tab-single">
                            {loading ? (
                              <div className="text-center" style={{ padding: '50px' }}>
                                <p>{t('common.loading') || 'Loading...'}</p>
                              </div>
                            ) : error ? (
                              <div className="text-center" style={{ padding: '50px' }}>
                                <p style={{ color: 'red' }}>{error}</p>
                              </div>
                            ) : products.length === 0 ? (
                              <div className="text-center" style={{ padding: '50px' }}>
                                <p>{t('products.noProducts') || 'No products found'}</p>
                              </div>
                            ) : (
                              <div className="row">
                                {products.map((product, index) => renderGridProduct(product, index))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/*End Tab*/}
                      {/*Start Tab*/}
                      <div className={`tab-content-box-item ${viewMode === 'list' ? 'tab-content-box-item-active' : ''}`} id="list">
                        <div className="product__all-tab-content-box-item">
                          <div className="product__all-tab-single">
                            {loading ? (
                              <div className="text-center" style={{ padding: '50px' }}>
                                <p>{t('common.loading') || 'Loading...'}</p>
                              </div>
                            ) : error ? (
                              <div className="text-center" style={{ padding: '50px' }}>
                                <p style={{ color: 'red' }}>{error}</p>
                              </div>
                            ) : products.length === 0 ? (
                              <div className="text-center" style={{ padding: '50px' }}>
                                <p>{t('products.noProducts') || 'No products found'}</p>
                              </div>
                            ) : (
                              <div className="row">
                                {products.map((product, index) => renderListProduct(product, index))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/*End Tab*/}
                    </div>
                    {/*End Tabs Content Box*/}
                  </div>
                  <ul className="styled-pagination text-center clearfix list-unstyled">
                    <li className={`arrow prev ${currentPage === 1 ? 'active' : ''}`}>
                      <a
                        href="/products#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                      >
                        <span className="fas fa-angle-left" />
                      </a>
                    </li>
                    {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((page) => (
                      <li key={page}>
                        <a
                          href="/products#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          style={{
                            fontWeight: currentPage === page ? 'bold' : 'normal',
                            color: currentPage === page ? '#ff6b35' : 'inherit'
                          }}
                        >
                          {page}
                        </a>
                      </li>
                    ))}
                    <li className={`arrow next ${currentPage === pagination.pageCount ? 'active' : ''}`}>
                      <a
                        href="/products#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < pagination.pageCount) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                      >
                        <span className="fas fa-angle-right" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
