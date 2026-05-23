import db from './db.js'

const getAllCategories = async() => {
    const query = `
                    SELECT c.category_name
                    FROM category c;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllCategories} 