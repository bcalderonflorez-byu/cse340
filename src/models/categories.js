import db from './db.js'

const getAllCategories = async() => {
    const query = `
                    SELECT c.category_name, c.category_id
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
        SELECT sp.project_id, sp.title, c.category_name, c.category_id
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

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

const createCategory = async (category_name) => {
    const query = `
      INSERT INTO category(category_name)
	  VALUES ($1)
      RETURNING category_id;
    `;

    const queryParams = [category_name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
}

const  updateCategory = async (category_id, category_name) => {
  const query = `
    UPDATE category
	SET category_name=$2
	WHERE category_id=$1
    RETURNING category_id;
  `;

  const queryParams = [category_id, category_name];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated category with ID:', category_id);
  }

  return result.rows[0].category_id;
};

export {getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory, updateCategoryAssignments, createCategory, updateCategory} 