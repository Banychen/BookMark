const express = require("express");
const app =  express();

const db =  require("./db");
const { conn, Bookmark, Category } = db;

app.get('/',(req,res)=> res.redirect('/bookmarks'));

app.get('/bookmarks', async (req, res, next)=>{
    
    try{
        const bookmarks = await Bookmark.findAll({
            include:[Category]
            });
        
        res.send(`
        <!DOCTYPE html>
        <html>
    <meta name="viewport" content="width=device-width, initial-scale=1">
        <head>
        <title>Bookmarker</title>
        </head>
        <body>
        <h1>Bookmark</h1>
        ${
            bookmarks.map(
            bookmark =>{
                return `<li>
                ${ bookmark.name}
                <a href='/categories/${bookmark.categoryId}'>${bookmark.category.name}</a>
                </li>`;
            }).join('')
        }
        </body>
        </html>
        `);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/categories/:id', async (req, res, next)=>{
    try{
        const category = await Category.findByPk(req.params.id, {
        include:[Bookmark]    
        });
      
        res.send(`
          <!DOCTYPE html>
        <html>
    <meta name="viewport" content="width=device-width, initial-scale=1">
        <head>
        <title>Bookmarks for ${category.name}</title>
        </head>
        <body>
        <h1>Bookmarks for ${category.name}</h1>
        <a href="/bookmarks">All Bookmarks</a>
        <ul>
        ${
            category.bookmarks.map(
            currentValue =>{
                return `<li>
               ${currentValue.name}
                </li>`;
            }).join('')
        }
        </ul>
        </body>
        </html>
        
        `)
    }
    catch(ex)
    {
        next(ex);
    }
})

const init = async()=> {
  try{
  await conn.sync({ force: true});
  const code = await Category.create({name:"code"});
  const search = await Category.create({name:"search"});
  const jobs = await Category.create({name:"jobs"});
  await Bookmark.create({name: 'Google', url:'https://www.google.com/', categoryId: search.id});
  await Bookmark.create({name: 'Stack Overflow', url:'https://stackoverflow.com/', categoryId: code.id});
  await Bookmark.create({name: 'Bing', url:'https://www.bing.com/', categoryId: search.id});
  await Bookmark.create({name: 'LinkedIn', url:'https://www.linkedin.com/', categoryId: jobs.id});
  await Bookmark.create({name: 'Indeed', url:'https://www.indeed.com/', categoryId: jobs.id});
  await Bookmark.create({name: 'MDN', url:'https://developer.mozilla.org/en-US/', categoryId: code.id});
  
  const port = process.env.PORT || 3000;
  app.listen(port,()=>{
      console.log(`listening on port ${port}`);
  });
  
  }
  catch(ex){
      console.log(ex);
  }
};

init();