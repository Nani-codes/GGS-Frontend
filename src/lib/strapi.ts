export function getStrapiHeaders(): HeadersInit {
  const apiKey = process.env.NEXT_STRAPI_API_KEY;
  return apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
}

export function getStrapiMediaUrl(url?: string | null): string {
  if (!url) {
    return '';
  }

  return url.startsWith('/strapi') ? url : `/strapi${url}`;
}

export async function fetchProductCategories(locale: string): Promise<string[]> {
  const headers = getStrapiHeaders();

  try {
    const response = await fetch(
      `/strapi/api/products/categories?locale=${encodeURIComponent(locale)}`,
      { headers }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data
          .filter((category: unknown): category is string => typeof category === 'string')
          .map((category: string) => category.trim())
          .filter(Boolean)
          .sort();
      }
    }
  } catch (error) {
    console.warn('Product categories endpoint failed, using fallback:', error);
  }

  const query = new URLSearchParams({
    'fields[0]': 'Group_Name',
    'pagination[page]': '1',
    'pagination[pageSize]': '200',
  });

  const response = await fetch(`/strapi/api/products?${query.toString()}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch product categories');
  }

  const data = await response.json();
  const products = data.data || [];
  const categoriesSet = new Set<string>();

  products.forEach((product: { Group_Name?: string }) => {
    if (product.Group_Name && typeof product.Group_Name === 'string') {
      categoriesSet.add(product.Group_Name.trim());
    }
  });

  return Array.from(categoriesSet).sort();
}
