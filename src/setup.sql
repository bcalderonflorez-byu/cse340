-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT organization_id, name, description, contact_email, logo_filename
FROM public.organization;

-- ========================================
-- projects Table
-- ========================================
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: projects
-- ========================================
INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES
(1,'Community Food Drive','Collect and distribute food donations.','New York','2026-06-15'),
(2,'Neighborhood House Build','Volunteer construction project.','Chicago','2026-07-10'),
(3,'School Supply Campaign','Provide educational materials for children.','Washington','2026-08-05');

INSERT INTO projects (organization_id,title,description,location,project_date)
VALUES
(1,'Blood Donation Drive','Community blood donation event to support local hospitals.','Boston','2026-09-12'),
(2,'Community Garden Initiative','Volunteers create and maintain a neighborhood garden.','Denver','2026-09-20'),
(3,'Back-to-School Backpack Giveaway','Distribute backpacks and school supplies to students.','Atlanta','2026-08-15'),
(1,'Senior Center Support Day','Assist senior citizens with activities and facility improvements.','Philadelphia','2026-10-03'),
(2,'Park Cleanup Project','Remove litter and improve local park facilities.','Seattle','2026-07-25'),
(3,'Youth Mentorship Workshop','Provide career guidance and mentoring for teenagers.','Dallas','2026-11-07'),
(1,'Holiday Food Basket Program','Prepare and distribute food baskets to families in need.','Miami','2026-12-05'),
(2,'Home Repair Assistance','Help elderly homeowners with minor repairs and maintenance.','Phoenix','2026-08-29'),
(3,'Community Health Fair','Offer free health screenings and wellness education.','Los Angeles','2026-10-17'),
(1,'Literacy Tutoring Program','Provide reading and writing support for children.','San Diego','2026-09-05');

SELECT sp.project_id, sp.organization_id, o.name, sp.title, sp.description, sp.location, sp.project_date
FROM public.projects sp
INNER JOIN public.organization o 
on o.organization_id = sp.organization_id;

-- ========================================
-- Insert sample data: category
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Insert sample data: category
-- ========================================
INSERT INTO category (category_name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Insert sample data: project_category
-- ========================================
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: project_category
-- ========================================
INSERT INTO project_category
(project_id, category_id)
VALUES
(1,3),
(1,2),
(2,2),
(3,1),
(3,2);

INSERT INTO project_category
(project_id, category_id)
VALUES
(4,3),
(5,2),
(6,2),
(7,1),
(8,2),
(9,3),
(10,4),
(11,4),
(12,2),
(13,4);

SELECT sp.project_id, sp.title, c.category_name
FROM projects sp
JOIN project_category pc
ON sp.project_id = pc.project_id
JOIN category c
ON pc.category_id = c.category_id
ORDER BY sp.project_id;


-- ========================================
-- Select LIMIT num of projects
-- ========================================
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
LIMIT 5;


-- ========================================
-- Select project by ID
-- ========================================
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
WHERE sp.project_id = 8;



-- ========================================
-- Recuperar una sola categoría por su ID.
-- Recuperar todas las categorías de un proyecto de servicio determinado.
-- Recuperar todos los proyectos de servicio para una categoría determinada.
-- ========================================

SELECT category_id,category_name
FROM category c
WHERE category_id = 1;

SELECT sp.project_id, sp.title, c.category_name
FROM projects sp
JOIN project_category pc
ON sp.project_id = pc.project_id
JOIN category c
ON pc.category_id = c.category_id
WHERE sp.project_id = 4;

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
WHERE pc.category_id = 3;

