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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };