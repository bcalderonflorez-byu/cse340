import db from './db.js'

const getAllCategories = async() => {
    const query = `
                    SELECT c.category_name
                    FROM category c;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
      const query = `
      SELECT category_id,category_name
      FROM category c
      WHERE category_id = $1;
    `;

      const queryParams = [categoryId];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProject = async (projectId) => {
      const query = `
        SELECT sp.project_id, sp.title, c.category_name
        FROM projects sp
        JOIN project_category pc
        ON sp.project_id = pc.project_id
        JOIN category c
        ON pc.category_id = c.category_id
        WHERE sp.project_id = $1;
    `;

      const queryParams = [projectId];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows;
};

const getProjectsByCategory = async (categoryId) => {
      const query = `
            SELECT 	
                c.category_id, c.category_name,
                sp.project_id,
                sp.title,
                sp.description,
                sp.project_date,
                sp.location,
                sp.organization_id
            FROM projects sp
            JOIN project_category pc
            ON sp.project_id = pc.project_id
            JOIN category c
            ON pc.category_id = c.category_id
            WHERE pc.category_id = $1;
    `;

      const queryParams = [categoryId];
      const result = await db.query(query, queryParams);

      
      return result.rows;
};

export {getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory} 