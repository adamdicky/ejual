import {
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
import { CheckCircle2, Grid2X2, Search, Shirt, Sparkles } from 'lucide-react'

type ShopProduct = {
  category: string
  categoryID: number
  description: string
  featured: boolean
  id: number
  imageAlt: string
  imageURL: string | null
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

export function ShopCatalogue({
  activeCategoryID,
  categories,
  products,
  query,
  sort,
}: ShopCatalogueProps) {
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
      <Group align="center" justify="space-between">
        <ScrollArea type="never" w={{ base: '100%', md: 'auto' }}>
          <Group gap="xs" wrap="nowrap">
            <Button
              component="a"
              href={categoryHref(null, query, sort)}
              leftSection={<Grid2X2 size={17} />}
              variant={activeCategoryID === null ? 'filled' : 'default'}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                component="a"
                href={categoryHref(category.id, query, sort)}
                key={category.id}
                leftSection={<Shirt size={17} />}
                variant={activeCategoryID === category.id ? 'filled' : 'default'}
              >
                {category.label}
              </Button>
            ))}
          </Group>
        </ScrollArea>
        <Box component="form" action="/shop" w={{ base: '100%', md: 'auto' }}>
          <Group grow>
            {activeCategoryID ? <input name="category" type="hidden" value={activeCategoryID} /> : null}
            <TextInput
              defaultValue={query}
              leftSection={<Search size={16} />}
              name="q"
              placeholder="Search clothing"
            />
            <NativeSelect
              data={sortOptions}
              defaultValue={sort}
              label="Sort by"
              name="sort"
            />
            <Button type="submit" variant="default">
              Apply
            </Button>
          </Group>
        </Box>
      </Group>

      {visibleProducts.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {visibleProducts.map((product) => (
            <Card key={product.id} p={0}>
              <Stack gap={0}>
                <Box pos="relative">
                  {product.imageURL ? (
                    <Image
                      alt={product.imageAlt}
                      fit="contain"
                      h={{ base: 320, md: 380 }}
                      p="xl"
                      src={product.imageURL}
                    />
                  ) : (
                    <Stack align="center" h={{ base: 320, md: 380 }} justify="center">
                      <Shirt color="var(--mantine-color-gray-5)" size={72} strokeWidth={1.4} />
                      <Text c="dimmed" size="sm">
                        Image coming soon
                      </Text>
                    </Stack>
                  )}
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
