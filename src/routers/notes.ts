import express from 'express';
import { Book } from '../models/note.js';

export const bookRouter = express.Router();

// crear un libro en la base de datos si ya existe un libro con el mismo isbn, se debe devolver un error adecuado
bookRouter.post('/books', async (req, res) => {
  const book = new Book(req.body);

  try {
    await book.save();
    res.status(201).send(book);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener libros (con filtro opcional por genre y author)
bookRouter.get('/books', async (req, res) => {
  const filter: any = {};
  if (req.query.genre) {
    filter.genre = req.query.genre.toString();
  }
  if (req.query.author) {
    filter.author = req.query.author.toString();
  }

  try {
    const books = await Book.find(filter);
    res.send(books);
  } catch (error) {
    res.status(500).send();
  }
});

// buscar un libro segun su id de mongodb
bookRouter.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).send();
    } else {
      res.send(book);
    }
  } catch (error) {
    res.status(400).send();
  }
});

bookRouter.patch('/books/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'author', 'genre', 'year', 'pages', 'avaliable', 'rating'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const book = await Book.findById(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
});

bookRouter.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(400).send();
  }
});

// // crear un libro en la base de datos si ya existe un libro con el mismo isbn, se debe devolver un error adecuado
// bookRouter.post('/books', (req, res) => {
//   const book = new Book(req.body);

//   book.save().then(() => {
//     res.status(201).send(book);
//   }).catch((error) => {
//     res.status(400).send(error);
//   });
// });

// // Obtener libros (con filtro opcional por genre y author)
// bookRouter.get('/books', (req, res) => {
//   const filter: any = {};
//   if (req.query.genre) {
//     filter.genre = req.query.genre.toString();
//   }
//   if (req.query.author) {
//     filter.author = req.query.author.toString();
//   }

//   Book.find(filter).then((books) => {
//     res.send(books);
//   }).catch(() => {
//     res.status(500).send();
//   });
// });

// // buscar un libro segun su id de mongodb
// bookRouter.get('/books/:id', (req, res) => {
//   Book.findById(req.params.id).then((book) => {
//     if (!book) {
//       res.status(404).send();
//     } else {
//       res.send(book);
//     }
//   }).catch(() => {
//     res.status(400).send();
//   });
// });

// bookRouter.patch('/books/:id', (req, res) => {
//   if (!req.body) {
//     res.status(400).send({
//       error: 'Fields to be modified have to be provided in the request body',
//     });
//   } else {
//     const allowedUpdates = ['title', 'author', 'genre', 'year', 'pages', 'avaliable', 'rating'];
//     const actualUpdates = Object.keys(req.body);
//     const isValidUpdate =
//         actualUpdates.every((update) => allowedUpdates.includes(update));

//     if (!isValidUpdate) {
//       res.status(400).send({
//         error: 'Update is not permitted',
//       });
//     } else {
//       Book.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//       }).then((book) => {
//         if (!book) {
//           res.status(404).send();
//         } else {
//           res.send(book);
//         }
//       }).catch((error) => {
//         res.status(400).send(error);
//       });
//     }
//   }
// });

// bookRouter.delete('/books/:id', (req, res) => {
//   Book.findByIdAndDelete(req.params.id).then((book) => {
//     if (!book) {
//       res.status(404).send();
//     } else {
//       res.send(book);
//     }
//   }).catch(() => {
//     res.status(400).send();
//   });
// });