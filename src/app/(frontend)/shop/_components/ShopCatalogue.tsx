'use client'

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  NativeSelect,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { CheckCircle2, ChevronLeft, ChevronRight, Search, Shirt, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDeferredValue, useEffect, useState } from 'react'

type ShopProduct = {
  category: string
  categoryID: number
  description: string
  featured: boolean
  id: number
  images: {
    alt: string
    url: string
  }[]
  maxPrice: number
  minPrice: number
  productName: string
  sellerName: string
  stock: number
  updatedAt: string
  variantCount: number
}

type CategoryOption = {
  id: number
  label: string
}

type ShopCatalogueProps = {
  activeCategoryID: number | null
  categories: CategoryOption[]
  products: ShopProduct[]
  query: string
  sort: string
}

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
]

function formatPrice(value: number) {
  return `RM ${value.toFixed(2)}`
}

function formatPriceRange(product: ShopProduct) {
  if (product.minPrice === product.maxPrice) return formatPrice(product.minPrice)
  return `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`
}

function categoryHref(categoryID: number | null, query: string, sort: string) {
  const params = new URLSearchParams()
  if (categoryID) params.set('category', String(categoryID))
  if (query) params.set('q', query)
  if (sort !== 'featured') params.set('sort', sort)
  const queryString = params.toString()
  return queryString ? `/shop?${queryString}` : '/shop'
}

function ProductImageCarousel({ images, productName }: Pick<ShopProduct, 'images' | 'productName'>) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [images])

  if (!images.length) {
    return (
      <Stack align="center" h={{ base: 280, md: 360 }} justify="center">
        <Shirt color="var(--mantine-color-gray-5)" size={72} strokeWidth={1.4} />
        <Text c="dimmed" size="sm">
          Image coming soon
        </Text>
      </Stack>
    )
  }

  const currentImage = images[index]
  const canScroll = images.length > 1

  return (
    <Box pos="relative">
      <Image alt={currentImage.alt} fit="contain" h={{ base: 280, md: 360 }} p="xl" src={currentImage.url} />
      {canScroll ? (
        <>
          <ActionIcon
            aria-label={`Previous image for ${productName}`}
            left={14}
            onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)}
            pos="absolute"
            radius="xl"
            style={{ transform: 'translateY(-50%)' }}
            top="50%"
            variant="white"
          >
            <ChevronLeft size={18} />
          </ActionIcon>
          <ActionIcon
            aria-label={`Next image for ${productName}`}
            onClick={() => setIndex((current) => (current + 1) % images.length)}
            pos="absolute"
            radius="xl"
            right={14}
            style={{ transform: 'translateY(-50%)' }}
            top="50%"
            variant="white"
          >
            <ChevronRight size={18} />
          </ActionIcon>
          <Badge bottom={14} pos="absolute" right={14} variant="light">
            {index + 1} / {images.length}
          </Badge>
        </>
      ) : null}
    </Box>
  )
}

export function ShopCatalogue({
  activeCategoryID,
  categories,
  products,
  query,
  sort,
}: ShopCatalogueProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(query)
  const deferredSearchValue = useDeferredValue(searchValue)

  useEffect(() => {
    setSearchValue(query)
  }, [query])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (deferredSearchValue === query) return

      const params = new URLSearchParams()
      if (activeCategoryID) params.set('category', String(activeCategoryID))
      if (deferredSearchValue.trim()) params.set('q', deferredSearchValue.trim())
      if (sort !== 'featured') params.set('sort', sort)
      const queryString = params.toString()
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [activeCategoryID, deferredSearchValue, pathname, query, router, sort])

  const updateSort = (value: string) => {
    const nextSort = value || 'featured'
    const params = new URLSearchParams()
    if (activeCategoryID) params.set('category', String(activeCategoryID))
    if (searchValue.trim()) params.set('q', searchValue.trim())
    if (nextSort !== 'featured') params.set('sort', nextSort)
    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }

  const normalizedQuery = query.trim().toLowerCase()
  const visibleProducts = products
    .filter((product) => {
      const matchesCategory = !activeCategoryID || product.categoryID === activeCategoryID
      const matchesQuery =
        !normalizedQuery ||
        product.productName.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.sellerName.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
    .sort((first, second) => {
      if (sort === 'newest') return Date.parse(second.updatedAt) - Date.parse(first.updatedAt)
      if (sort === 'price-asc') return first.minPrice - second.minPrice
      if (sort === 'price-desc') return second.minPrice - first.minPrice
      return Number(second.featured) - Number(first.featured) || Date.parse(second.updatedAt) - Date.parse(first.updatedAt)
    })

  return (
    <Stack gap="lg">
      <ScrollArea offsetScrollbars scrollbarSize={6} type="auto">
        <Group gap="xs" wrap="nowrap">
            <Button
              component={Link}
              href={categoryHref(null, query, sort)}
              miw="max-content"
              variant={activeCategoryID === null ? 'filled' : 'default'}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                component={Link}
                href={categoryHref(category.id, query, sort)}
                key={category.id}
                miw="max-content"
                variant={activeCategoryID === category.id ? 'filled' : 'default'}
              >
                {category.label}
              </Button>
            ))}
        </Group>
      </ScrollArea>

      <Group align="end" gap="md" wrap="wrap">
        <TextInput
          flex={1}
          leftSection={<Search size={16} />}
          maw={{ md: 'calc(100% - 16rem)' }}
          miw={{ base: '100%', md: 280 }}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          placeholder="Search clothing"
          value={searchValue}
        />
        <NativeSelect
          data={sortOptions}
          label="Sort by"
          onChange={(event) => updateSort(event.currentTarget.value)}
          style={{ flex: '0 0 220px' }}
          value={sort}
        />
      </Group>

      {visibleProducts.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {visibleProducts.map((product) => (
            <Card key={product.id} p={0}>
              <Stack gap={0}>
                <Box pos="relative">
                  <ProductImageCarousel images={product.images} productName={product.productName} />
                  {product.featured ? (
                    <Badge
                      leftSection={<Sparkles size={13} />}
                      pos="absolute"
                      radius="sm"
                      top={18}
                      variant="light"
                      left={18}
                    >
                      Featured
                    </Badge>
                  ) : null}
                </Box>
                <Stack gap="xs" p="lg">
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">
                      {product.sellerName} · {product.category}
                    </Text>
                    <Badge
                      color={product.stock > 0 ? 'teal' : 'orange'}
                      leftSection={product.stock > 0 ? <CheckCircle2 size={13} /> : undefined}
                      variant="light"
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </Group>
                  <Group align="flex-end" justify="space-between">
                    <Stack gap={2}>
                      <Text fw={700} size="lg">
                        {product.productName}
                      </Text>
                      <Text c="dimmed" lineClamp={2} size="sm">
                        {product.description}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {product.variantCount} {product.variantCount === 1 ? 'variant' : 'variants'}
                      </Text>
                    </Stack>
                    <Text fw={700} size="lg">
                      {formatPriceRange(product)}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Card py="xl">
          <Stack align="center" gap="sm" ta="center">
            <Shirt color="var(--mantine-color-gray-5)" size={44} strokeWidth={1.5} />
            <Text fw={700}>No matching products</Text>
            <Text c="dimmed" maw={420}>
              Try another category, search term, or sort option.
            </Text>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
