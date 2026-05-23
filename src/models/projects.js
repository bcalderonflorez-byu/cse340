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

export {getAllProjects} 