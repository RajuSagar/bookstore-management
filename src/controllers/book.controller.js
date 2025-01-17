const Book = require('../models/book.model');
const Author = require('../models/author.model');
const Literature = require('../models/literature.model');
const path = require('path');
const fs = require('fs');


const addBook = async (req, res) => {
    try {
      const { name, price, authors, literatures, availableLocations, publishedDate, totalAvailability, publisher } = req.body;
      // Directly add author and literature IDs to the book
      const newBook = new Book({
        name,
        price,
        authors: authors,  // Assuming authors is an array of author IDs
        literatures: literatures,
        image: req.file.filename,
        availableLocations,  // Assuming literatures is an array of literature IDs
        publishedDate,
        publisher,
        totalAvailability
      });
  
      const savedBook = await newBook.save();
      res.json(savedBook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const allBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('authors literatures availableLocations');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getById = async (req, res) => {
  try {
    const {id} = req.params;
    const books = await Book.findOne({_id:id}).populate('authors literatures availableLocations');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const allAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const allLiteratures = async (req, res) => {
  try {
    const authors = await Literature.find();
    console.log(authors);
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const booksByLocation = async (req, res) => {
  const locationId = req.params.locationId;

  try {
    const books = await Book.find({ availableLocations: locationId }).populate('authors literatures availableLocations');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const booksByLiteratureandLocation = async (req, res) => {
  const literatureId = req.params.literatureId;
  const locationId = req.params.locationId;

  try {
    const books = await Book.find({ literatures: literatureId, availableLocations: locationId }).populate('authors literatures availableLocations');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const booksByLiterature = async (req, res) => {
  const literatureId = req.params.literatureId;

  try {
    const books = await Book.find({ literatures: literatureId }).populate('authors literatures availableLocations');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const editBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { name,          publisher,          publishedDate,          totalAvailability } = req.body;
    
        const existingBook = await Book.findById(bookId);
        
        if (!existingBook) {
        return res.status(404).json({ error: 'Book not found' });
        }
    
        // Directly update author and literature IDs of the book
        existingBook.name = name;
        existingBook.publisher = publisher;
        existingBook.publishedDate = publishedDate;
        existingBook.totalAvailability = totalAvailability;
    
        const updatedBook = await existingBook.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteBook = async (req, res) => {
    try {
      const bookId = req.params.id;
      var deletedBook = await Book.findOne({_id:bookId});
      
      if (!deletedBook) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Delete associated image file
      // const imagePath = path.join('./public/images', deletedBook.image);
      // fs.unlinkSync(imagePath);
      deletedBook.totalAvailability = 0;
      await deletedBook.save();
  
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const addAuthor = async (req, res) => {
    try {
      const { name } = req.body;
      const newAuthor = new Author({ name});
      const savedAuthor = await newAuthor.save();
      res.json(savedAuthor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const addLiterature = async (req, res) => {
    try {
      const { name} = req.body;
      const newLiterature = new Literature({ name });
      const savedLiterature = await newLiterature.save();
      res.json(savedLiterature);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addBook,
    allBooks,
    allAuthors,
    allLiteratures,
    editBook,
    deleteBook,
    addAuthor,  
    booksByLocation,
    booksByLiterature,
    booksByLiteratureandLocation,
    addLiterature,
    getById
}