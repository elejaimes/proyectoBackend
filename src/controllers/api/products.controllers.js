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
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function getAllProducts(req, res, next) {
    try {
        const products = await ProductService.getAllProducts()
        res.json(products)
    } catch (error) {
        next(error)
    }
}
export async function getProductById(req, res, next) {
    try {
        const { pid } = req.params
        const product = await ProductService.getProductById(pid)

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json(product)
    } catch (error) {
        next(error)
    }
}
export async function createProduct(req, res, next) {
    try {
        if (req.file) {
            req.body.photoUrl = req.file.path
        }

        const createdProduct = await ProductService.createProduct(req.body)
        res.status(201).json(createdProduct)
    } catch (error) {
        next(error)
    }
}
export async function modifyProductById(req, res, next) {
    try {
        const { pid } = req.params
        const updatedData = req.body

        const modifiedProduct = await ProductService.modifyProductById(
            pid,
            updatedData
        )
        if (!modifiedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json(modifiedProduct)
    } catch (error) {
        next(error)
    }
}
export async function removeProductById(req, res, next) {
    try {
        const { pid } = req.params

        const deletedProduct = await ProductService.removeProductById(pid)
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json(deletedProduct)
    } catch (error) {
        next(error)
    }
}
export async function changeProductPhoto(req, res, next) {
    try {
        const { pid } = req.params

        if (!req.file) {
            return res
                .status(400)
                .json({ message: 'Debe cargar una foto válida' })
        }

        const newPhotoPath = req.file.path
        const modifiedProduct = await ProductService.changeProductPhoto(
            pid,
            newPhotoPath
        )

        if (!modifiedProduct) {
            return res.status(400).json({ message: 'Producto no encontrado' })
        }

        res.json(modifiedProduct)
    } catch (error) {
        next(error)
    }
}
