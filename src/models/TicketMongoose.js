import { Schema, model } from 'mongoose'
import { randomUUID } from 'crypto'

const collection = 'tickets'

const ticketSchema = new Schema(
    {
        code: {
            type: String,
            default: () => randomUUID(),
            required: true,
            unique: true,
        },
        cartItems: [
            {
                type: Schema.Types.ObjectId,
                ref: 'carts',
                required: true,
            },
        ],
        status: {
            type: String,
            required: true,
            default: 'Pending',
        },
        totalPrice: {
            type: Number,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        strict: 'throw',
        versionKey: false,
    }
)

export const TicketModel = model(collection, ticketSchema)
