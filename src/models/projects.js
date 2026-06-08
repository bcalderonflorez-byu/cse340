import db from './db.js'

const getAllProjects = async() => {
    const query = `
                SELECT sp.project_id, sp.organization_id, o.name, sp.title, sp.description, sp.location, sp.project_date
                FROM public.projects sp
                INNER JOIN public.organization o 
                on o.organization_id = sp.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};


const getUpcomingProjects = async (number_of_projects) => {
      const query = `
        SELECT 
          sp.project_id,
          sp.title,
          sp.description,
          sp.project_date,
          sp.location,
          sp.organization_id,
          o.name
        FROM public.projects sp
        INNER JOIN public.organization o 
        on o.organization_id = sp.organization_id
        WHERE sp.project_date > current_date 
        ORDER BY sp.project_date asc
        LIMIT $1;
      `;
      
      const queryParams = [number_of_projects];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getProjectDetails = async (id) => {
      const query = `
        SELECT 
          sp.project_id,
          sp.title,
          sp.description,
          sp.project_date,
          sp.location,
          sp.organization_id,
          o.name
        FROM public.projects sp
        INNER JOIN public.organization o 
        on o.organization_id = sp.organization_id
        WHERE sp.project_id = $1;
      `;
      
      const queryParams = [id];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};


const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO projects (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const  updateProject = async (project_id, organizationId, title, description, location, date) => {
  const query = `
    UPDATE projects
    SET organization_id=$2, title=$3, description=$4, location=$5, project_date=$6
    WHERE project_id=$1
    RETURNING project_id;
  `;

  const queryParams = [project_id, organizationId, title, description, location, date];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', project_id);
  }

  return result.rows[0].project_id;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject };