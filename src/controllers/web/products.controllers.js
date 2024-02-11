import { productService } from '../../services/products.service.js'

export async function getPaginatedProducts(req, res) {
    try {
        // Capturar los parámetros de consulta de la solicitud HTTP
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 9
        const sort = req.query.sort || 'price'
        const sortOrder = req.query.sortOrder || 'asc'
        const search = req.query.search || ''
        const category = req.query.category || 'All'

        // Validar el parámetro de orden
        const validSortOptions = ['price', 'status', 'stock'] // Lista de opciones de orden válidas
        if (!validSortOptions.includes(sort.toLowerCase())) {
            // Convertido a minúsculas para la comparación
            sort = 'price' // Orden predeterminado si el parámetro de orden no es válido
        }

        // Obtener productos paginados del servicio
        let products = await productService.getPaginatedProducts(
            page,
            limit,
            sort,
            sortOrder,
            search,
            category
        )

        products = products.map((product) => product.toJSON())

        // Lógica para calcular la información de paginación
        const totalProductsCount = await productService.getTotalProductsCount()
        const totalPages = Math.ceil(totalProductsCount / limit)
        const prevLink =
            page > 1
                ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}&search=${search}&category=${category}`
                : null
        const nextLink =
            page < totalPages
                ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}&search=${search}&category=${category}`
                : null
        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push({
                number: i,
                link: `/products?page=${i}&limit=${limit}&sort=${sort}&search=${search}&category=${category}`,
                isActive: i === page,
            })
        }

        // Renderizar la vista de productos con los datos obtenidos
        res.render('products', {
            products,
            page,
            limit,
            sort,
            search,
            category: category,
            pagination: {
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink,
                nextLink,
                pages,
            },
        })
    } catch (error) {
        // Manejar errores
        res.status(500).send('Error interno del servidor')
    }
}

export async function getProductDetailPage(req, res) {
    try {
        const product = await productService.getProductById(req.params.pid)
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        res.render('productDetailPage', { product })
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
}
