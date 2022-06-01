const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/bookmarker');

const Bookmark = conn.define('bookmark',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    url:{
        type: Sequelize.STRING,
        allowNull: false
    }
});
const Category = conn.define('category',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Bookmark.belongsTo(Category);
Category.hasMany(Bookmark);
module.exports = {
    conn,
    Bookmark,
    Category
};



