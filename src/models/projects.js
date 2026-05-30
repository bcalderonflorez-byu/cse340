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
// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };