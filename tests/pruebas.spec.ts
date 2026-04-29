import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Book } from "../src/models/note.js";

beforeEach(async () => {
  await Book.deleteMany();
});

describe("API de Libros", () => {
    
  test("Debería crear un libro correctamente", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(201); 

    expect(response.body.title).toBe("Cien años de soledad");
  });

  test("Debería crear un libro correctamente y dar error", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(201); 
    expect(response.body.title).toBe("Cien años de soledad");

      const response2 = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(400); 
    
    expect(response2.body).toHaveProperty("code", 11000);
  });

  test("Debería eliminar un libro correctamente", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(201); 

    const bookId = response.body._id;

    const res = await request(app)
        .delete(`/books/${bookId}`)
        .expect(200);

    expect(res.body._id).toBe(bookId);
  });

  test("Debería eliminar un libro y dar error", async () => {
    const response = await request(app)
        .delete(`/books/987`)
        .expect(400); 
  });

  test("Debería obtener libros por genero y autor correctamente", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(201);
      
    const res = await request(app)
        .get(`/books?genre=Fiction&author=Gabriel García Márquez`)
        .expect(200);
    
    expect(res.body[0].title).toBe("Cien años de soledad");
  });

  test('Deberia obtener un libro por su id correctamente', async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(201);

    const bookId = response.body._id;

    const res = await request(app)
        .get(`/books/${bookId}`)
        .expect(200);

    expect(res.body.title).toBe("Cien años de soledad");
  });

  test('Deberia obtener un libro por su id y tener error si no existe', async () => {
    const bookId = 4456;
    const res = await request(app)
        .get(`/books/${bookId}`)
        .expect(400);

  });

  test('Deberia editar un libro por su id correctamente', async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(201);

    expect(response.body.title).toBe("Cien años de soledad");

    const bookId = response.body._id;

    const res = await request(app)
        .patch(`/books/${bookId}`)
        .send({
          title: "Cien años de soledad2",
        })
        .expect(200);
    
    expect(res.body.title).toBe("Cien años de soledad2");

  });

  test('Deberia editar un libro por su id pero da error porque se intenta modificar el isbn', async () => {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Fiction",
        year: 1967,
        isbn: "9780307474728", 
        pages: 417
      })
      .expect(201);

    expect(response.body.title).toBe("Cien años de soledad");

    const bookId = response.body._id;

    const res = await request(app)
        .patch(`/books/${bookId}`)
        .send({
          title: "Cien años de soledad2",
          isbn: "9780307474728",
        })
        .expect(400);
    
    expect(res.body).toHaveProperty("error", 'Invalid updates!');
  });



});
