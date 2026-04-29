import { Document, Schema, model } from 'mongoose';
import validator  from 'validator';

interface BookDocumentInterface extends Document {
  title: string,
  author: string,
  genre: 'Fiction' | 'Non-Fiction' | 'Science' | 'History' | 'Fantasy' | 'Biography',
  year: number,
  isbn: string,
  pages: number,
  avaliable: boolean,
  rating?: number
}

const BookSchema = new Schema<BookDocumentInterface>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Fantasy', 'Biography'],
  },
  year: {
    type: Number,
    required: true,
    validate: {
      // tiene que ser un numero valido entre 1000 y el año actual
      validator: (value: number) => value >= 1000 && value <= new Date().getFullYear(),
      message: 'Year must be a valid number between 1000 and the current year',
    },
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isISBN(value, 13),
      message: 'ISBN must be a valid 13-digit number',
    },
  },
  pages: {
    type: Number,
    required: true,
    validate: {
      // tiene que ser un numero positivo
      validator: (value: number) => value > 0,
      message: 'Pages must be a positive number',
    },
  },
  avaliable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating must be at most 5'],
  },  
  
});

// colección
export const Book = model<BookDocumentInterface>('Note', BookSchema);